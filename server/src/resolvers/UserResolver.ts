import argon from 'argon2';
import { MyContext } from 'src/types';
import {
	Arg,
	Ctx,
	Field,
	FieldResolver,
	Mutation,
	ObjectType,
	Query,
	Resolver,
	Root
} from 'type-graphql';
import { User } from '../entities/User';
import { validateRegister } from '../utils/ValidateRegister';
import { RegisterUserInput } from './RegisterUserInput';

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
	@FieldResolver(() => String)
	email(@Root() user: User, @Ctx() { req }: MyContext) {
		// this is the current user and its ok to show them their own email
		if (req.session.userId === user.id) {
			return user.email;
		}
		// current user wants to see someone elses email
		return '';
	}

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
				errors
			};
		}

		const hashed = await argon.hash(options.password);
		let user: any;
		try {
			const result = await User.create({
				username: options.username,
				email: options.email,
				password: hashed
			}).save();
			user = result;
		} catch (error) {
			if (error.code === '23505') {
				const key = error.detail.match(new RegExp('(email|username)'));
				return {
					errors: [
						{
							message: `user with that ${key[0]} exists`,
							field: key[0]
						}
					]
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
					user
				};
			}
		}
		return {
			errors: [
				{
					message: 'Invalid username password combination'
				}
			]
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
