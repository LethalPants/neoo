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
	@Mutation(() => User)
	async register(
		@Arg('option') options: RegisterUserInput,
		@Ctx() { em }: MyContext
	) {
		const hashed = await argon.hash(options.password);
		const user = em.create(User, {
			username: options.username,
			email: options.email,
			password: hashed,
		});

		await em.persistAndFlush(user);
		return user;
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
