import express from "express";
import shortid from "shortid";
import Razorpay from "razorpay";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { UserType } from "./types";
import User from "./models/User";
import axios from "axios";
import { sendMail } from "./utils";
import env from "dotenv";

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

app.post("/count", async (req, res) => {
  const dataStructureCount = await User.count({ dataStructures: true });
  const dataScienceCount = await User.count({ dataScience: true });

  return res.json({ dataStructureCount, dataScienceCount });
});

//EndPoint for front-end
//@ts-ignore
app.post("/save", async (req, res) => {
  const user: UserType = req.body;
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

  u.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "NOT ABLE TO SAVE USER IN DB",
      });
    }
    const u: UserType = user.toObject({ getters: true });

    sendMail(u.name, u.email, u.dataScience, u.dataStructures);
    return res.json(user);
  });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
    app.listen(process.env.PORT || 400, () =>
      console.log("listening on Port 4000....")
    );
  });
