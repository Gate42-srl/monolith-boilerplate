import * as nodemailer from "nodemailer"
import { logger } from "../winston"

const NO_REPLY_EMAIL = "no-reply@boilerplate.it"

// MAIL TRANSPORTER
/*const transporter: nodemailer.Transporter = nodemailer.createTransport({
  host: "smtp.ionos.it",
  port: 465,
  secure: true, // use TLS
  // requireTLS: true,
  tls: { rejectUnauthorized: false },
  auth: {
    user: "",
    pass: "",
  },
})*/

// TESTING TRANSPORTER
const transporter: nodemailer.Transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "",
    pass: "",
  }, // Use some mailtrap account to test
})

// Sends an email to specified email address from "no-reply@boilerplate.it"
export const sendEmail = async (data: any) => {
  // On fulfilled sends the mail successfully, on rejected logs the error
  await transporter
    .sendMail({
      from: NO_REPLY_EMAIL,
      to: data.recipient,
      subject: !data.subject ? "Comunication" : data.subject,
      html: !data.emailBody ? "" : data.emailBody,
      attachments: !data.attachments ? [] : data.attachments,
    })
    .catch((error: any) => {
      // log the error
      logger.error(error.stack)
    })
}
