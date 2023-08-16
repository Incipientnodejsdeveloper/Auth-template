import Stripe from "stripe";
import { create } from "ts-node";

const stripe = new Stripe(
  "sk_test_51Nexv0SA4T9lOQ9CkgflVBvRYNOF22rHZlaRE994iw5OgRpLHqj8RV6osDgQZud5buWcAtMkIcPbSR2pzdyNK8WA00oyRX5cbe",
  {
    apiVersion: "2022-11-15",
  }
);

const createStripeTokenJs = async ( cardInfo ) => {
  return true
}

export default createStripeTokenJs;