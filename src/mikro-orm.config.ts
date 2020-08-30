import { MikroORM } from '@mikro-orm/core';
import { Post } from './entities/Post';
import path from 'path';
import { __prod__ } from './constants';

if (!__prod__) {
	require('dotenv').config();
}

export default {
	dbName: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	type: 'postgresql',
	debug: !__prod__,
	entities: [Post],
	migrations: {
		path: path.join(__dirname, './migrations'),
		pattern: /^[\w-]+\d+\.[tj]s$/,
	},
} as Parameters<typeof MikroORM.init>[0];
