import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  @Field(() => Number, { nullable: true })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity = 1;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  completed = false;

  @Field(() => ID)
  @IsUUID()
  listId: string;

  @Field(() => ID)
  @IsUUID()
  itemId: string;
}
