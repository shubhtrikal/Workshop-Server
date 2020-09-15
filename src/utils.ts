import nodemailer from "nodemailer";
import env from "dotenv";

env.config();

export const sendMail = (
  name: string,
  email: string,
  dataScience: boolean,
  dataStructure: boolean
) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL_ID,
      pass: process.env.SENDER_EMAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.SENDER_EMAIL_ID,
    to: email,
    subject: `Confirmation Email for registering to Version Beta 3.0 Workshop`,
    text: ` Hi ${name},\n Greetings! \n Thank you for enrolling for Version Beta 3.0 Workshop. Your registration and payment are received successfully. We will be soon back to you with the details about how to attend the workshop.\n\n
      Have questions about Version Beta 3.0 workshop or Version Beta 3.0?\nWe would love to help! Just hit reply.\n\nRegards,\nISTE SC MANIT Team`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return null;
    } else {
      console.log("Email sent: " + info.response);
      return null;
    }
  });
};
