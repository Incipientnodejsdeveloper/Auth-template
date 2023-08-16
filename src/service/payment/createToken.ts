import Stripe from "stripe";
import { create } from "ts-node";

const stripePublish= new Stripe(
  "pk_test_51Nexv0SA4T9lOQ9CaIECnkA8LMu0wCVwze2RDGuSypCfByyYDxDJYzVqipZQNedSqMXRIX58l42S9au91gejWz7N00puCi9pMf",
  {
    apiVersion: "2022-11-15",
  }
);

export const createStripeToken = async ( cardInfo : {
  name: string,
    number: string,
    exp_month: string,
    exp_year: string,
    cvc: string
}  ) : Promise<Stripe.Token> => {
  console.log("Hello I am  there")
  const token = await stripePublish.tokens.create({
    card : cardInfo
  })
  console.log("Getting token 12", token)
  return token;
}