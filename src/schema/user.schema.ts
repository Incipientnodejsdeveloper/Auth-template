import { Model, Schema, model } from "mongoose";
import * as bcrypt from "bcryptjs";   
import { TUserModel } from "../utils/Types";

const userSchema = new Schema<TUserModel>(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            min: 8,
            max: 16,
        },
        otp: {
            type: Number,
        },
        otpExpiryTime: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ['USER','ADMIN'],
            default: "USER"
        },
        forgotPassword :{
            type: String,
        },
        setFgtPswd: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

userSchema.index({ email: 1 });

// Hash the password before it is beeing saved to the database
userSchema.pre("save", async function (this: TUserModel, next: any) {
    // Make sure you don't hash the hash password again
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    return next();
});

userSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret.password;
        delete ret.id;
    },
});

const collectionName = "user";

const User: Model<TUserModel> = model<TUserModel>("user", userSchema, collectionName);

export default User;
