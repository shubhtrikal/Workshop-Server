import nodemailer from 'nodemailer';
import env from 'dotenv';
import mailgun from 'mailgun-js';
import Promo from './models/Promo';
const DOMAIN = 'istescmanit.in';
const mg = mailgun({
  apiKey: 'dummyKey',
  domain: DOMAIN,
});

env.config();

export const sendMail = (
  name: string,
  email: string,
  workshopA: boolean,
  workshopB: boolean
) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL_ID,
      pass: process.env.SENDER_EMAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.SENDER_EMAIL_ID,
    to: email,
    subject: `Confirmation Email for registering to Version Beta 4.0 Workshop`,
    text: ` Hi ${name},\n Greetings! \n Thank you for enrolling for Version Beta 4.0 Workshop. Your registration and payment are received successfully. We will be soon back to you with the details about how to attend the workshop.\n\n
      Have questions about Version Beta 4.0 workshop or Version Beta 4.0?\nWe would love to help! Just hit reply.\n\nRegards,\nISTE SC MANIT Team`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return null;
    } else {
      console.log('Email sent: ' + info.response);
      return null;
    }
  });
};

export const sendMail2 = (
  name: string,
  email: string,
  dataScience: boolean,
  dataStructure: boolean
) => {
  const data = {
    from: 'Excited User <kdevanshsharma23@gmail.com>',
    to: `dksofficial23@gmail.com `,
    subject: 'Hello',
    text: 'Testing some Mailgun awesomness!',
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
    console.log(error);
  });
};

export const updatePromo = async (code: string, id: string) => {
  console.log('testing update', id, code);
  try {
    await Promo.updateOne(
      { promoCode: code },
      { $addToSet: { participants: [id] } }
    );
  } catch (e) {
    console.log(e);
  }
};
