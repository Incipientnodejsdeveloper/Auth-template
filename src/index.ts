import express from "express";
import cors from "cors";
import "dotenv/config";
import { DbInstance } from "./db";

const app = express();
const test = express();
const port = process.env.PORT || 5000;

app.use(express.json());
test.use(express.json());
app.use(express.urlencoded({extended: true}));
test.use(express.urlencoded({extended: true}));
app.use(cors());
test.use(cors());

app.set('view engine', 'ejs');

import router from './service/route';

app.use('/api/v1', router);

import { StripeRouter } from './service/payment/payment.route'
test.use('/payment', StripeRouter);

// test.listen(3030, () => {console.log(`server is runnig on 3030`)})

DbInstance.then(()=>{
    console.log("connected to database")
    app.listen(port,()=>{
        console.log(`server running at port ${port}`);
    });
})
.catch((err: any) => {
    console.log("can't connect with the database",err);
    process.exit(1);
})

