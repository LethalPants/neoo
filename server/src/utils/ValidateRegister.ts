import { RegisterUserInput } from '../resolvers/RegisterUserInput';

type errorType = { message: string; field: string };

export const validateRegister = (
	options: RegisterUserInput
): Array<errorType> => {
	const re = /\S+@\S+\.\S+/;
	const errors = [];
	if (options.username.length < 3) {
		errors.push({
			message: 'Username must be at least 3 characters in length.',
			field: 'username',
		});
	}

	if (options.username.includes('@')) {
		errors.push({
			message: 'Username must be at least 3 characters in length.',
			field: 'username',
		});
	}

	if (options.password.length < 8) {
		errors.push({
			message: 'Password must be at least 8 characters in length.',
			field: 'password',
		});
	}
	if (!re.test(options.email)) {
		errors.push({
			message: 'Invalid email.',
			field: 'email',
		});
	}
	return errors;
};
