# 后端技术栈入门

本讲主要为使用Node.js结合Express和Mongo的RESTful后端开发入门指南。准备工作需要安装以下工具并设置环境变量。

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/zh-Hant/docs/install)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Postman](https://www.postman.com/downloads/)

本讲演示样例为[清华电子系学生科协网站](https://eesast.com)在2020年5月1日前的前后端代码（现已从REST迁移至GraphQL），代码开源于[前端代码](https://github.com/eesast/web/tree/c2e3b521b7093d9bbb67c4e74209235d1fff9808)与[后端代码](https://github.com/eesast/api/tree/ba7cce4a4a773fc2ce35bb137be9d02cd581d4b5)，可在协议许可的范围内学习使用。

相关内容可参考[MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)中的相关资料继续深入学习，本讲参考资料部分来自EESAST 2019培训内容。

## RESTful

**表现层状态转换（Representational State Transfer，REST）**是一种网络架构风格，要点在于：

- **资源：**资源是由URI来指定。
- **状态转换：**HTTP是无状态协议，而对资源的操作包括获取、创建、修改和删除，这些操作正好对应HTTP协议提供的GET、POST、PUT和DELETE方法，形成服务器端状态转换。
- **表现层：**通过操作资源的表现形式来操作资源。资源的表现形式是XML或者HTML，取决于读者是机器还是人、是消费Web服务的客户软件还是Web浏览器。当然也可以是任何其他的格式，例如JSON。

例子：

```http
GET /users/1
```

```http
POST /tracks/1/players
```

```http
PUT /teams/1/score
```

```http
DELETE /articles/1
```

URI应该是资源，不应该是动词，动作（即状态转换）应该在对给定资源的query或payload中完成。

## Node.js

- Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。
- Node.js 使用了一个**事件驱动**、**非阻塞式 I/O**的模型，使其轻量又高效。
  - 具体解释
    - Node.js 是单线程的
    - 但是每做一次 IO，在 IO 的同时还可以继续进行别的事情的处理
    - 即 IO 并不会阻塞主线程
  - 举个例子：每当进行某项功能的时候的时候，A 函数会被调用，访问一个网上的资源，由于网络延迟，3s 后才会获得返回值。我们连续调用 100 次功能
    - C/C++/Java 的同步实现，至少需要 3s\*100=300s
    - C/C++/Java 的多线程，需要至少需要 3s\*100/线程数量
    - Node.js 仅需要比 3s 多一点的时间
- Node.js 的语法就是 JavaScript 的语法。

### JavaScript回顾与进阶

#### map，reduce与filter

`reduceer`函数接收4个参数:

1. Accumulator (acc) (累计器)
2. Current Value (cur) (当前值)
3. Current Index (idx) (当前索引)
4. Source Array (src) (源数组)

您的`reducer`函数的返回值分配给累计器，该返回值在数组的每个迭代中被记住，并最后成为最终的单个结果值。

```javascript
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15
```

`map()` 方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。

```javascript
const array1 = [1, 4, 9, 16];

// pass a function to map
const map1 = array1.map(x => x * 2);

console.log(map1);
// expected output: Array [2, 8, 18, 32]
```

`filter()` 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。

```javascript
const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];

const result = words.filter(word => word.length > 6);

console.log(result);
// expected output: Array ["exuberant", "destruction", "present"]
```

#### 异步

输出1至10，每隔一秒输出一个数。

回调：

```javascript
const a = 10;
const counter = (x = 1) => {
	console.log(x);
	if (x < a)
		setTimeout(() => {
			counter(x + 1);
		}, 1000);
};
counter();
```

Promise：（用 Promise 来包裹旧式API）

```javascript
const a = 10;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const count = async limit => {
	for (let i = 1; i <= limit; i++) {
		console.log(i);
		await sleep(1000);
	}
};
count(a);
```

#### Promise

详细可深入阅读MDN的[Promise教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)

链式调用：

```javascript
doSomething(function(result) {
  doSomethingElse(result, function(newResult) {
    doThirdThing(newResult, function(finalResult) {
      console.log('Got the final result: ' + finalResult);
    }, failureCallback);
  }, failureCallback);
}, failureCallback);

doSomething()
.then(result => doSomethingElse(result))
.then(newResult => doThirdThing(newResult))
.then(finalResult => {
  console.log(`Got the final result: ${finalResult}`);
})
.catch(failureCallback);

async function foo() {
  try {
    const result = await doSomething();
    const newResult = await doSomethingElse(result);
    const finalResult = await doThirdThing(newResult);
    console.log(`Got the final result: ${finalResult}`);
  } catch(error) {
    failureCallback(error);
  }
}
```

reject：

```javascript
function resolved(result) {
  console.log('Resolved');
}

function rejected(result) {
  console.error(result);
}

Promise.reject(new Error('fail')).then(resolved, rejected);
// expected output: Error: fail
```

`Promise.all()`：

`Promise.all(iterable)` 方法返回一个 `Promise` 实例，此实例在 `iterable` 参数内所有的 `promise` 都“完成（resolved）”或参数中不包含 `promise` 时回调完成（resolve）；如果参数中 `promise` 有一个失败（rejected），此实例回调失败（reject），失败的原因是第一个失败 `promise` 的结果。

完成（Fulfillment）：
如果传入的可迭代对象为空，`Promise.all` 会同步地返回一个已完成（resolved）状态的`promise`。
如果所有传入的 `promise` 都变为完成状态，或者传入的可迭代对象内没有 `promise`，`Promise.all` 返回的 `promise` 异步地变为完成。
在任何情况下，`Promise.all` 返回的 `promise` 的完成状态的结果都是一个数组，它包含所有的传入迭代参数对象的值（也包括非 `promise` 值）。

失败/拒绝（Rejection）：
如果传入的 `promise` 中有一个失败（rejected），`Promise.all` 异步地将失败的那个结果给失败状态的回调函数，而不管其它 `promise` 是否完成。

```javascript
Promise.all([func1(), func2(), func3()])
.then(([result1, result2, result3]) => { /* use result1, result2 and result3 */ });

before("Create admin user", async function () {
  this.timeout(10000);

  const admin = new User({
    id: 0,
    username: variables.admin.username,
    password: await bcrypt.hash(variables.admin.password, variables.saltRounds),
    email: "admin@eesast.com",
    name: "admin",
    phone: 0,
    department: "电子系",
    class: "无00",
    group: "admin",
    role: "root",
  });
  const testuser = new User({
    id: 2018000000,
    username: variables.user.username,
    password: await bcrypt.hash(variables.user.password, variables.saltRounds),
    email: "user@eesast.com",
    name: "user",
    phone: 13000000000,
    department: "电子工程系",
    class: "无80",
    group: "admin",
    role: "student",
  });

  return Promise.all([admin.save(), testuser.save()]);
});
```

时序：


```javascript
[func1, func2, func3].reduce((p, f) => p.then(f), Promise.resolve())
.then(result3 => { /* use result3 */ });

const applyAsync = (acc,val) => acc.then(val);
const composeAsync = (...funcs) => x => funcs.reduce(applyAsync, Promise.resolve(x));
const transformData = composeAsync(func1, func2, func3);
const result3 = transformData(data);

let result;
for (const f of [func1, func2, func3]) {
  result = await f(result);
}
/* use last result (i.e. result3) */

let isMemberValid: boolean | null = req.body.members.length < 5;
isMemberValid =
          isMemberValid &&
          (await req.body.members.reduce(
            (prev: Promise<boolean | null>, cur: number) =>
              prev.then(
                async (Valid) =>
                  Valid &&
                  (await User.findOne({ id: cur })) &&
                  !(await Team.findOne({
                    id: { $ne: req.params.id },
                    contestId: team.contestId,
                    members: { $in: [cur] },
                  }))
              ),
            Promise.resolve<boolean | null>(true)
          ));
```



## Express

- Express 是一种保持最低程度规模的灵活 Node.js Web 应用程序框架，为 Web 和移动应用程序提供一组强大的功能。
- 简单的来讲，Express 是一个用来做 webapp 脚手架工具。详细请参阅[官方网站](https://expressjs.com/)。

`yarn global add express-generator`可添加项目的generator以快速生成项目（类似create-react-app）。

```javascript
const express = require("express");
const app = express();

// middleware
app.use(async (req, res, next) => {
  let x = Date.now();
  await next();
  console.log(req.url, "-->", res.statusCode, Date.now() - x, "ms");
});

// "router" in some way
app.get("/", async (req, res, next) => {
  console.log("Hello,world!");
  res.status(200).send("Hello World!");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
```

```flow
st=>start: Request
mid=>operation: Middlewares construction
cond=>condition: Find app routine
condx=>condition: Find routine controller
e=>end: Response
serv=>operation: Deal with it
cth=>end: response 404

st->mid->cond
cond(yes)->condx
cond(no)->cth
condx(no)->cth
condx(yes)->serv->e
```

## Mongo

> MongoDB is a document database, which means it stores data in JSON-like documents. We believe this is the most natural way to think about data, and is much more expressive and powerful than the traditional row/column model.

> Mongoose is an elegant mongodb object modeling for node.js

- Schema
- Model
- Object
- 异步`find`和`save`

详细文档请参阅[Mongoose官方文档](http://www.mongoosejs.net/docs/guide.html)。

MongoDB环境配置：

1. 为本地用于测试的 MongoDB 设置密码，以保证和服务器上用法一致（以下步骤参考 [docs.mongodb.com/manual/tutorial/enable-authentication](https://docs.mongodb.com/manual/tutorial/enable-authentication) ）

   - 进入 mongo 的 shell，

     ```
     mongo
     ```

   - 设置管理员账户，根据自己的情况设置自定义用户名作为管理员

     ```
     use admin
     db.createUser(
         {
             user: "rying",
             pwd: "123456",
             roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
         }
     )
     ```

   - 重新启动 mongoDB 的守护进程，即重启`mongod`（注意区分`mongod`与`mongo`）

     - 如果你是在 macOS 下使用 `homebrew` 安装的 `mongo`，请修改它的配置文件 `/usr/local/etc/mongod.conf`，大致如下

     ```
     systemLog:
         destination: file
    path: /usr/local/var/log/mongodb/mongo.log
         logAppend: true
storage:
         dbPath: /usr/local/var/mongodb
net:
         bindIp: 127.0.0.1
security:
         authorization: enabled
     ```
     
     - 重启 `mongod` 服务
     - 如果你是使用 `mongod` 手动启动后台服务，则需要在启动 `mongod` 时，添加参数 `--auth`，如 `mongod --auth`
   
   - 重启 `mongod` 后，再次使用 `mongo` 登录数据库，此时可以添加参数直接进行登录获取权限，如 `mongo -u "rying" --authenticationDatabase "admin" -p`，此时你在这个 shell 中就具有管理员权限，可以进行修改
   
2. 将数据库相关设置添加到本地代码

   - 代码中使用了一个叫做 `dotenv` 的库，它会读取根目录下名为 `.env` 的文件，并把其中的值传到 `process.env` 中。`.env` 不会存在任何公共区域，这使得我们可以在开源的情况下对服务器安全相关的设置进行调整
   - 在项目根目录下创建`.env` ，加入启动后端需要的环境变量（填入你自己设置的 MongoDB 账户密码），并保存：

   ```
   DB_USER=rying
   DB_PASS=123456
   ```

MongoDB的一些基本语法（具体查阅[官方文档](https://docs.mongodb.com/manual/)即可）：

- `use sast-api`

- 查询：`db.collection.find(query, projection)`（可加pretty）如`db.users.find({"username": "aa"}).pretty()`

  可使用`$or`，`$gt`等关键字实现更复杂的查询。

  `db.users.find({"id": {$lt:5}, $or: [{"username": "cc"}, {"role": "root"}]}, {"username": 1, "id": 1, "role": 1, "_id": 0}).pretty()`

- 插入：`db.collection.insert(document)`或`db.collection.save(document)`

- 更新：

  ```shell
  db.collection.update(
     <query>,
     <update>,
     {
       upsert: <boolean>,
       multi: <boolean>,
       writeConcern: <document>
     }
  )
  ```

  一定要使用`$set`，否则会覆盖原数据！！！

  `db.users.update({"username" : "aa"}, {$set: {"role": "writer"}})`

  还有`save`方法

- 删除：

  ```shell
  db.collection.remove(
     <query>,
     {
       justOne: <boolean>,
       writeConcern: <document>
     }
  )
  ```

**直接操作数据库一定要谨慎！！！！！！**

## Postman

> Postman is a collaboration platform for API development. Postman's features simplify each step of building an API and streamline collaboration so you can create better APIs—faster.

HTTP协议：

请求 = 请求行 + 请求头 + 空行 + 其他消息体 （CRLF，下同）

响应 = 状态行 + 响应头 + 空行 + 响应正文

GET、POST、PUT、DELETE……

| 状态码 | 含义                                           |
| ------ | ---------------------------------------------- |
| 1xx    | 信息，服务器收到请求，需要请求者继续执行操作   |
| 2xx    | 成功，操作被成功接收并处理                     |
| 3xx    | 重定向，需要进一步的操作以完成请求             |
| 4xx    | 客户端错误，请求包含语法错误或无法完成请求     |
| 5xx    | 服务器错误，服务器在处理请求的过程中发生了错误 |
  ```

  ```