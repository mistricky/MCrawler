import * as mongoose from "mongoose";

export let schema:mongoose.Schema = new mongoose.Schema({
    question:{type:String},
    answer:{type:Array}
});