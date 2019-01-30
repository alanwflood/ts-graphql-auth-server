import { Resolver, Mutation, Arg } from "type-graphql";
import argon2 from "argon2";
import { User } from "../../entities";
import { RegisterInput } from "./register/RegisterInput";
import createToken from "../../utils/createToken";
import sendEmail from "../../utils/sendEmail";

@Resolver(User)
export class RegisterResolver {
  @Mutation(() => User)
  async registerUser(@Arg("input")
  {
    firstName,
    lastName,
    email,
    password
  }: RegisterInput): Promise<void | User> {
    try {
      const hash = await argon2.hash(password);
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hash
      }).save();

      const token = await createToken(user.id);

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
