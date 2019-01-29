import { Resolver, Query, Mutation, Arg, Authorized } from "type-graphql";
import argon2 from "argon2";
import { User } from "../../entities";
import { RegisterInput } from "./register/RegisterInput";
import createToken from "../../utils/createToken";
import sendEmail from "../../utils/sendEmail";

@Resolver(User)
export class RegisterResolver {
  @Authorized()
  @Query(() => String)
  async testData() {
    return "Hello World";
  }

  @Mutation(() => User)
  async registerUser(@Arg("input")
  {
    firstName,
    lastName,
    email,
    password,
    role
  }: RegisterInput): Promise<void | User> {
    try {
      const hash = await argon2.hash(password);
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hash,
        role
      }).save();

      const token = await createToken(user.id, "cn-");

      await sendEmail({
        to: email,
        text: token,
        html: `<h1>${token}</h1>`
      });

      return user;
    } catch (err) {
      console.log("Error creating user:", err);
    }
  }
}
