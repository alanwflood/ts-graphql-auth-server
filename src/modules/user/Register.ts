import { Resolver, Mutation, Arg } from "type-graphql";
import argon2 from "argon2";
import { User } from "../../entities";
import { RegisterInput } from "./register/RegisterInput";
import { sendConfirmation } from "./Confirm";

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

      await sendConfirmation(user.email, user.id);

      return user;
    } catch (err) {
      console.log("Error creating user:", err);
      return err;
    }
  }
}
