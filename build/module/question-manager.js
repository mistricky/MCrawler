"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QuestionManager = /** @class */ (function () {
    function QuestionManager() {
        this.questions = [];
        this.answers = [];
    }
    QuestionManager.prototype.addQuestion = function (question) {
        this.questions.push(question);
    };
    QuestionManager.prototype.getQuestion = function () {
        return this.questions;
    };
    QuestionManager.prototype.addAnswer = function (answers) {
        this.answers.push(answers);
    };
    QuestionManager.prototype.getAnswer = function () {
        return this.answers;
    };
    return QuestionManager;
}());
exports.questionManager = new QuestionManager();
