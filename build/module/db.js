"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
exports.db = mongoose.createConnection("mongodb://localhost:27017/QuestionData");
exports.db.on("connected", function () {
    console.log("连接数据库成功");
});
exports.db.on("disconnected", function () {
    console.log("断开与数据库的连接");
});
exports.db.on("error", function (err) {
    console.log("\u8FDE\u63A5\u8FC7\u7A0B\u4E2D\u53D1\u73B0\u4E86\u4E00\u4E2A\u9519\u8BEF\uFF1A" + JSON.stringify(err));
});
