"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
exports.schema = new mongoose.Schema({
    question: { type: String },
    answer: { type: Array }
});
