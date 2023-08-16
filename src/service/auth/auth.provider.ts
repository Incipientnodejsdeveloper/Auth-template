import { Request } from "express";
import User from "../../schema/user.schema";
import { SendMail } from "../../utils/Mail";
import { GenResObj } from "../../utils/ResponseFormat";
import { HttpStatusCodes as Code } from "../../utils/Enums";
import { TUser, TVerifyResponse } from "../../utils/Types";
import { createToken } from "../../middleware/authentication/createToken";
import { v4 as uuidv4 } from "uuid";import * as bcrypt from "bcryptjs";
import path from "path";
import { userValidate } from "../../utils/validation";

export const register = async (req: Request) => {
  try {
    const payload: TUser = req.body;

    // velidation imple.
    const { error} = userValidate(payload);
    console.log("Getting payload validation", error)
    if(error) {
      return GenResObj(Code.BAD_REQUEST, false, error.details[0].message)
    }

    const { email, name }: TUser = req.body;

    let checkEmail = await User.findOne({ email });

    if (checkEmail)
      return GenResObj(Code.CONFLICT, false, "email already exists");

    const mailSubject = "Flying Pows Activate Account";
    const otp = Math.floor(Math.random() * 900000) + 100000;
    const otpExpiryTime = new Date();
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 30);
    const mailObj = { otp, name };

    const templatePath = path.resolve(
      __dirname,
      "../../",
      "views",
      "register.template.ejs"
    );
    // sending a mail to the user;
    // await SendMail(templatePath, mailSubject, email, mailObj);
    const createdUser = await User.create({ ...payload, otp, otpExpiryTime });
    console.log("Gettting creatd User : ", createdUser)
    return GenResObj(Code.CREATED, true, "Registration successful");
  } catch (err) {
    return GenResObj(Code.INTERNAL_SERVER, false, (err as Error).message);
  }
};

export const login = async (req: Request) => {
  try {
    let payload = req.body;
    let { email, password }: TUser = payload;
    let user: any = await User.findOne({ email }).lean();
    if (!user)
      return GenResObj(Code.NOT_FOUND, false, "User not exists for this email");
    if (!user.isActive)
      return GenResObj(Code.UNAUTHORIZED, false, "user is not active");

    let checkPswd = await bcrypt.compare(password, user.password);
    if (checkPswd) {
      let token: string = createToken(user._id, user.role);
      user.token = token;
      delete user.password;
      delete user.otp;
      delete user.otpExpirationTime;
      return GenResObj(Code.OK, true, "login successully", user);
    } else {
      return GenResObj(Code.BAD_REQUEST, false, "password not matched");
    }
  } catch (err) {
    return GenResObj(Code.INTERNAL_SERVER, false, (err as Error).message);
  }
};

export const forgotPassword = async (req: Request) => {
  try {
    let { email, type }: TUser & { type: string } = req.body;
    let user = await User.findOne({ email }).lean();

    if (!user) return GenResObj(Code.NOT_FOUND, false, "email not found");
    let frontendURL;
    if (type === "website")
      frontendURL =
        process.env.FRONTEND_URL_WEBSITE || "http://localhost:5000/website";
    else
      frontendURL =
        process.env.FRONTEND_URL_MOBILE || "http://localhost:5000/mobile";
    const forgotPasswordCode = uuidv4();
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { forgotPassword: forgotPasswordCode, setFgtPswd: true },
      { new: true }
    ).lean();

    // sent email
    const mailSubject = "Flying Pows Activate Account";
    const mailObj = {
      frontendURL,
      forgotPasswordCode,
      id: updatedUser?._id,
      name: updatedUser?.name,
    };
    const templatePath = path.resolve(
      __dirname,
      "../../",
      "views",
      "forgotpassword.template.ejs"
    );
    await SendMail(templatePath, mailSubject, email, mailObj);
    return GenResObj(Code.OK, true, "Email sent successfully");
  } catch (err) {
    return GenResObj(Code.INTERNAL_SERVER, false, (err as Error).message);
  }
};

export const setPassword = async (req: Request) => {
  try {
    if (!req.params.id && !req.params.code)
      return GenResObj(Code.BAD_REQUEST, false, "id and code param required");
    let { id, code } = req.params;
    let { password } = req.body;

    const checkUser = await User.findOne({ _id: id, forgotPassword: code });
    if (!checkUser) return GenResObj(Code.NOT_FOUND, false, "user not found");
    if (checkUser.setFgtPswd == false)
      return GenResObj(Code.UNAUTHORIZED, false, "password can not reset");
    checkUser.password = password;
    checkUser.setFgtPswd = false;
    await checkUser.save({ validateBeforeSave: true });

    return GenResObj(Code.OK, true, "password set successfully");
  } catch (err) {
    return GenResObj(Code.INTERNAL_SERVER, false, (err as Error).message);
  }
};

export const updatePassword = async (req: Request) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    let user = await User.findOne({ _id: userId });
    if (user) {
      let checkPswd = await bcrypt.compare(oldPassword, user.password);
      if (!checkPswd)
        return GenResObj(Code.UNAUTHORIZED, false, "Old password not matched");
      user.password = newPassword;
      await user.save({ validateBeforeSave: true });
      return GenResObj(Code.OK, true, "password set successfully");
    } else {
      return GenResObj(Code.BAD_REQUEST, false, "user not found");
    }
  } catch (err) {
    console.log(err);
    return GenResObj(Code.INTERNAL_SERVER, false, (err as Error).message);
  }
};

export const verifyOtp = async (req: Request) => {
  try {
    const { email, otp }: TUser = req.body;

    // Find user using email
    const checkOtp = await User.findOne({ email }).lean();

    // If user found
    if (checkOtp) {
      // Check if OTP is expired or not
      const currentTime = new Date();
      if (!(currentTime < checkOtp.otpExpiryTime))
        return GenResObj(Code.BAD_REQUEST, false, `OTP expired`);

      // Check if OTP matched or not
      if (checkOtp.otp !== otp)
        return GenResObj(Code.BAD_REQUEST, false, `OTP doesn't matched`);
      console.log("User is verified with otp!")
      // Update user status to active
      const user = await User.findOneAndUpdate(
        { _id: checkOtp._id },
        { isActive: true },
        { new: true }
      ).lean();
        console.log("Getting user:", user)
      if (user) {
        // Create token using user id and role
        let token: string = createToken(user._id, user.role);
        let userData = {
          ...user,
          token,
        } as TVerifyResponse;
        // Remove password,OTP,otpExpiryTime from userData
        delete userData.password;
        delete userData.otp;
        delete userData.otpExpiryTime;
        return GenResObj(
          Code.OK,
          true,
          `OTP verification successful`,
          userData
        );
      } else {
        return GenResObj(Code.NOT_FOUND, false, `User data not found`);
      }
    } else {
      return GenResObj(Code.NOT_FOUND, false, `User data not found`);
    }
  } catch (err) {
    console.log(err);
    return GenResObj(Code.INTERNAL_SERVER, false, (err as Error).message);
  }
};

export const resendOtp = async (req: Request) => {
  try {
    let { email }: TUser = req.body;

    const otp = Math.floor(Math.random() * 900000) + 100000;

    const otpExpiryTime = new Date();
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 30);

    let user = await User.findOneAndUpdate(
      { email },
      { otp, otpExpiryTime },
      { new: true }
    );

    if (!user) return GenResObj(Code.NOT_FOUND, false, "email not found");

    // mail sent
    const mailSubject = "Flying Pows Activate Account";
    const mailObj = { otp, name: user.name };
    const templatePath = path.resolve(
      __dirname,
      "../../",
      "views",
      "register.template.ejs"
    );
    await SendMail(templatePath,mailSubject, email,mailObj);
    return GenResObj(Code.CREATED, true, "code sent successfully");
  } catch (err) {
    console.log(err);
    return GenResObj(Code.INTERNAL_SERVER, false, (err as Error).message);
  }
};

export const test = async (req: Request) => {
  try {
    const payload = req.body;
    return GenResObj(Code.ACCEPTED, true, "", payload);
  } catch (err) {
    return GenResObj(Code.INTERNAL_SERVER, false, (err as Error).message);
  }
};

export const getdata = async() => {
    const user = await User.find();
   if(user) return GenResObj(Code.ACCEPTED, true,"User fetched", user);
   return GenResObj(Code.BAD_REQUEST, false, "")
}
