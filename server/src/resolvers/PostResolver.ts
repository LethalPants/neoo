import { Query, Resolver, Arg, Int, Mutation } from 'type-graphql';
import { Post } from '../entities/Post';

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	posts(): Promise<Post[]> {
		return Post.find(Post, {});
	}

	@Query(() => Post, { nullable: true })
	post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
		return Post.findOne(id);
	}

	@Mutation(() => Post, { nullable: true })
	async createPost(@Arg('title', () => String) title: string): Promise<Post> {
		const post = Post.create({ title }).save();
		return post;
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(
		@Arg('id') id: number,
		@Arg('title') title: string
	): Promise<Post | null> {
		const post = await Post.findOne(id);
		if (!post) {
			return null;
		}
		await Post.update({ id }, { title });
		return post;
	}

	@Mutation(() => Boolean)
	async deletePost(@Arg('id') id: number): Promise<Boolean> {
		await Post.delete(id);
		return true;
	}
}
