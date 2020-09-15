import { ObjectType, Field, Int } from 'type-graphql';
import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	BaseEntity,
	ManyToOne,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column({ type: 'text' })
	title!: string;

	@Field(() => String, { nullable: true })
	@Column({ type: 'text', nullable: true })
	body: string;

	@Field()
	@Column({ type: 'int', default: 0 })
	points!: number;

	@ManyToOne(() => User, (user) => user.posts)
	user: User;

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;
}
