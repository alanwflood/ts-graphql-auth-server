import { InputType, Field } from "type-graphql";
import { IsUUID } from "class-validator";

@InputType()
export class ChangeForgottenPasswordInput {
  @Field()
  @IsUUID("4")
  token: string;

  @Field()
  newPassword: string;
}

@InputType()
export class ChangeCurrentUserPasswordInput {
  @Field()
  currentPassword: string;

  @Field()
  newPassword: string;
}
