import * as mongoose from 'mongoose';
import { Error, Mongoose } from 'mongoose';

export let db:mongoose.Connection = mongoose.createConnection("mongodb://localhost:27017/QuestionData");

db.on("connected",() => {
    console.log("连接数据库成功");
});

db.on("disconnected",() => {
    console.log("断开与数据库的连接");
});

db.on("error",(err:Error) => {
    console.log(`连接过程中发现了一个错误：${JSON.stringify(err)}`);
})