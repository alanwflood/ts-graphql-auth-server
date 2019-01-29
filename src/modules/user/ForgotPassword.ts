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
      const user = await User.findOne({ where: { email } });
      // If user's missing throw an error
      if (!user) throw new Error("User not found");
      // If user's missing throw an error
      if (!user.confirmed) throw new Error("User not confirmed yet");
      const token = await createToken(user.id, "pr-");

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
