"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var superagent = require("superagent");
var events = require("events");
var cheerio_manager_1 = require("./module/cheerio-manager");
var addData_1 = require("./module/addData");
var judgeRepeat_1 = require("./module/judgeRepeat");
var http = require("http");
var user_1 = require("./module/user");
var userManager = new user_1.UserManager();
var MAX_COUNT = 5;
var MAX_QUESTION_COUNT = 80;
var cheerioManager = new cheerio_manager_1.CheerioManager();
var eventEmitter = new events.EventEmitter();
//URL集合
var URLSet = {
    targetURL: "https://course.scetc.edu.cn/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_1_1",
    loginURL: "https://course.scetc.edu.cn/webapps/login/",
    mao: "https://course.scetc.edu.cn/webapps/assessment/take/launch.jsp?course_assessment_id=_6351_1&course_id=_1287_1&content_id=_108285_1&step=null"
};
//习题URL集合
var TESTURLSET = {
    NEXT_URL: "https://course.scetc.edu.cn/webapps/blackboard/content/listContent.jsp?content_id=_77903_1&course_id=_1287_1&nolaunch_after_review=true",
    MAO_1: "https://course.scetc.edu.cn/webapps/assessment/take/launch.jsp?course_assessment_id=_6351_1&course_id=_1287_1&new_attempt=1&content_id=_108285_1&step=",
    MAO_1_REPEAT: "https://course.scetc.edu.cn/webapps/assessment/take/launch-redirect.jsp?new_attempt=1&course_assessment_id=_6351_1&course_id=_1287_1&content_id=_108285_1&step=",
    CONTINUE_URL: "https://course.scetc.edu.cn/webapps/assessment/take/launch.jsp?course_assessment_id=_6351_1&course_id=_1287_1&content_id=_108285_1&step=null",
    SUBMIT_URL: "https://course.scetc.edu.cn/webapps/assessment/do/take/saveAttempt"
};
//请求header
var header = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    Origin: 'http://wap.17wo.cn',
    'X-FirePHP-Version': '0.0.6',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded',
    DNT: 1,
    Referer: 'http://wap.17wo.cn/Login.action',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6,en;q=0.4,sr;q=0.2'
};
//请求页内相关网页
var requestTargetAddress = function (targetURL, cookie) {
    return new Promise(function (resolve, reject) {
        //请求目标网址
        superagent.get(targetURL)
            .set('Content-Type', 'application/json;charset=UTF-8')
            .set("Cookie", cookie)
            .end(function (err, res) {
            if (err)
                throw err;
            fs.writeFileSync('./data.txt', res.text);
            resolve(cheerioManager.changeCheerioStatic(res.text));
        });
    });
};
//收集题目与答案
var collectionQuestionAnswer = function (url, cookie) {
    var $;
    (function () {
        return __awaiter(this, void 0, void 0, function () {
            var questionDIV, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, requestTargetAddress(url, cookie)];
                    case 1:
                        $ = _a.sent();
                        questionDIV = $("td.reviewTestSubCellForIconBig");
                        //获取问题
                        questionDIV.each(function (index, ele) {
                            //分离答案和题目
                            var question = '';
                            var answer = [];
                            //存入题目
                            // questionManager.addQuestion($(ele).next().text());
                            question = $(ele).next().text();
                            //存入答案
                            var answerContainer = $(ele).parent().next().find('.correctAnswerFlag');
                            //选择题
                            answerContainer.each(function (index, ele) {
                                answer.push($(ele).parent().text().trim());
                            });
                            //存入答案和问题
                            (function () {
                                return __awaiter(this, void 0, void 0, function () {
                                    var _a, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4 /*yield*/, judgeRepeat_1.judgeRepeat(question, false)];
                                            case 1:
                                                if (!((_c.sent()) == 'false')) return [3 /*break*/, 3];
                                                _b = (_a = console).log;
                                                return [4 /*yield*/, addData_1.addData(question, answer)];
                                            case 2:
                                                _b.apply(_a, [_c.sent()]);
                                                _c.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                });
                            })();
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    })();
};
//验证答案
var validAnswer = function (cookie, targetURL) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var answers, $, questionDIV, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    answers = [];
                    return [4 /*yield*/, requestTargetAddress(targetURL, cookie)];
                case 1:
                    // $ = await requestTargetAddress(TESTURLSET.MAO_1,cookie); 
                    $ = _a.sent();
                    return [4 /*yield*/, requestTargetAddress(targetURL, cookie)];
                case 2:
                    $ = _a.sent();
                    questionDIV = $(".legend-visible");
                    //获取问题
                    return [4 /*yield*/, questionDIV.each(function (index, ele) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _b = (_a = answers).push;
                                        _c = { index: index + 1 };
                                        return [4 /*yield*/, judgeRepeat_1.judgeRepeat($(ele).text(), true)];
                                    case 1:
                                        _b.apply(_a, [(_c.content = _d.sent(), _c)]);
                                        //匹配完成
                                        if (index == questionDIV.length - 1)
                                            eventEmitter.emit("returnData", answers);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 3:
                    //获取问题
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
//提交答案
var submitFunc = function () {
    superagent.post(TESTURLSET.SUBMIT_URL)
        .type('form')
        .send({ "blackboard.platform.security.NonceUtil.nonce.ajax": "d1af98a5-a225-4af0-9d0a-45e533dcdae1" })
        .send({ "data-submitted": true })
        .send({ "course_assessment_id": "_6351_1" })
        .send({ "course_id": "_1287_1" })
        .send({ "content_id": "_108285_1" })
        .send({ "step": "" })
        .send({ "original_user_id": "_11360_1" })
        .send({ "save_and_submit": "" })
        .send({ "timer_completion": "" })
        .send({ "fileUploadType": "" })
        .send({ "current_question": "2" })
        .send({ "current_attempt_item_id": "_42563692_1" })
        .send({ "current_attempt_item_id_backup": "_42563692_1" })
        .send({ "method": "" })
        .send({ "saveonequestion": true });
};
//登陆：
var loginFunc = function (targetURL) {
    superagent.post(URLSet.loginURL)
        .type('form')
        .send({ user_id: userManager.username })
        .send({ password: userManager.password })
        .send({ action: "login" })
        .send({ new_loc: "" })
        .end(function (err, res) {
        if (err)
            throw err;
        var cookie = res.header['set-cookie'];
        var $ = cheerioManager.changeCheerioStatic(res.text);
        var link = $("body").find("a").attr("href");
        URLSet.targetURL = link;
        // eventEmitter.emit("getData",cookie);
        eventEmitter.emit("validAnswer", cookie, targetURL);
    });
};
//登陆成功触发
eventEmitter.on("getData", function (cookie) {
    collectionQuestionAnswer("https://course.scetc.edu.cn/webapps/assessment/review/review.jsp?attempt_id=_838487_1&course_id=_1287_1&content_id=_114943_1&return_content=1&step=", cookie);
});
//验证答案
eventEmitter.on("validAnswer", function (cookie, targetURL) {
    validAnswer(cookie, targetURL);
});
//打印答案
// eventEmitter.on("printAnswer",() => {
//   answers.sort((a:any,b:any) => {
//     return a.index - b.index;
//   })
//   answers.forEach((question:any) => {
//     console.log(`问题 ${question.index}：\r`);
//     if(Object.prototype.toString.bind(question.content)() != "[object String]"){
//       question.content.forEach((ele:string) => {
//         console.log(ele);
//       });
//     }
//     else{
//       console.log("未找到答案");
//     }
//     console.log('\n');
//   });
// });
//捕获promise异常
process.on('unhandledRejection', function (reason, p) {
    throw reason;
});
var printPath = function (req) {
    console.log(req.url);
};
process.on('uncaughtException', function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack);
});
// loginFunc();
var tres;
//匹配答案完毕listener
eventEmitter.on("returnData", function (answers) {
    console.log(answers);
    answers = answers.sort(function (a, b) {
        return a.index - b.index;
    });
    // console.log(answers);
    console.log(JSON.parse(JSON.stringify(answers)).length);
    tres.end(JSON.stringify({ answers: answers }));
});
//创建http服务器
var httpServer = http.createServer(function (req, res) {
    tres = res;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Origin,Content-Type,Accept");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("X-Powered-By", ' 3.2.1');
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    //过滤favicon请求
    if (req.url == '/favicon.ico')
        res.end();
    var param = '';
    req.on("data", function (chunk) {
        if (chunk) {
            param = '';
            param += chunk.toString();
        }
        if (chunk && req.url == '/getData') {
            var data = JSON.parse(param);
            //赋值账号密码
            userManager.username = data.user;
            userManager.password = data.password;
            console.log(JSON.stringify(param));
            //打印路径
            printPath(req);
            //匹配答案
            loginFunc(data.testURL);
        }
        else {
            throw new Error('no params');
        }
    });
    req.on("end", function () {
        if (req.url != '/getData')
            res.end();
    });
    if (req.method == 'OPTIONS')
        res.end();
})
    .listen(9999, function () { return console.log("listening"); });
