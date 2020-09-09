import { MiddlewareFn } from 'type-graphql';
import { MyContext } from 'src/types';

export const isUser: MiddlewareFn<MyContext> = ({ context }, next) => {
	if (!context.req.session.user) {
		throw new Error('not authenticated');
	}

	return next();
};