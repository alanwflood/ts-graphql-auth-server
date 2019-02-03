import { Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { IsEmail } from "class-validator";
import { User } from "../../entities";
import createToken from "../../utils/createToken";
import sendEmail from "../../utils/sendEmail";

@InputType()
class ForgotPasswordInput {
  @Field()
  @IsEmail()
  email: string;
}

@Resolver()
export class ConfirmResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("input")
  {
    email
  }: ForgotPasswordInput): Promise<void | Boolean> {
    try {
      // Find user with email
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("User not found");
      if (!user.confirmed) throw new Error("User not confirmed yet");

      // Create and send token for confirmation
      const token = await createToken(user.id);
      await sendEmail({
        to: email,
        text: token,
        html: `<h1>${token}</h1>`
      });
      return true;
    } catch (err) {
      console.log("Error for user with forgotten password:", err);
      return err;
    }
  }
}
