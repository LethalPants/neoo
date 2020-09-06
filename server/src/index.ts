import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/PostResolver';
import { UserResolver } from './resolvers/UserResolver';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { __prod__ } from './constants';
import cors from 'cors';

const main = async () => {
	const orm = await MikroORM.init(mikroOrmConfig);
	await orm.getMigrator().up();
	const app = express();

	const RedisStore = connectRedis(session);
	const redisClient = redis.createClient();

	app.use(
		cors({
			origin: process.env.CORS_ORIGIN,
			methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
			credentials: true,
		})
	);

	app.use(
		session({
			store: new RedisStore({
				client: redisClient,
				disableTouch: true,
			}),
			name: process.env.COOKIE_NAME,
			secret: 'faihjigfsg3rt8guhsjfasjdkgjoaisd',
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365,
				httpOnly: true,
				secure: __prod__,
				sameSite: 'lax',
			},
		})
	);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [PostResolver, UserResolver],
			validate: false,
		}),

		context: ({ req, res }) => ({ em: orm.em, req, res }),
	});

	apolloServer.applyMiddleware({
		app,
		cors: {
			origin: process.env.CORS_ORIGIN,
			credentials: true,
		},
	});

	const PORT = process.env.PORT;
	app.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
};

main();
