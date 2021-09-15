import express from "express";
import shortid from "shortid";
import Razorpay from "razorpay";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { UserType, PromoType } from "./types";
import User from "./models/User";
import axios from "axios";
import { sendMail, updatePromo } from "./utils";
import env from "dotenv";
import Promo from "./models/Promo";

env.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY,
  key_secret: process.env.RAZORPAY_TEST_SECRET,
});

app.post("/razorpay", async (req, res) => {
  const payment_capture = 1;
  const amount = Math.ceil(req.body.amount);
  const currency = "INR";

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
      error: "COULD NOT CREATE ORDER",
    });
  }
});

app.get("/count", async (req, res) => {
  const workshopA = await User.count({ workshopA: true });
  const workshopB = await User.count({ workshopB: true });

  return res.json({
    workshopA: workshopA,
    workshopB: workshopB,
  });
});

//EndPoint for front-end
//@ts-ignore
app.post("/save", async (req, res) => {
  const user: UserType = req.body.user;
  const u = new User(user);

  try {
    const payment = await axios.get(
      `https://${process.env.RAZORPAY_TEST_KEY}:${process.env.RAZORPAY_TEST_SECRET}@api.razorpay.com/v1/payments/${user.paymentId}`
    );
    if (!payment.data.captured) {
      return res.status(400).json({
        error: "PAYMENT WAS NOT SUCCESSFUL",
      });
    }
  } catch (e) {
    return res.status(400).json({
      error: "PAYMENT WAS NOT SUCCESSFUL",
    });
  }
  console.log(u);
  u.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "NOT ABLE TO SAVE USER IN DB",
      });
    }
    const u: UserType = user.toObject({ getters: true });
    console.log(u);
    console.log(req.body);

    updatePromo(req.body.code.promo, u._id);

    //sendMail(u.name, u.email, u.dataScience, u.dataStructures);
    return res.json(user);
  });
});

app.get("/checkPromo", async (req, res) => {
  const code = req.body.promo;

  const promo = await Promo.find({ promoCode: code });
  if (promo.length > 0) {
    return res.json(true);
  }
  return res.json(false);
});

// app.get("/makePromo", async (req, res) => {
//   const promo: PromoType = {
//     promoCode: `PROMO-ISTESCMANIT-${shortid.generate().toUpperCase()}`,
//     participants: [],
//   };
//   const u = new Promo(promo);
//   u.save((err, promo) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("promo code save successfully");
//     }
//   });
// });

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

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
    app.listen(process.env.PORT || 8000, () =>
      console.log("listening on Port 8000....")
    );
  });
