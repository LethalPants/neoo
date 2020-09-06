import { InputType, Field } from 'type-graphql';
@InputType()
export class RegisterUserInput {
	@Field()
	username: string;

	@Field()
	password: string;

	@Field()
	email: string;
}
