import express from 'express';
import shortid from 'shortid';
import Razorpay from 'razorpay';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { UserType, PromoType } from './types';
import User from './models/User';
import axios from 'axios';
import { sendMail, updatePromo, updateSheet, updateBulkData } from './utils';
import env from 'dotenv';
import Promo from './models/Promo';

env.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY,
  key_secret: process.env.RAZORPAY_TEST_SECRET,
});

app.get('/', async (req, res) => {
  res.send('Welcome To Flair Haven Server');
});
app.get('/updateSheet', async (req, res) => {
  try {
    const users: any = await User.find();
    await updateBulkData(users);
    res.json(`Sheet Updated by following data ${users}`);
  } catch (e) {
    res.send('Error, something went wrong');
  }
});
app.post('/razorpay', async (req, res) => {
  const payment_capture = 1;
  const amount = Math.ceil(req.body.amount);
  const currency = 'INR';

  const options = {
    amount: amount,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };
  console.log(amount);

  try {
    const response = await razorpay.orders.create(options);

    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: 'COULD NOT CREATE ORDER',
    });
  }
});

app.get('/count', async (req, res) => {
  const workshopA = await User.count({ workshopA: true });
  const workshopB = await User.count({ workshopB: true });

  return res.json({
    workshopA: workshopA + 16,
    workshopB: workshopB + 12,
  });
});

//EndPoint for front-end
//@ts-ignore

app.post("/save",async (req,res)=>{
  
  const user: UserType = req.body;
  console.log(user)

  const user1 = await User.findOne({email: req.body.email});
  if(user1){
      return res.status(400).json("user already exist!");
  }
  const u = new User(user);

  u.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'NOT ABLE TO SAVE USER IN DB',
      });
    }
    // const u: UserType = user.toObject({ getters: true });
    // console.log(u);
    // updateSheet(
    //   u.name,
    //   u.email,
    //   u.phone,
    //   u.college,
    //   u.workshopA,
    //   u.workshopB,
    //   u.amount,
    //   u.paymentId
    // );

    // updatePromo(req.body.code.promo, u._id);
    return res.json(user);
  });
 

});

app.post('/update', async (req, res) => {
  const user: UserType = req.body.user;
 
  try {
    const payment = await axios.get(
      `https://${process.env.RAZORPAY_TEST_KEY}:${process.env.RAZORPAY_TEST_SECRET}@api.razorpay.com/v1/payments/${user.paymentId}`
    );
    if (!payment.data.captured) {
      return res.status(400).json({
        error: 'PAYMENT WAS NOT SUCCESSFUL',
      });
    }
  } catch (e) {
    return res.status(400).json({
      error: 'PAYMENT WAS NOT SUCCESSFUL',
    });
  }
    // console.log(u);
  
    // const u: UserType = user.toObject({ getters: true })
    // console.log(req.body.user.email)
    
    User.findOneAndUpdate({email:req.body.user.email}, {$set:req.body.user}, {new: true}, (err, doc) => {
      if (err) {
          console.log("Something wrong when updating data!");
      }
      // console.log(doc);
  });

    // console.log(u);
    console.log(req.body);

    updatePromo(req.body.code.promo, user._id);

    sendMail(user.name, user.email, user.workshopA, user.workshopB, user.paymentId);
    return res.json(user);
  });


// app.post('/save', async (req, res) => {
//   const user: UserType = req.body.user;
//   const u = new User(user);

//   try {
//     const payment = await axios.get(
//       `https://${process.env.RAZORPAY_TEST_KEY}:${process.env.RAZORPAY_TEST_SECRET}@api.razorpay.com/v1/payments/${user.paymentId}`
//     );
//     if (!payment.data.captured) {
//       return res.status(400).json({
//         error: 'PAYMENT WAS NOT SUCCESSFUL',
//       });
//     }
//   } catch (e) {
//     return res.status(400).json({
//       error: 'PAYMENT WAS NOT SUCCESSFUL',
//     });
//   }
//   console.log(u);
//   u.save((err, user) => {
//     if (err) {
//       console.log(err);
//       return res.status(400).json({
//         error: 'NOT ABLE TO SAVE USER IN DB',
//       });
//     }
//     const u: UserType = user.toObject({ getters: true });
//     console.log(u);
//     updateSheet(
//       u.name,
//       u.email,
//       u.phone,
//       u.college,
//       u.workshopA,
//       u.workshopB,
//       u.amount,
//       u.paymentId
//     );
//     updatePromo(req.body.code.promo, u._id);

//     sendMail(u.name, u.email, u.workshopA, u.workshopB, u.paymentId);
//     return res.json(user);
//   });
// });

app.post('/checkPromo', async (req, res) => {
  const code = req.body.promo;
  // const discount = req.body.discount;
  const promo: any = await Promo.findOne({ promoCode: code });
  if (promo) {
    return res.json({valid : true, discount: promo.discount});
  }
  return res.json({valid : false});
});

app.post("/makePromo", async (req, res) => {
  const promo: PromoType = {
    promoCode: req.body.promo,
    discount : req.body.discount,
    participants: [],
  };
  const u = new Promo(promo);
  u.save((err, promo) => {
    if (err) {
      res.send(err);
      console.log(err);
    } else {
      res.json(promo);
      console.log("promo code save successfully");
    }
  });
});

// app.get("/promos", async (req, res) => {
//   try {
//     const participants = await Promo.find();
//
//     return res.json(participants);
//   } catch (e) {}
//   return null;
// });

// app.get("/getDsa", async (req, res) => {
//   try {
//     const participants = await User.find({ dataStructures: true });

//     return res.json(participants);
//   } catch (e) {}
//   return null;
// });

// app.get("/getPayment", async (req, res) => {
//   const payment = await axios.get(
//     `https://${process.env.RAZORPAY_TEST_KEY}:${process.env.RAZORPAY_TEST_SECRET}@api.razorpay.com/v1/payments/?from=1400826740&count=68`
//   );
//   const newP = payment.data.items.filter((a: any) => {
//     a.status == "captured";
//   });
//   console.log(newP);
//   return res.json(payment.data);
// });

//app.listen(8000, () => console.log('Listning to port 8000'));
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to db');
    app.listen(process.env.PORT || 8000, () =>
      console.log('listening on Port 8000....')
    );
  });
