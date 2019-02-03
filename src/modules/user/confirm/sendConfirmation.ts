import createToken from "../../../utils/createToken";
import sendEmail from "../../../utils/sendEmail";

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
