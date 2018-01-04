"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_model_1 = require("./data-model");
exports.addData = function (question, answer) {
    return new Promise(function (resolve, reject) {
        var entity = new data_model_1.DataModel({
            question: question,
            answer: answer
        });
        entity.save(function (err, product, numAffeced) {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve("add a question and a answer in database");
        });
    });
};
