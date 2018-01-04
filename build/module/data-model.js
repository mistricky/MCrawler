"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./db");
var data_schema_1 = require("./data-schema");
exports.DataModel = db_1.db.model("dataModel", data_schema_1.schema, "question-answer");
