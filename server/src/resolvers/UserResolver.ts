import {
	Resolver,
	Mutation,
	Field,
	Arg,
	Ctx,
	ObjectType,
	Query,
} from 'type-graphql';
import { MyContext } from 'src/types';
import { User } from '../entities/User';
import argon from 'argon2';
import { RegisterUserInput } from './RegisterUserInput';
import { validateRegister } from '../utils/ValidateRegister';

@ObjectType()
class FieldError {
	@Field(() => String, { nullable: true })
	field?: string;
	@Field()
	message: string;
}

@ObjectType()
class UserErrorResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver(User)
export class UserResolver {
	@Query(() => User, { nullable: true }) me(@Ctx() { req, em }: MyContext) {
		// no user
		if (!req.session.user) {
			return null;
		}
		const user = em.findOne(User, { email: req.session.user });

		return user;
	}

	@Mutation(() => UserErrorResponse)
	async register(
		@Arg('option') options: RegisterUserInput,
		@Ctx() { em, req }: MyContext
	): Promise<UserErrorResponse> {
		const errors = validateRegister(options);
		if (errors.length > 0) {
			return {
				errors,
			};
		}

		const hashed = await argon.hash(options.password);
		const user = em.create(User, {
			username: options.username,
			email: options.email,
			password: hashed,
		});
		try {
			await em.persist(user, true);
		} catch (error) {
			if (error.detail.includes('already exists')) {
				const key = error.detail.match(new RegExp('(email|username)'));
				return {
					errors: [
						{
							message: `user with that ${key[0]} exists`,
							field: key[0],
						},
					],
				};
			}
		}
		req.session.user = user.email;
		return { user };
	}

	@Mutation(() => UserErrorResponse)
	async login(
		@Arg('inputUser') inputUser: string,
		@Arg('password') password: string,
		@Ctx() { em, req }: MyContext
	): Promise<UserErrorResponse> {
		const re = /\S+@\S+\.\S+/;

		const user = await em.findOne(
			User,
			re.test(inputUser) ? { email: inputUser } : { username: inputUser }
		);

		if (user) {
			const valid = await argon.verify(user.password, password);
			if (valid) {
				req.session!.user = user.email;

				return {
					user,
				};
			}
		}
		return {
			errors: [
				{
					message: 'Invalid username password combination',
				},
			],
		};
	}

	@Mutation(() => Boolean)
	logout(@Ctx() { req, res }: MyContext) {
		return new Promise((resolve) =>
			req.session.destroy((err) => {
				res.clearCookie(process.env.COOKIE_NAME!);
				if (err) {
					console.log(err);
					resolve(false);
					return;
				}

				resolve(true);
			})
		);
	}
}
