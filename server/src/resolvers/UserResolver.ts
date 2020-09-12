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
	@Query(() => User, { nullable: true })
	me(@Ctx() { req }: MyContext) {
		// no user
		console.log(req.session.user);
		if (!req.session.user) {
			return null;
		}
		return User.findOne({ where: { id: req.session.user } });
	}

	@Mutation(() => UserErrorResponse)
	async register(
		@Arg('option') options: RegisterUserInput,
		@Ctx() { req }: MyContext
	): Promise<UserErrorResponse> {
		const errors = validateRegister(options);
		if (errors.length > 0) {
			return {
				errors,
			};
		}

		const hashed = await argon.hash(options.password);
		let user: any;
		try {
			const result = await User.create({
				username: options.username,
				email: options.email,
				password: hashed,
			}).save();
			user = result;
		} catch (error) {
			if (error.code === '23505') {
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
			console.log(error);
			return { errors: [error] };
		}
		req.session.user = user!.id;
		return { user };
	}

	@Mutation(() => UserErrorResponse)
	async login(
		@Arg('inputUser') inputUser: string,
		@Arg('password') password: string,
		@Ctx() { req }: MyContext
	): Promise<UserErrorResponse> {
		const re = /\S+@\S+\.\S+/;

		const user = await User.findOne(
			re.test(inputUser)
				? { where: { email: inputUser } }
				: { where: { username: inputUser } }
		);

		if (user) {
			const valid = await argon.verify(user.password, password);
			if (valid) {
				req.session!.user = user.id;

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
