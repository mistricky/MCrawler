import * as mongoose from "mongoose";
import { db } from "./db";
import { Document } from "mongoose";
import { schema } from "./data-schema";

export let DataModel:mongoose.Model<Document> = db.model("dataModel",schema,"question-answer");