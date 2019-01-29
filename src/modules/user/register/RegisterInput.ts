import { InputType, Field } from "type-graphql";
import { IsEmail } from "class-validator";
import { IsEmailUnique } from "./IsEmailUnique";
import { UserRole } from "../../../entities/user";

@InputType()
export class RegisterInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailUnique({ message: "Email is already in use" })
  email: string;

  @Field()
  password: string;

  @Field(() => UserRole, { nullable: true })
  role: UserRole;
}
