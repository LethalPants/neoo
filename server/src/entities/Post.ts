import { ObjectType, Field, Int } from 'type-graphql';
import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	BaseEntity,
	ManyToOne,
	OneToMany
} from 'typeorm';
import { Updoot } from './Updoot';
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

	@Field()
	@ManyToOne(() => User, (user) => user.posts)
	creator: User;

	@OneToMany(() => Updoot, (updoot) => updoot.post)
	updoots: Updoot[];

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;
}
