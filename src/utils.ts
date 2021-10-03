import env from 'dotenv';
import { google } from 'googleapis';
import Promo from './models/Promo';
import sgMail from '@sendgrid/mail';
import { UserType } from './types';

// const DOMAIN = 'istescmanit.in';
// const mg = mailgun({
//   apiKey: 'dummyKey',
//   domain: DOMAIN,
// });

env.config();

// export const sendMail = (
//   name: string,
//   email: string,
//   workshopA: boolean,
//   workshopB: boolean
// ) => {
//   var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.SENDER_EMAIL_ID,
//       pass: process.env.SENDER_EMAIL_PASSWORD,
//     },
//   });

//   var mailOptions = {
//     from: process.env.SENDER_EMAIL_ID,
//     to: email,
//     subject: `Confirmation Email for registering to Version Beta 4.0 Workshop`,
//     text: ` Hi ${name},\n Greetings! \n Thank you for enrolling for Version Beta 4.0 Workshop. Your registration and payment are received successfully. We will be soon back to you with the details about how to attend the workshop.\n\n
//       Have questions about Version Beta 4.0 workshop or Version Beta 4.0?\nWe would love to help! Just hit reply.\n\nRegards,\nISTE SC MANIT Team`,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       return null;
//     } else {
//       console.log('Email sent: ' + info.response);
//       return null;
//     }
//   });
// };

export const sendMail = (
  name: string,
  email: string,
  workshopA: boolean,
  workshopB: boolean
) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email, // Change to your recipient
    from: process.env.SENDER_EMAIL_ID, // Change to your verified sender
    subject: `Confirmation Email for registering to Version Beta 4.0 Workshop`,
    text: ` Hi ${name},\n Greetings! \n Thank you for enrolling for Version Beta 4.0 Workshop. Your registration and payment are received successfully. We will be soon back to you with the details about how to attend the workshop.\n\n
          Have questions about Version Beta 4.0 workshop or Version Beta 4.0?\nWe would love to help! Just hit reply.\n\nRegards,\nISTE SC MANIT Team`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error: any) => {
      console.error(error);
    });
};

// export const sendMail2 = (
//   name: string,
//   email: string,
//   dataScience: boolean,
//   dataStructure: boolean
// ) => {
//   const data = {
//     from: 'Excited User <kdevanshsharma23@gmail.com>',
//     to: `dksofficial23@gmail.com `,
//     subject: 'Hello',
//     text: 'Testing some Mailgun awesomness!',
//   };
//   mg.messages().send(data, function (error, body) {
//     console.log(body);
//     console.log(error);
//   });
// };

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
const auth = new google.auth.GoogleAuth({
  keyFile: 'account.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});
export const updateSheet = async (
  name: string,
  email: string,
  phone: string,
  college: string,
  workshopA: boolean,
  workshopB: boolean,
  amount: string,
  paymentId: string
) => {
  try {
    const client = await auth.getClient();
    const sheets = await google.sheets({ version: 'v4', auth: client });
    const sheetId = '1_iXtQHv3d2Wa6rn06sgUV9xb7u-_qYo48VCwXT7BjyI';

    //writing in a Sheet
    await sheets.spreadsheets.values.append({
      auth: auth,
      spreadsheetId: sheetId,
      range: 'Sheet1!A:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            name,
            email,
            phone,
            college,
            workshopA,
            workshopB,
            amount,
            paymentId,
          ],
        ],
      },
    });
    return;
  } catch (e) {
    console.log(e);
  }
};

export const updateBulkData = async (Data: UserType[]) => {
  try {
    const client = await auth.getClient();
    const sheets = await google.sheets({ version: 'v4', auth: client });
    const sheetId = '1_iXtQHv3d2Wa6rn06sgUV9xb7u-_qYo48VCwXT7BjyI';

    //writing in a Sheet
    const Temp = new Array();
    Data.map((data) => {
      const temp = new Array();
      temp.push(
        data.name,
        data.email,
        data.phone,
        data.college,
        data.workshopA,
        data.workshopB,
        data.amount,
        data.paymentId
      );
      Temp.push(temp);
    });
    console.log(Temp);

    await sheets.spreadsheets.values.append({
      auth: auth,
      spreadsheetId: sheetId,
      range: 'Sheet1!A:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: Temp,
      },
    });
    return;
  } catch (e) {
    console.log(e);
  }
};
