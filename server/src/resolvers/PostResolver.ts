import {
	Query,
	Resolver,
	Arg,
	Int,
	Mutation,
	Ctx,
	UseMiddleware,
} from 'type-graphql';
import { Post } from '../entities/Post';
import { MyContext } from '../types';
import { isAuth } from '../middleware/isAuth';

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	posts(): Promise<Post[]> {
		return Post.find();
	}

	@Query(() => Post, { nullable: true })
	post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
		return Post.findOne(id);
	}

	@Mutation(() => Post, { nullable: true })
	@UseMiddleware(isAuth)
	async createPost(
		@Arg('title', () => String) title: string,
		@Arg('body', () => String, { nullable: true }) body: string,
		@Ctx() { req }: MyContext
	): Promise<Post> {
		const post = Post.create({ title, body, user: req.session.user }).save();
		return post;
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(
		@Arg('id') id: number,
		@Arg('title') title: string,
		@Arg('body', () => String) body: string
	): Promise<Post | null> {
		const post = await Post.findOne(id);
		if (!post) {
			return null;
		}
		await Post.update({ id }, { title, body });
		return post;
	}

	@Mutation(() => Boolean)
	async deletePost(@Arg('id') id: number): Promise<Boolean> {
		await Post.delete(id);
		return true;
	}
}
