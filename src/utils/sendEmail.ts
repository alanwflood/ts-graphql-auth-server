import nodemailer from "nodemailer";

export default async function sendEmail({
  from = '"Fred Foo 👻" <foo@example.com>',
  to = "bar@example.com, baz@example.com",
  subject = "Hello ✔", // Subject line
  text = "Hello world?", // plain text body
  html = "<b>Hello world?</b>" // html body
}) {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const account = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass // generated ethereal password
      }
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.log("Error sending email:", err);
  }
}
