// server/sendgrid.ts
import sgMail, { MailDataRequired } from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY missing. Add it in Replit Secrets.");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendContactEmail(input: {
  name: string;
  email: string;   // visitor's email
  message: string;
}) {
  const { name, email, message } = input;

  const msg: MailDataRequired = {
    to: "kayne@pooldesignconsultant.com",                 // where you receive it
    from: "kayne@pooldesignconsultant.com", // must be verified (Single Sender) or match your authenticated domain
    replyTo: { email, name },                              // so you can reply directly to the visitor
    subject: `New Inquiry from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, "<br>")}</p>`,
    mailSettings: { sandboxMode: { enable: false } },      // make sure sandbox is OFF
  };

  await sgMail.send(msg);
}