import { DataModel } from "./data-model";
import { Document } from "mongoose";
import { resolve } from "path";

export let addData = function(question:string, answer:Array<string>){
    return new Promise((resolve:any, reject:any) => {
        let entity:Document = new DataModel({
            question:question,
            answer:answer
        });
    
        entity.save((err:any,product:Document, numAffeced:number) => {
            if(err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve("add a question and a answer in database");
        });
    })
}
