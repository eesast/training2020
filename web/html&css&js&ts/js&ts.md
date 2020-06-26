# JavaScript&TypeScript

## JavaScript

> 参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A_re-introduction_to_JavaScript
>
> 更详细的 JavaScript 学习资料：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript

### 什么是 JavaScript

JavaScript 是一门跨平台、面向对象的脚本语言，它能使网页可交互(尽管我们这里不会介绍这部分内容)。 JavaScript 堪称世界上被人误解最深的编程语言，虽然常被嘲为“玩具语言”，但在它看似简洁的外衣下，还隐藏着强大的语言特性。 JavaScript 目前广泛应用于众多知名应用中，对于网页和移动开发者来说，深入理解 JavaScript 就尤为必要。

与大多数编程语言不同，JavaScript 没有输入或输出的概念。它是一个在宿主环境（host environment）下运行的脚本语言，任何与外界沟通的机制都是由宿主环境提供的。浏览器是最常见的宿主环境，但在非常多的其他程序中也包含 JavaScript 解释器，如 Adobe Acrobat、Adobe Photoshop、SVG 图像、Yahoo! 的 Widget 引擎，**Node.js**之类的服务器端环境。

我们有时候也会看到 ECMAScript 或者 ES6 之类的称呼，ECMA 是 JavaScript 的标准化组织，ECMAScript 是针对 JavaScript 语言制定的标准，之所以不叫 JavaScript，是因为 Java 和 JavaScript 的商标都被注册了。因此 ECMAScript 和 JavaScript 的关系是，前者是后者的规格，后者是前者的一种实现（另外的 ECMAScript 方言还有 JScript 和 ActionScript）

### JavaScript 基础语法

JavaScript 是一种多范式的动态语言，它包含类型、运算符、标准内置（ built-in）对象和方法。在基本语法方面，JavaScript 有很多和 C/C++相似的地方。JavaScript 同样支持函数式编程——**因为它们也是对象，函数也可以被保存在变量中，并且像其他对象一样被传递**。

#### 数据类型

JavaScript 中的类型如下

- [`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)（数字）

  - 3/2=1.5
  - 特殊的值 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)（Not a Number 的缩写），如果把 `NaN` 作为参数进行任何数学运算，结果也会是 `NaN`。`NaN`如果通过 `==` 、 `!=` 、 `===` 、以及 `!==`与其他任何值比较都将不相等 -- 包括与其他 NAN 值进行比较。必须使用 [`Number.isNaN()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN) 或 [`isNaN()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN) 函数
  - 内置对象 [`Math`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math)支持一些高级的计算；

- [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)（字符串）

  - JavaScript 中的字符串是一串 Unicode 字符序列

  - `'`和`"`皆可

  - 可以使用内置函数 [`parseInt()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)和 [`parseFloat()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)来将字符串转为 number

  - 可以在字符串字面值上使用字符串对象的所有方法——JavaScript 会自动将字符串字面值转换为一个临时字符串对象，调用该方法，然后废弃掉那个临时的字符串对象，比如`'eesast'.length`

  - 在 ES2015 中，引入了[模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings)，使用反引号 (\` \`) 来代替普通字符串中的用双引号和单引号，我们对其最常见的使用就是使用占位符`${expression}`来在其中插入表达式，例如

    ```javascript
    let name = "Bob",
      time = "today";
    `Hello ${name}, how are you ${time}?`;

    let a = 5;
    let b = 10;
    console.log(`Fifteen is ${a + b} and
    not ${2 * a + b}.`);
    ```

- [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)（布尔）

- [`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)（符号）（ES2015 新增）

- `Object`

  （对象）

  - `Function`（函数）

  - [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)（数组）

    - JavaScript 数组的长度和元素类型都是非固定的，并且其数据在内存中也可以不连续

    - 和上面的 String 类似，可以`new Array()`来创建数组，当然更简单的是使用字面量来创建`let a =['abc',1];`，同样地可以直接对这样创建的数组使用 Array 对象的方法，例如`a.pop();`

    - ```javascript
      let a = [1, 2, , 4];
      console.log(a[2]);
      //undefined
      a[100] = 100;
      console.log(a.length);
      //101
      ```

  - [`Date`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Date)（日期）

  - [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/RegExp)（正则表达式）

- [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)（空）

- [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)（未定义）

可以看到函数和数组也属于对象

#### 注释

JavaScript 注释的语法和 C++ 或许多其他语言类似

```javascript
// 单行注释

/* 这是一个更长的,
   多行注释
*/
```

#### 变量

JavaScript 有三种声明变量的方式。

- [`var`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var)

  声明一个变量，可选初始化一个值。

- [`let`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)

  声明一个块作用域的局部变量，可选初始化一个值。

- [`const`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const)

  声明一个块作用域的只读常量，必须初始化一个值。

如果声明了一个变量却没有对其赋值，那么这个变量的类型就是 `undefined`

`const`很明显是一个常量，他是只读的，而`let`与`var`的主要区别在于，`let`的作用域是块作用域，而`var`的作用域是全局或者函数作用域(`const`也是块作用域)，并且`let`没有变量提升

最简单的例子如下

```javascript
{
  let a = 10;
  var b = 1;
}

a; // ReferenceError: a is not defined.
b; // 1
```

有关变量提升，指的是

```javascript
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```

他们的详细区别可见[此处](https://es6.ruanyifeng.com/#docs/let)

#### 运算符

这里只介绍与 C++不同的部分

- 求幂：`x**2`

- 全等和不全等：`x===y` `x!==y`比较两个操作数是否相等且类型相同

- 一元的正：即`+`，如果操作数在之前不是 number，试图将其转换为 number

- 字符串运算：`+`可以直接连接两个字符串，并同时会尝试将另一个操作数转换为 string

- [解构赋值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)：将属性/值从对象/数组中取出,赋值给其他变量，例如

  ```javascript
  var a, b, rest;
  [a, b, ...rest] = [10, 20, 30, 40, 50];
  console.log(a); // 10
  console.log(b); // 20
  console.log(rest); // [30, 40, 50]

  var o = { p: 42, q: true };
  var { p, q } = o;
  ```

#### 控制结构

JavaScript 的控制结构与其他类 C 语言类似，在此进行一下罗列

```javascript
var name = "kittens";
if (name == "puppies") {
  name += "!";
} else if (name == "kittens") {
  name += "!!";
} else {
  name = "!" + name;
}
name == "kittens!!"; // true

//--------------------------------------
while (true) {
  // 一个无限循环！
}

var input;
do {
  input = get_input();
} while (inputIsNotValid(input));
//---------------------------------------
for (var i = 0; i < 5; i++) {
  // 将会执行五次
}

//---------------------------------------
switch (action) {
  case "draw":
    drawIt();
    break;
  case "eat":
    eatIt();
    break;
  default:
    doNothing();
}
```

JavaScript 也还包括其他两种重要的 for 循环： [`for`...`of`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of)

```js
for (let value of array) {
  // do something with value
}
```

和 [`for`...`in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) ：

```js
for (let property in object) {
  // do something with object property
}
```

`for ... in`是为遍历对象属性而构建的，不建议与数组一起使用

#### 对象

JavaScript 中的对象，Object，可以简单理解成“名称-值”对，与我们知道的 Python 中的字典（Dictionary）、C/C++ 中的散列表（Hash table）比较相似

有两种简单方法可以创建一个空对象：

```js
var obj = new Object();
```

和：

```js
var obj = {};
```

这两种方法在语义上是相同的。第二种更方便的方法叫作“对象字面量（object literal）”法。这种也是 JSON 格式的核心语法，一般我们优先选择第二种方法。

有关对象的访问和成员设置

```javascript
person.age = 45;
person["name"]["last"] = "Cratchit";
```

和大家刚学过的 C++类似，这里的对象也有`this`来指向了当前代码运行时的对象

有关 OOP 的细节在这里不再介绍，其概念与 C++有一些相似性，如果想复习一下 OOP 并且了解 Js 中的对象可以参考[这里](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects)

#### 函数

最简单的函数定义十分简单

```javascript
function add(x, y) {
  var total = x + y;
  return total;
}
```

如果调用函数时没有提供足够的参数，缺少的参数会被 `undefined` 替代，而事实上你传入的参数在一个名为 [`arguments`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments) 的函数内部对象中，可以像数组一样来访问它，所以你传入了过多的参数也是可以的

```javascript
function add() {
  var sum = 0;
  for (var i = 0, j = arguments.length; i < j; i++) {
    sum += arguments[i];
  }
  return sum;
}

add(2, 3, 4, 5); // 14
```

`arguments`写起来又丑又长，我们可以用剩余参数来实现相似的功能。剩余参数操作符在函数中以：**...variable** 的形式被使用，它将包含在调用函数时使用的未捕获整个参数列表到这个变量中，例如

```javascript
function avg(first, ...args) {
  var sum = first;
  for (let value of args) {
    sum += value;
  }
  return sum / args.length;
}

avg(2, 3, 4, 5); // 3.5
```

> 和剩余参数操作符长得一样的一个语法是展开语法，[展开语法(Spread syntax)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax), 可以在函数调用/数组构造时, 将数组表达式或者 string 在语法层面展开；还可以在构造字面量对象时, 将对象表达式按 key-value 的方式展开。例如
>
> ```javascript
> let a = [1, 2, 3];
> let b = { 1: "1", 2: "2" };
>
> let c = [...a, 4];
> //[1, 2, 3, 4]
> let d = { ...b, 3: "3" };
> //{1: "1", 2: "2", 3: "3"}
> ```
>
> 可以看到这种语法在利用已有的数组/对象构造新的数组/对象时十分方便

JavaScript 也允许在一个函数内部定义函数，它们可以访问父函数作用域中的变量

```javascript
function parentFunc() {
  var a = 1;

  function nestedFunc() {
    var b = 4; // parentFunc 无法访问 b
    return a + b;
  }
  return nestedFunc(); // 5
}
```

JavaScript 允许创建匿名函数，可以通过[函数表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/function)来实现，函数表达式也可以被赋值给一个变量，例如

```javascript
//直接调用
(function (x, y) {
  return x + y;
})(1, 2);
//3

//作为参数传递
setTimeout(function () {
  console.log("111");
}, 1000);

//赋值给变量
const add = function (x, y) {
  return x + y;
};
add(1, 2);
//3
```

而除了函数表达式之外，我们还有一种更加简洁的方式来创建函数--[箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

引入箭头函数有两个方面的作用：更简短的函数并且不绑定`this`

箭头函数的基本语法为

```javascript
(param1, param2, …, paramN) => { statements }

(param1, param2, …, paramN) => expression
//相当于：(param1, param2, …, paramN) =>{ return expression; }

// 当只有一个参数时，圆括号是可选的：
(singleParam) => { statements }
singleParam => { statements }

// 没有参数的函数应该写成一对圆括号。
() => { statements }
```

在使用匿名函数的地方箭头函数是十分常见的，箭头函数没有单独的`this`，不绑定`arguments`，不能用作构造函数，不太适合作为方法

### 异步

#### 异步基本概念

通常来说，程序都是顺序执行，同一时刻只会发生一件事。如果一个函数依赖于另一个函数的结果，它只能等待那个函数结束才能继续执行。这是令人沮丧的体验，没有充分利用计算机的计算能力 — 尤其是在计算机普遍都有多核 CPU 的时代，坐在那里等待毫无意义，你完全可以在另一个处理器内核上干其他的工作，同时计算机完成耗时任务的时候通知你。这样你可以同时完成其他工作，这就是**异步编程**的出发点。

具体来说，我们在 web 编程中，当浏览器里面的一个 web 应用进行密集运算还没有把控制权返回给浏览器的时候，整个浏览器就像冻僵了一样，即出现了**阻塞**。在实际应用中，这种情况可能是因为向后端请求数据，然后对得到的数据进行处理并展示，在等待数据的时候，就会发生阻塞。而会发生阻塞是因为 JavaScript 传统上是单线程的，即每个任务顺序执行，只有前面的结束了，后面的才能开始。

```
Main thread: Task A                   Task B
    Promise:      |__async operation__|
```

如上，在异步中，任务 B 会在任务 A 执行完之后被唤醒执行，而在这个过程中主线程可以进行其他渲染任务

#### 异步 JavaScript

我们先来看[同步的 JavaScript](https://mdn.github.io/learning-area/javascript/asynchronous/introducing/basic-function.html)，即代码顺序执行

```javascript
const btn = document.querySelector("button");
btn.addEventListener("click", () => {
  alert("You clicked me!");

  let pElem = document.createElement("p");
  pElem.textContent = "This is a newly-added paragraph.";
  document.body.appendChild(pElem);
});
```

这个例子里，当我们按下按钮之后，直到关闭 alter，后面的页面渲染都没有进行（这里 alter 只是为了演示，实际应用中不会用到它）

还有一个更实际的例子，我们要请求一张图片，然后将它显示在页面上

```javascript
var response = fetch("myImage.png");
var blob = response.blob();
```

因为你不知道下载图片会多久，所以第二行代码执行的时候可能报错，因为图像还没有就绪。取代的方法就是，代码必须等到 `response` 返回才能继续往下执行，而这个时候，你的页面就会看上去像卡住了

#### 回调函数(callbacks)

回调函数即作为参数传递给那些在后台执行的其他函数， 当那些后台运行的代码结束，就调用 callbacks 函数，通知你工作已经完成，或者其他有趣的事情发生了。

比如上面的`addEventListener`就是一个回调，他在监听的事件发生的时候被调用。但是注意，不是所有的回调函数都是异步的，比如用`forEach`来遍历数组时，传入的函数就是同步的。

由于我们在后面很少单纯用回调来实现异步（这种写法比较古老而且有一些缺点），这里只展示一个简单的例子

`setTimeout`：在指定的时间后执行一段代码

可以思考一下在同步和异步的情况下这段代码的输出是什么样的

```javascript
setTimeout(() => {
  console.log("hi");
}, 20000);
console.log("bye");
```

有关回调函数，还有一个比较有意思的[回调地狱](http://callbackhell.com/)的情况会出现

#### Promise

Promises 是新派的异步代码，现代的 web APIs 经常用到。先来看一个展示 Promise 基本语法的例子

```js
fetch("products.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    products = json;
    initialize();
  })
  .catch(function (err) {
    console.log("Fetch problem: " + err.message);
  });
```

这里的`fetch()` 返回一个 [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). promise 是表示异步操作完成或失败的对象。可以说，它代表了一种中间状态。 本质上，这是浏览器说“我保证尽快给您答复”的方式，因此得名“promise”。而在上面的代码中，跟在 promise 后面的是

- 两个 `then()` 块。两者都包含一个回调函数，如果前一个操作成功，该函数将运行，并且每个回调都接收前一个成功操作的结果作为输入，因此可以继续对它执行其他操作。每个 `.then()`块返回另一个 promise，这意味着可以将多个`.then()`块链接到另一个块上，这样就可以依次执行多个异步操作。
- 如果其中任何一个`then()`块失败，则在末尾运行`catch()`块——与同步`try...catch`类似，`catch()`提供了一个错误对象，可用来报告发生的错误类型。

Promise 对象本质上表示的是一系列操作的中间状态，或者说是未来某时刻一个操作完成或失败后返回的结果。Promise 并不保证操作在何时完成并返回结果，但是保证在当前操作成功后执行您对操作结果的处理代码，或在操作失败后，优雅地处理操作失败的情况。

对比回调，Promise 的优点可以从下面的代码中看出（模拟按顺序处理披萨订单）

回调的实现是这样的，就像上面的回调地狱，可读性差

```javascript
chooseToppings(function (toppings) {
  placeOrder(
    toppings,
    function (order) {
      collectOrder(
        order,
        function (pizza) {
          eatPizza(pizza);
        },
        failureCallback
      );
    },
    failureCallback
  );
}, failureCallback);
```

而用 Promise 我们可以这样实现

```javascript
chooseToppings()
  .then((toppings) => placeOrder(toppings))
  .then((order) => collectOrder(order))
  .then((pizza) => eatPizza(pizza))
  .catch(failureCallback);
```

#### async await

`async`和`await`是在 ECMAScript 2017 中添加的 promises 的语法糖，使得异步代码更易于编写和后续阅读。

- 首先，我们使用`async`关键字，将它放在函数声明之前，将其转换为[async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)。异步函数是一个知道怎样预期 await 关键字可用于调用异步代码可能性的函数。而 async 函数调用返回的是一个 promise

  ```javascript
  const hello = async () => {
    return "Hello";
  };
  hello();
  //Promise {<resolved>: "Hello"}
  ```

  当然这个 Promise 可以像之前提到的一样后接`.then()`等等来使用。我们只需要在需要异步执行的函数前添加`async`关键字，JavaScript 引擎就可以优化你的程序

- 与`awiat`关键字结合可以体现出他们的真正优势，`awiat`可以用在异步函数中，他会使得暂停代码在该行上，直到 promise 完成，然后返回结果值。可以在调用任何返回 Promise 的函数时使用`await`。

我们通过一个例子来看下它与 Promise 的区别

**Promise**

```javascript
fetch("coffee.jpg")
  .then((response) => response.blob())
  .then((myBlob) => {
    let objectURL = URL.createObjectURL(myBlob);
    let image = document.createElement("img");
    image.src = objectURL;
    document.body.appendChild(image);
  })
  .catch((e) => {
    console.log(
      "There has been a problem with your fetch operation: " + e.message
    );
  });
```

**async await**

```javascript
async function myFetch() {
  try {
    let response = await fetch("coffee.jpg");
    let myBlob = await response.blob();

    let objectURL = URL.createObjectURL(myBlob);
    let image = document.createElement("img");
    image.src = objectURL;
    document.body.appendChild(image);
  } catch (e) {
    console.log(e);
  }
}

myFetch();
```

使用 async、await 会使你的代码看起来更像是同步代码，读起来也十分容易理解，因为他实际上就是在顺序执行，但是在等待 await 的时候并不会产生阻塞，影响其他渲染任务

## TypeScript

> 更加深入的学习可以参考[官方文档](https://www.typescriptlang.org/docs/home.html)（[中文](https://www.tslang.cn/index.html)），在这里我们做简单介绍

JavaScript 是一个不具有强类型的动态语言，这赋予了它极大的灵活性，但也带来了开发和生产上可能存在的问题。TypeScript 是 JavaScript 的超集，使得 JavaScript 中的每一个变量和函数都具有和 C 一样的类型定义。你可以利用 TypeScript 在编译期进行类型检查，提前发现错误。我们在使用 ts 的时候，最终还是会将其编译为 js 代码，但是在编译的时候会进行静态类型检查如果发现有错误，编译的时候就会报错。

### 类型注解

TypeScript 里的类型注解是一种轻量级的为函数或变量添加约束的方式。我们可以简单的使用`:`来添加类型注解，例如

```typescript
function greeter(person: string) {
  return "Hello, " + person;
}
let user = [0, 1, 2];

greeter(user);
//greeter.ts(7,26): error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

在此展示最简单的基础类型

```typescript
//布尔值
let isDone: boolean = false;

//数字
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;

//字符串
let name: string = "bob";
name = "smith";
let sentence: string = `Hello, my name is ${name}.`;

//数组
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];

//元组,表示一个已知元素数量和类型的数组，各元素的类型不必相同
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Error

//枚举
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;

//Void，表示一个函数没有返回值
function warnUser(): void {
  console.log("This is my warning message");
}

//Null 和 Undefined
let u: undefined = undefined;
let n: null = null;
//他们是所有类型的子类型
// 这样不会报错
let num: number = undefined;
```

这里单独说一下`any`，任意值（Any）用来表示允许赋值为任意类型，并且你可以对其访问任何属性，调用任何方法。它主要用于为那些在编程阶段还不清楚类型的变量指定一个类型，比如来自用户输入或第三方代码库的内容。如果你在声明变量的时候没有指定类型和初值，他会被识别为`any`类

```typescript
let myFavoriteNumber: any = "seven";
myFavoriteNumber = 7;

let something;
something = "seven";
something = 7;
```

下面给出指定函数类型的例子

```typescript
//完整
let myAdd: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};

//推断
// myAdd has the full function type
let myAdd = function (x: number, y: number): number {
  return x + y;
};

// The parameters `x` and `y` have the type number
let myAdd: (baseValue: number, increment: number) => number = function (x, y) {
  return x + y;
};
```

ts 也可以设定可选参数以及参数默认值，可选参数在参数后加?即可

```typescript
let myAdd = function(x: number = 1, y?: number): number { ...};
```

### 类型断言

有时候你会遇到这样的情况，你会比 TypeScript 更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。通过*类型断言*这种方式可以告诉编译器，“相信我，我知道自己在干什么”。

类型断言的两种方式为

```typescript
let someValue: any = "this is a string";

let strLength1: number = (<string>someValue).length;

let strLength2: number = (someValue as string).length;
```

### 联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种。联合类型使用 `|` 分隔每个类型。

```typescript
let myFavoriteNumber: string | number;
myFavoriteNumber = "seven";
myFavoriteNumber = 7;
```

当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们**只能访问此联合类型的所有类型里共有的属性或方法**

```typescript
function getLength(something: string | number): number {
  return something.length;
}

// index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```

这时候我们就可以用到上面的类型断言

### 类型别名

我们使用 `type` 创建类型别名，类型别名常用于联合类型

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
```

### [接口](https://www.tslang.cn/docs/handbook/interfaces.html)

TypeScript 的核心原则之一是对值所具有的*结构*进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在 TypeScript 里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。简单的说，在 TypeScript 中，我们使用接口（Interfaces）来定义对象的类型。

```typescript
interface Person {
  name: string;
  age: number;
}

let tom: Person = {
  name: "Tom",
  age: 25,
};

let jack: Person = {
  name: "Jack",
};
// index.ts(6,5): error TS2322: Type '{ name: string; }' is not assignable to type 'Person'.
//   Property 'age' is missing in type '{ name: string; }'.
```

当然也可以加入可选属性，上面的错误可以这样解决

```typescript
interface Person {
  name: string;
  age?: number;
}
let jack: Person = {
  name: "Jack",
};
```

### [泛型](https://www.tslang.cn/docs/handbook/generics.html)

这个概念和 C/C++里的模板比较相似，由于刚学过在此不作讲解，具体可以在读代码的时候学习

```C++
template <typename T>
```

```typescript
function identity<T>(arg: T): T {
  return arg;
}
let myIdentity: <T>(arg: T) => T = identity;
```

EESAST 前端代码中的一个例子

```typescript
const columns: ColumnProps<ITeam>[] = [];
```

### [模块](https://www.tslang.cn/docs/handbook/modules.html)

任何声明（比如变量，函数，类，类型别名或接口）都能够通过添加`export`关键字来导出。

可以在声明的时候直接导出

```typescript
export interface StringValidator {
  isAcceptable(s: string): boolean;
}

export const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
```

也可以在声明之后的任意位置导出，并且可以重命名

```typescript
class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };
```

在导入的时候，可以直接导入，也可以进行重命名

```typescript
import { ZipCodeValidator } from "./ZipCodeValidator";

import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";
```

每个模块都可以有一个`default`导出。 默认导出使用 `default`关键字标记；并且一个模块只能够有一个`default`导出。对于`default`模块在导入的时候不必加大括号，而且可以直接重命名

```typescript
//OneTwoThree.ts
export default "123";
```

```typescript
import num from "./OneTwoThree";
```
