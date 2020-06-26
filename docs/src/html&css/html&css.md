# HTML&CSS入门

> 这里介绍的知识非常基础，因为网站组的同学们在后面写网站的时候很少直接写HTML&CSS（尤其是HTML），这里讲只是为了让大家简单了解下网页的机制

> 本文档参考[MDN](https://developer.mozilla.org/zh-CN/)完成，希望深入学习的同学可以参考

## HTML

> 参考：https://developer.mozilla.org/zh-CN/docs/Web/HTML

### 基础

HTML (Hyper Text Markup Language) 不是一门编程语言，而是一种用来告知浏览器如何组织页面的标记语言。HTML 可复杂、可简单，一切取决于开发者。它由一系列的元素（elements）组成，这些元素可以用来包围不同部分的内容，使其以某种方式呈现或者工作。 一对标签（ tags）可以为一段文字或者一张图片添加超链接，将文字设置为斜体，改变字号，等等。 

最简单的一个内容是这样的

<p>欢迎大家加入科协</p>

```html
<p>欢迎大家加入科协</p>
```

这是一个段落(p)元素，一个html元素的组成分为

1. **开始标签**（Opening tag）：包含元素的名称，被左、右角括号所包围。表示元素从这里开始或者开始起作用 
2. **结束标签**（Closing tag）：与开始标签相似，只是其在元素名之前包含了一个斜杠。这表示着元素的结尾 —— 在本例中即段落在此结束。初学者常常会犯忘记包含结束标签的错误，这可能会产生一些奇怪的结果。
3. **内容**（Content）：元素的内容，本例中就是所输入的文本本身。
4. **元素**（Element）：开始标签、结束标签与内容相结合，便是一个完整的元素。

HTML元素可以进行嵌套，比如

<p><em>欢迎</em>大家加入<strong>科协</strong></p>

```html
<p><em>欢迎</em>大家加入<strong>科协</strong></p>
```

### 块级元素和内联元素

块级元素在页面中以块的形式展现 —— 相对于其前面的内容它会出现在新的一行，其后的内容也会被挤到下一行展现，例如上面的<p>

内联元素通常出现在块级元素中并环绕文档内容的一小部分，而不是一整个段落或者一组内容。内联元素不会导致文本换行：它通常出现在一堆文字之间例如超链接元素<a>或者强调元素<em>和<strong>。

### 空元素

不是所有元素都拥有开始标签，内容，结束标签，一些元素只有一个标签，通常用来在此元素所在位置插入/嵌入一些东西，比如<img>

### 属性

使用属性来给元素设定额外信息，属性的基本写法为

```html
<p class="foobar">EESAST</p>
```

用空格与元素名或前一个属性隔开，`属性名="值"`（单引号双引号都可）

比较典型的例子就是元素<a>，用来创建链接

<a href="https://eesast.com" title="科协官网">EESAST</a>

```html
<a href="https://eesast.com" title="科协官网">EESAST</a>
```

### 一个HTML文件的结构

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>我的测试站点</title>
  </head>
  <body>
    <p>这是我的页面</p>
  </body>
</html>
```

- `<!DOCTYPE html>`: 声明文档类型
- `<html></html>`: `<html>`元素。这个元素包裹了整个完整的页面，是一个根元素。
- `<head></head>`: `<head>`元素. 
- `<meta charset="utf-8">`: 元数据，在这里是设置文档使用utf-8字符集编码，也可以像`<meta name="author" content="Chris Mills">`这样用name和content来设置其他信息，当然在不同的应用场景可以设置很多不同的元数据
- `<title></title>`: 设置页面标题
- `<body></body>`: `<body>`元素， 包含了你访问页面时所有显示在页面上的内容

### 在HTML中应用CSS和JavaScript

对于CSS，需要加入一个`<link>`元素，rel="stylesheet"表明这是文档的样式表，而 href包含了样式表文件的路径，这个元素一般放在`<head>`里

```html
<link rel="stylesheet" href="my-css-file.css">
```

对于js脚本，加入`<script>`元素，src为脚本的路径。`<script>`部分没必要非要放在文档头部，实际上，把它放在文档的尾部`</body>`标签之前是一个更好的选择，这样可以确保在加载脚本之前浏览器已经解析了HTML内容

```html
<script src="my-js-file.js"></script>
```

这里script元素没有内容，但他不是一个空元素，你也可以直接把脚本写在元素里

### HTML的基本布局

- `<header>`：页眉。
- `<nav>`：导航栏。
- `<main>`：主内容。主内容中还可以有各种子内容区段，可用`<article>`、`<section>` 和`<div>`等元素表示。
- `<aside>`：侧边栏，经常嵌套在`<main>`中。
- `<footer>`：页脚。

关于完整的html元素和属性，可以参考[这里](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference)

## CSS

> 参考：https://developer.mozilla.org/zh-CN/docs/Web/CSS

### 基础

CSS是一门基于规则的语言，他的基础结构为：由一个选择器开头，后接一对大括号，在大括号内部定义一个或多个形式为 `属性(property):值(value);` 的声明(declarations)。每个声明都指定了我们所选择元素的一个属性，之后跟一个我们想赋给这个属性的值。[这里](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)可以查看所有属性。

```css
h1 {
    color: red;
    font-size: 5em;
}

p {
    color: black;
}
```

#### 元素选择器

使用元素选择器来直接匹配一种html元素

```css
p {
  color: green;
}
```

不同的选择器可以用`,`隔开来使用多个选择器

```html
p, li {
    color: green;
}
```

这种直接指定元素类型的写法只能同时应用于所有同类元素，在实际使用的时候是十分不方便的，因此我们还可以使用类名来进一步指定作用的对象。前面说到HTML中的元素可以添加属性，这里的类名选择器就对应标签中的`class`属性，比如

```html
<ul>
  <li>项目一</li>
  <li class="special">项目二</li>
  <li>项目 <em>三</em></li>
</ul>
```

```css
.special {
  color: orange;
  font-weight: bold;
}
```

这里指定了属于special类的元素进行设置，在在选择器的开头加`.`即为指定类，当然可以同时指定元素和类

```css
li.special,
span.special {
  color: orange;
  font-weight: bold;
}
```

此外，我们还可以根据元素的位置来进行选择，在选择器中使用` 空格`来表示包含（嵌套）关系，用`+`来表示相邻关系，例如

```css
li em {
  color: rebeccapurple;
}
```

表示选择嵌套在`<li>`内部的`<em>`

```css
h1 + p {
  font-size: 200%;
}
```

表示选择跟在`<h1>`后面的`<p>`

可以尝试下解读这个选择器

```css
body h1 + p .special {
  color: yellow;
  background-color: black;
  padding: 5px;
}
```

### 盒模型

> 参考：https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model

在CSS中，所有的元素都被一个个的“盒子（box）”包围着，理解这些“盒子”的基本原理，可以帮助我们使用CSS实现准确布局、处理元素排列。

CSS中组成一个块级盒子需要:

- **Content box**: 这个区域是用来显示内容，大小可以通过设置 [`width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width) 和 [`height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height).
- **Padding box**: 包围在内容区域外部的空白区域； 大小通过 [`padding`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/padding) 相关属性设置。
- **Border box**: 边框盒包裹内容和内边距。大小通过 [`border`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border) 相关属性设置。
- **Margin box**: 这是最外面的区域，是盒子和其他元素之间的空白区域。大小通过 [`margin`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin) 相关属性设置。

如下图：

![box](./images/box-model.png)

在标准模型中，如果你给盒设置 `width` 和 `height`，实际设置的是 *content box*。 padding 和 border 再加上设置的宽高一起决定整个盒子的大小

```css
.box {
  width: 350px;
  height: 150px;
  margin: 25px;
  padding: 25px;
  border: 5px solid black;
}
```

可以尝试计算一下这个盒子的大小