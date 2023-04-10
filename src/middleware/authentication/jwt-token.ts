import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes as CODE } from '../../utils/Enums';
import User from "../../schema/user.schema";

export const authCheck = (role: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let jwtToken;

            // check if headers has authorization
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                jwtToken = req.headers.authorization.split(' ')[1];
            }

            // check if jwt is exists or not
            if (!jwtToken) {
                return res.status(CODE.UNAUTHORIZED).json({
                    success: false,
                    message: "Access token not found",
                    data: null
                })
            }

            const secretKey: any = process.env.JWT_SECRET_KEY;
            // check json web token exists & is verified

            jwt.verify(jwtToken, secretKey, async (err: any, decodedToken: any) => {
                if (err) {
                    return res.status(CODE.UNAUTHORIZED).json({
                        success: false,
                        message: "Invalid Access",
                        data: null
                    })
                } else {
                    let user:any = await User.findOne({ _id: decodedToken.id, isActive: true });
                    if (!user) {
                        return res.status(CODE.UNAUTHORIZED).json({
                            success: false,
                            message: "Invalid Access",
                            data: null
                        })
                    }
                    else if (!role.includes(user.role)) {
                        return res.status(401).json({
                            success: false,
                            message: "You are not autorized user to access this route",
                            data: null
                        })

                    } else {
                        req.body.userId = decodedToken.id
                        req.body.role = decodedToken.role
                        next();
                    }
                }
            })
        } catch (error) {
            res.status(CODE.INTERNAL_SERVER).json({
                success: false,
                message: 'internal server error',
                data: null
            });
        }

    }

};