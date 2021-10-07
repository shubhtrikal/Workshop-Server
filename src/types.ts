export type UserType = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  workshopA: boolean;
  workshopB: boolean;
  earlyBirdA: boolean;
  earlyBirdB: boolean;
  amount: string;
  paymentId: string;
};

export type PaymentVerificationType = {
  id: string;
  entity: string;
  amount: Number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id: string;
  international: boolean;
  method: string;
  amount_refunded: string;
  refund_status: string;
  captured: boolean;
  description: string;
  card_id: string;
  bank: string;
  createdAt: string;
};

export type PromoType = {
  promoCode: string;
  participants: [string] | [];
  discount: Number;
};
