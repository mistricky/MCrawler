import * as cheerio from 'cheerio';
import * as request from 'request';
import { RequestResponse } from 'request';
import * as fs from 'fs';
import * as superagent from 'superagent';
import { User } from './interfaces/user.interface';
import { SuperAgentRequest, SuperAgent } from 'superagent';
import * as events from 'events';
import { CheerioManager } from './module/cheerio-manager';
import { questionManager } from './module/question-manager';
import { addData } from './module/addData';
import { judgeRepeat } from './module/judgeRepeat';
import { db } from './module/db';
import { setTimeout } from 'timers';
import * as http from 'http'
import { IncomingHttpHeaders, ServerResponse, IncomingMessage } from 'http';
import { UserManager } from './module/user';

const userManager: UserManager = new UserManager();
const MAX_COUNT: number = 5;
const MAX_QUESTION_COUNT: number = 80;
const cheerioManager: CheerioManager = new CheerioManager();
const eventEmitter: events.EventEmitter = new events.EventEmitter();

//URL集合
let URLSet: any = {
  targetURL: "https://course.scetc.edu.cn/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_1_1",
  loginURL: "https://course.scetc.edu.cn/webapps/login/",
  mao: "https://course.scetc.edu.cn/webapps/assessment/take/launch.jsp?course_assessment_id=_6351_1&course_id=_1287_1&content_id=_108285_1&step=null"
}

//习题URL集合
const TESTURLSET = {
  NEXT_URL: "https://course.scetc.edu.cn/webapps/blackboard/content/listContent.jsp?content_id=_77903_1&course_id=_1287_1&nolaunch_after_review=true",
  MAO_1: "https://course.scetc.edu.cn/webapps/assessment/take/launch.jsp?course_assessment_id=_6351_1&course_id=_1287_1&new_attempt=1&content_id=_108285_1&step=",
  MAO_1_REPEAT: "https://course.scetc.edu.cn/webapps/assessment/take/launch-redirect.jsp?new_attempt=1&course_assessment_id=_6351_1&course_id=_1287_1&content_id=_108285_1&step=",
  CONTINUE_URL: "https://course.scetc.edu.cn/webapps/assessment/take/launch.jsp?course_assessment_id=_6351_1&course_id=_1287_1&content_id=_108285_1&step=null",
  SUBMIT_URL: "https://course.scetc.edu.cn/webapps/assessment/do/take/saveAttempt"
}

//请求header
let header: any = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  Origin: 'http://wap.17wo.cn',
  'X-FirePHP-Version': '0.0.6',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36',
  'Content-Type': 'application/x-www-form-urlencoded',
  DNT: 1,
  Referer: 'http://wap.17wo.cn/Login.action',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6,en;q=0.4,sr;q=0.2'
}

//请求页内相关网页
let requestTargetAddress: Function = function (targetURL: string, cookie: string): Promise<any> {
  return new Promise<string>((resolve: (data: any) => void, reject: (err: Error) => void) => {
    //请求目标网址
    superagent.get(targetURL)
      .set('Content-Type', 'application/json;charset=UTF-8')
      .set("Cookie", cookie)
      .end((err: any, res: superagent.Response) => {
        if (err) throw err;
        fs.writeFileSync('./data.txt', res.text);
        resolve(cheerioManager.changeCheerioStatic(res.text));
      });
  });
}

//收集题目与答案
let collectionQuestionAnswer: Function = function (url: string, cookie: string) {
  let $: CheerioStatic;
  (async function () {
    try {
      $ = await requestTargetAddress(url, cookie);

      let questionDIV: Cheerio = $("td.reviewTestSubCellForIconBig");
      //获取问题
      questionDIV.each((index: number, ele: CheerioElement) => {
        //分离答案和题目
        let question: string = '';
        let answer: Array<string> = [];
        //存入题目
        question = $(ele).next().text();

        //存入答案
        let answerContainer: Cheerio = $(ele).parent().next().find('.correctAnswerFlag')
        //选择题
        answerContainer.each((index: number, ele: CheerioElement) => {
          answer.push($(ele).parent().text().trim());
        });

        //存入答案和问题
        (async function () {
          if (await judgeRepeat(question, false) == 'false') console.log(await addData(question, answer));
        })();
      })

    }
    catch (e) {
      throw e;
    }
  })();
}

//验证答案
let validAnswer: Function = async function (cookie: any, targetURL: string) {
  let answers: Array<any> = []
  let $: CheerioStatic;
  // $ = await requestTargetAddress(TESTURLSET.MAO_1,cookie);
  $ = await requestTargetAddress(targetURL, cookie);
  $ = await requestTargetAddress(targetURL, cookie);
  let questionDIV: Cheerio = $(".legend-visible");
  let answer: Array<string>;
  //获取问题
  await questionDIV.each(async (index: number, ele: CheerioElement) => {
    answers.push({ index: index + 1, content: await judgeRepeat($(ele).text(), true) });
    //匹配完成
    if (index == questionDIV.length - 1) eventEmitter.emit("returnData", answers);
  })

}

//提交答案
let submitFunc: Function = function () {
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
}

//登陆：
let loginFunc: Function = function (targetURL: string) {
  superagent.post(URLSet.loginURL)
    .type('form')
    .send({ user_id: userManager.username })
    .send({ password: userManager.password })
    .send({ action: "login" })
    .send({ new_loc: "" })
    .end((err: any, res: superagent.Response) => {
      if (err) throw err;
      let cookie: any = res.header['set-cookie'];

      let $: CheerioStatic = cheerioManager.changeCheerioStatic(res.text);
      let link: string = $("body").find("a").attr("href");
      URLSet.targetURL = link;

      // eventEmitter.emit("getData",cookie);
      eventEmitter.emit("validAnswer", cookie, targetURL);
    });
}

//登陆成功触发
eventEmitter.on("getData", (cookie: any) => {
  collectionQuestionAnswer("https://course.scetc.edu.cn/webapps/assessment/review/review.jsp?attempt_id=_838487_1&course_id=_1287_1&content_id=_114943_1&return_content=1&step=", cookie);
});

//验证答案
eventEmitter.on("validAnswer", (cookie: any, targetURL: string) => {
  validAnswer(cookie, targetURL);
})

//捕获promise异常
process.on('unhandledRejection', (reason: Error, p) => {
  throw reason;
});

let printPath: Function = function (req: IncomingMessage) {
  console.log(req.url);
}

process.on('uncaughtException', function (err) {
  //打印出错误
  console.log(err);
  //打印出错误的调用栈方便调试
  console.log(err.stack);
});
// loginFunc();

let tres: ServerResponse;

//匹配答案完毕listener
eventEmitter.on("returnData", (answers: any) => {
  console.log(answers);
  answers = answers.sort((a: any, b: any) => {
    return a.index - b.index;
  })
  // console.log(answers);
  console.log(JSON.parse(JSON.stringify(answers)).length);
  tres.end(JSON.stringify({ answers: answers }));
});

//创建http服务器
let httpServer: http.Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  tres = res;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Origin,Content-Type,Accept");
  res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.setHeader("X-Powered-By", ' 3.2.1')
  res.setHeader("Content-Type", "application/json;charset=utf-8");

  //过滤favicon请求
  if (req.url == '/favicon.ico') res.end();

  let param: string = '';

  req.on("data", (chunk: string | Buffer | undefined) => {
    if (chunk) {
      param = '';
      param += chunk.toString();
    }

    if (chunk && req.url == '/getData') {
      let data: any = JSON.parse(param);
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
      throw new Error('no params')
    }
  })

  req.on("end", () => {
    if (req.url != '/getData') res.end();
  });
  if (req.method == 'OPTIONS') res.end();
})
  .listen(9999, () => console.log("listening"));
