import { Request, Response } from 'express';
import { createUpdootLoader } from './utils/createUpdootLoader';

export type MyContext = {
	req: Request & { session: Express.Session };
	res: Response;
	updootLoader: ReturnType<typeof createUpdootLoader>;
};
