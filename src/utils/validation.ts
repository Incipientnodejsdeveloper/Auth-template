import Joi from "joi";
import { validate } from "uuid";

export interface user  {
name : string,
email: string,
password: string,
role:"USER" | "ADMIN",
// otp: number,
// otpExpiryTime: Date,
// isActive: boolean,
// forgotPassword:string,
// setFgtPswd:boolean
}


export const userValidate = (data:user) => {
    const schema = Joi.object({
        name: Joi.string().required().min(1),
        email: Joi.string().required().min(8).email(),
        role: Joi.string().valid("USER","ADMIN").required(),
        password: Joi.string().required().min(8)
    });
    return schema.validate(data)
}
