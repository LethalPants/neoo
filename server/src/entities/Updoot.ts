import { ObjectType, Field } from 'type-graphql';
import { Entity, Column, BaseEntity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
	@Column({ type: 'int' })
	value: number;

	@Field()
	@PrimaryColumn()
	userId: number;

	@Field()
	@PrimaryColumn()
	postId: number;

	@Field(() => User)
	@ManyToOne(() => User, (user: User) => user.updoots)
	user: User;

	@Field(() => Post)
	@ManyToOne(() => Post, (post: Post) => post.updoots)
	post: Post;
}
