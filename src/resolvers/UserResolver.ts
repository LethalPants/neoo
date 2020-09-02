import {
	Resolver,
	Mutation,
	InputType,
	Field,
	Arg,
	Ctx,
	ObjectType,
} from 'type-graphql';
import { MyContext } from 'src/types';
import { User } from '../entities/User';
import argon from 'argon2';

@InputType()
class RegisterUserInput {
	@Field()
	username: string;

	@Field()
	password: string;

	@Field()
	email: string;
}

@InputType()
class LoginUserInput {
	@Field(() => String, { nullable: true })
	username: string;

	@Field()
	password: string;

	@Field(() => String, { nullable: true })
	email: string;
}

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

@Resolver()
export class UserResolver {
	@Mutation(() => UserErrorResponse)
	async register(
		@Arg('option') options: RegisterUserInput,
		@Ctx() { em }: MyContext
	): Promise<UserErrorResponse> {
		if (options.username.length <= 3) {
			return {
				errors: [
					{
						message:
							'username must be at least 3 characters in length.',
						field: 'username',
					},
				],
			};
		}
		if (options.password.length <= 8) {
			return {
				errors: [
					{
						message:
							'password must be at least 8 characters in length.',
						field: 'password',
					},
				],
			};
		}
		const hashed = await argon.hash(options.password);
		const user = em.create(User, {
			username: options.username,
			email: options.email,
			password: hashed,
		});
		try {
			await em.persistAndFlush(user);
		} catch (error) {
			if (error.code === '23505') {
				const key = error.detail.match(new RegExp('(email|username)'));
				return {
					errors: [
						{
							message: `${key[0]} already taken`,
							field: key[0],
						},
					],
				};
			}
		}
		return { user };
	}

	@Mutation(() => UserErrorResponse)
	async login(
		@Arg('option') options: LoginUserInput,
		@Ctx() { em }: MyContext
	): Promise<UserErrorResponse> {
		const user = options.username
			? await em.findOne(User, { username: options.username })
			: await em.findOne(User, { email: options.email });
		if (user) {
			const valid = await argon.verify(user.password, options.password);
			if (valid) {
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
}
