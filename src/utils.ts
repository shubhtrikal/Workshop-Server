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
    subject: `ISTE SC MANIT Workshop`,
    text: ` Hey ${name}, You have been successfully registered for ${
      dataScience ? "Data Science" : ""
    } ${dataScience && dataStructure ? "and" : ""}
    ${
      dataStructure ? "Data Structure" : ""
    } workshops conducted by ISTE-SC MANIT, We will inform you soon about the things`,
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
