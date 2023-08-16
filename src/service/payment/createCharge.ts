import Stripe from "stripe";
import { create } from "ts-node";
// import { chargeAuth } from "./chargeAuth";

const stripeSecret = new Stripe(
  "sk_test_51Nexv0SA4T9lOQ9CkgflVBvRYNOF22rHZlaRE994iw5OgRpLHqj8RV6osDgQZud5buWcAtMkIcPbSR2pzdyNK8WA00oyRX5cbe",
  {
    apiVersion: "2022-11-15",
  }
);

export const creatStripeCharge = async (customerInfo: {
  amount: number;
  currency: string;
  card_id: string;
  customer: string;
}): Promise<Stripe.PaymentIntent> => {
  // not working with typescript
  // const charge : any = await stripe.charges.create({
  //     amount : customerInfo.amount,
  //     currency : customerInfo.currency,
  //     source: customerInfo.source,
  //     customer : customerInfo.customer
  // })
  const confirmOptions = {
    use_stripe_sdk: false, // Disable 3D Secure authentication
  };
  const paymentIntent = await stripeSecret.paymentIntents.create({
    currency: customerInfo.currency,
    amount: customerInfo.amount,
    customer: customerInfo.customer,
    payment_method_types: ["card"],
    payment_method: customerInfo.card_id
  });
  const confirmPaymentIntent = await stripeSecret.paymentIntents.confirm(
    paymentIntent.id
  );
  const { client_secret } = confirmPaymentIntent;
  // chargeAuth(client_secret, customerInfo.card_id)
  // const confirmPaymentIntent2 = await stripePublish.paymentIntents.confirm(client_secret, { payment_method: customerInfo.card_id });
  // console.log("confirm status:", confirmPaymentIntent2.status);
  console.log("I am passed", client_secret,customerInfo.card_id, paymentIntent.id );
  // const confirmpaymentusingPublish: Stripe.PaymentIntent =
  //   await stripePublish.paymentIntents.confirm(client_secret, {
  //     payment_method: customerInfo.card_id,
  //   });
  // console.log(
  //   "Getting response from publish stripe: ",
  //   confirmpaymentusingPublish.status
  // );
  const checkPaymentIntentStatus = await stripeSecret.paymentIntents.retrieve(
    paymentIntent.id
  );
  if (
    checkPaymentIntentStatus.status === "requires_action" &&
    checkPaymentIntentStatus?.next_action?.type === "use_stripe_sdk"
  ) {
    console.log(
      "3D Secure attempt incomplete. You should handle this on your client side."
    );
  } else {
    console.log("Payment Intent status:", checkPaymentIntentStatus.status);
  }
  //  console.log('Getting confrim payment: ', paymentIntent)
  return confirmPaymentIntent;
};
