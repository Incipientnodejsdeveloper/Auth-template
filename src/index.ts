import express from "express";
import cors from "cors";
import "dotenv/config";
import { DbInstance } from "./db";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.set('view engine', 'ejs');

import router from './service/route';

app.use('/api/v1', router);


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

