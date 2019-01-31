import { Resolver, Mutation, Arg, Field, InputType } from "type-graphql";
import { IsUUID, IsEmail } from "class-validator";
import { User } from "../../entities";
import redis from "../../utils/redisStore";
import createToken from "../../utils/createToken";
import sendEmail from "../../utils/sendEmail";

@InputType()
class ConfirmUserInput {
  @Field()
  @IsUUID("4")
  token: string;
}

@InputType()
class ResendUserConfirmationInput {
  @Field()
  @IsEmail()
  email: string;
}

@Resolver()
export class ConfirmResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("input")
  {
    token
  }: ConfirmUserInput): Promise<void | Boolean> {
    try {
      // Get user Id from redis token
      const userId = await redis.get(token);
      if (!userId) throw new Error("User ID not found from token");

      // Get user from database with users Id
      const user = await User.findOne(userId);
      if (!user) throw new Error("User not found");

      // (Slightly redundant!)
      // Only update the users confirmation if they're  unconfirmed
      if (!user.confirmed) {
        user.confirmed = true;
        user.confirmedAt = new Date();
        await user.save();
      }

      await redis.del(token);

      return user.confirmed;
    } catch (err) {
      console.log("Error confirming user:", err);
      return err;
    }
  }

  @Mutation(() => Boolean)
  async resendUserConfirmation(@Arg("input")
  {
    email
  }: ResendUserConfirmationInput): Promise<void | Boolean> {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("User not found");
      // Only send email if user is unconfirmed
      if (!user.confirmed) {
        await sendConfirmation(user.email, user.id);
      }
      return true;
    } catch (err) {
      console.log(`Error resending confirmation to email ${email}: `, err);
      return err;
    }
  }
}

export async function sendConfirmation(
  userEmail: string,
  userId: number
): Promise<void> {
  const token = await createToken(userId);

  await sendEmail({
    to: userEmail,
    text: token,
    html: `<h1>${token}</h1>`
  });
}
