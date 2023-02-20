import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  @IsString()
  @MinLength(1)
  name: string;

  @ManyToOne(() => User, (user: User) => user.lists, {
    nullable: false,
    lazy: true,
  })
  @Index('userId-list-index')
  @Field(() => User)
  user: User;
}
