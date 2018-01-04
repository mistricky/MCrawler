"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserManager = /** @class */ (function () {
    function UserManager() {
        this.username = '';
        this.password = '';
    }
    UserManager.prototype.setUserName = function (username) {
        this.username = username;
    };
    UserManager.prototype.setPassword = function (password) {
        this.password = password;
    };
    return UserManager;
}());
exports.UserManager = UserManager;
