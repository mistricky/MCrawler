"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_model_1 = require("./data-model");
exports.judgeRepeat = function (question, isValid) {
    return new Promise(function (resolve, reject) {
        data_model_1.DataModel.find({ question: { $regex: question + "$" } }, function (err, docs) {
            if (err)
                reject(err);
            if (docs.length == 0) {
                resolve("false");
            }
            else {
                if (!isValid)
                    console.log("data repeat");
                resolve(docs[0].answer);
            }
        });
    });
};
