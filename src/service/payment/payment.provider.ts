import { Request, Response } from "express";
import Stripe from "stripe";


const stripe = new Stripe(
  "sk_test_51Nexv0SA4T9lOQ9CkgflVBvRYNOF22rHZlaRE994iw5OgRpLHqj8RV6osDgQZud5buWcAtMkIcPbSR2pzdyNK8WA00oyRX5cbe",
  {
    apiVersion: "2022-11-15",
  }
);

const stripePublish= new Stripe(
  "pk_test_51Nexv0SA4T9lOQ9CaIECnkA8LMu0wCVwze2RDGuSypCfByyYDxDJYzVqipZQNedSqMXRIX58l42S9au91gejWz7N00puCi9pMf",
  {
    apiVersion: "2022-11-15",
  }
)

// Create customer for getting customer id for future reference 
export const createCustomer = async (req: Request, res: Response) => {
  const customer: Stripe.Customer = await stripe.customers.create(req.body);
  return customer;
};

export const addCardDetails = async (req: Request, res: Response) => {
  const { customer_Id, name, number, exp_month, exp_year, cvc } = req.body;
  const cardInfo = {
    name,
    number,
    exp_month,
    exp_year, 
    cvc,
  };

  // Create token for future refrence in creating customer resource id
  const card_token = await stripePublish.tokens.create({
    card : cardInfo
  })
 
  // Create customer sources / card Id for future references
  const card = await stripe.customers.createSource(customer_Id, {
    source: `${card_token.id}`,
  });

  return card;
};

export const createCharge = async (req: Request, res: Response) => {
  const { amount, currency, card_id, customer } = req.body;

  // Creating payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    currency:currency,
    amount: amount,
    customer:customer,
    payment_method_types: ["card"],
    payment_method:card_id
  });

  // Confirming ayment intent but 3D Authentication is requried.
  const confirmPaymentIntent = await stripe.paymentIntents.confirm(
    paymentIntent.id
  );

// const charge = await creatStripeCharge(customerInfo);
 return confirmPaymentIntent;
};
