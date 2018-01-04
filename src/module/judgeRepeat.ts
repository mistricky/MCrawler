import { DataModel } from "./data-model";
import { Document } from "mongoose";

export let judgeRepeat:Function = function(question:string,isValid:boolean){
    return new Promise((resolve:any, reject:any) => {
        DataModel.find({question:{$regex:question + "$"}},(err:any,docs:Array<Document>) => {
            if(err) reject(err);
            if(docs.length == 0){
                resolve("false");
            }
            else {
                if(!isValid) console.log("data repeat");
                resolve((docs[0] as any).answer);
            }
        })
    });
}