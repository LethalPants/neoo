import {
	Arg,
	Ctx,
	Field,
	FieldResolver,
	Int,
	Mutation,
	ObjectType,
	Query,
	Resolver,
	Root,
	UseMiddleware
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Post } from '../entities/Post';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types';

@ObjectType()
class PaginatedPosts {
	@Field(() => [Post])
	posts: Post[];
	@Field()
	hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
	@FieldResolver(() => String)
	textSnippet(@Root() root: Post) {
		return root.body ? root.body.slice(0, 100) : '';
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	vote(
		@Arg('postId', () => Int) postId: number,
		@Arg('value', () => Int) value: number,
		@Ctx() { req }: MyContext
	) {
		const isUpdoot = value !== -1;
		const upVal = isUpdoot ? 1 : -1;
		const { user } = req.session;
		// TODO : ADD UPDOOT TRANSACTION
	}

	@Query(() => PaginatedPosts)
	async posts(
		@Arg('limit', () => Int) limit: number,
		@Arg('cursor', () => String, { nullable: true }) cursor: string | null
	): Promise<PaginatedPosts> {
		const realLimit = Math.min(50, limit);
		const rl = realLimit + 1;

		const replacements: any[] = [rl];

		if (cursor) {
			replacements.push(new Date(parseInt(cursor)));
		}

		const posts = await getConnection().query(
			`
			select p.*,
			json_build_object(
				'username', u.username,
				'email', u.email
			) creator
			from post p
			inner join public.user u on u.id = p."creatorId"
			${cursor ? `where p."createdAt" < $2` : ''}
			order by p."createdAt" DESC
			limit $1
		`,
			replacements
		);

		return {
			posts: posts.slice(0, realLimit),
			hasMore: posts.length === rl
		};
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
		const post = Post.create({ title, body, creator: req.session.user }).save();
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
