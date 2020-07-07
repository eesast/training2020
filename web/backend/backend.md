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