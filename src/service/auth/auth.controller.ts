import { Request, Response } from "express";
import * as User from './auth.provider';
import { TResponse } from "../../utils/Types";

export const authController = {

    signup: async (req: Request, res: Response) => {

        const { code, data }: TResponse = await User.register(req);
        res.status(code).json(data);
        return;
    },

    signin: async (req: Request, res: Response) => {

        const { code, data }: TResponse = await User.login(req)
        res.status(code).json(data);
        return;
    },

    forgotPassword: async (req: Request, res: Response) => {
        
        const { code, data }: TResponse = await User.forgotPassword(req);
        res.status(code).json(data);
        return;
    },
    
    updatePassword: async (req: Request, res: Response) => {
        
        const { code, data }: TResponse = await User.updatePassword(req);
        res.status(code).json(data);
        return;
    },

    setPassword: async (req: Request, res: Response) => {

        const { code, data }: TResponse = await User.setPassword(req);
        res.status(code).json(data);
        return;
    },

    verifyOtp: async (req: Request, res: Response) => {

        const { code, data }: TResponse = await User.verifyOtp(req)
        res.status(code).json(data);
        return;
    },
    
    resendOtp: async (req: Request, res: Response) => {
        const { code, data }: TResponse = await User.resendOtp(req)
        res.status(code).json(data);
        return;
    },

    test: async (req: Request, res: Response) => {
        const { code, data }: TResponse = await User.test(req)
        res.status(code).json(data);
        return;
    },

    getdata : async(req: Request, res: Response) => {
        const { code, data } : TResponse = await User.getdata();
        res.status(code).json(data);
        return;
    }

};