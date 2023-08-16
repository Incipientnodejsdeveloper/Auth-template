import { Router } from "express";
import { stripePaymnet } from "./payment.controller";

export const StripeRouter = Router();

StripeRouter.route("/create-user").post(stripePaymnet.stripeCreateCustomer);
StripeRouter.route("/add-card").post(stripePaymnet.stripeAddCard);
StripeRouter.route('/create-charge').post(stripePaymnet.stripeCreateCharges)
