"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = require("cheerio");
var CheerioManager = /** @class */ (function () {
    function CheerioManager() {
    }
    //更改cheerioStatic
    CheerioManager.prototype.changeCheerioStatic = function (text) {
        return cheerio.load(text);
    };
    return CheerioManager;
}());
exports.CheerioManager = CheerioManager;
