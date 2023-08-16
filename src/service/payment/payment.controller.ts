import { Request, Response, request, response } from "express";
import * as StripeCustomer from './payment.provider';


export const stripePaymnet = {


    stripeCreateCustomer: async(req: Request, res:  Response) => {
       const customer : any = await StripeCustomer.createCustomer(req, res);
       console.log("Getting Customer Id : ", customer, customer?.id) 
       return res.status(201).json({mesage: 'User created successfullly', data : customer })
    },

    stripeAddCard : async (req: Request, res: Response) => {
        const card : any = await StripeCustomer.addCardDetails(req, res);
        return res.status(201).json({message: 'card added successfully', card : card})
    },

     stripeCreateCharges : async (req: Request, res: Response) => {
        const charge : any = await StripeCustomer.createCharge(req, res);
        return res.status(201).json({message: 'charge created successfully', charge : charge})
     }

}
