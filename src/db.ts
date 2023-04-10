import mongoose from 'mongoose';
import "dotenv/config";

const uri = process.env.DB_URI;
const mongooseOptions = {
    serverSelectionTimeoutMS: 50000,
};

if(!uri){    
    console.log("cannot connect to database, db credential's missing");
    process.exit(1);
    
}

export const DbInstance =  mongoose.connect(uri,mongooseOptions);
    
