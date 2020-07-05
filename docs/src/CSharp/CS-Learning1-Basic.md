#### C#：概述

C# 语法高度重视表达，但学习起来也很简单轻松。 任何熟悉 C、C++ 或 Java 的人都可以立即认出 C# 的大括号语法。 通常情况下，了解上述任何一种语言的开发者都可在短时间内就开始使用 C# 高效工作。 C# 语法简化了 C++ 的许多复杂操作，并提供强大功能，如可以为 null 的类型、枚举、委托、lambda 表达式和直接内存访问。 

作为面向对象的语言，C# 支持封装、继承和多态性这些概念。 所有变量和方法（包括作为应用程序入口点的 `Main` 方法）都封装在类定义中。 虽然类可能会直接继承一个父类，但可以实现任意数量的接口。 若要用方法重写父类中的虚方法，必须使用 `override` 关键字，以免发生意外重定义。 在 C# 中，结构就像是轻量级类，是可以实现接口但不支持继承的堆栈分配类型。

除了这些面向对象的基本原则，使用 C# 还可以通过以下多个创新语言构造更加轻松地开发软件组件：

- 封装的方法签名（名为“*委托*”），可实现类型安全事件通知。
- 用作私有成员变量的访问器的属性。
- 在运行时提供有关类型的声明性元数据的特性。
- 内联的 XML 文档注释。
- 语言集成查询 (LINQ)，提供跨各种数据源的内置查询功能。

C# 生成过程比 C 和 C++ 更简单，比 Java 更灵活。 没有单独的头文件，也不要求按特定顺序声明方法和类型。 C# 源文件可以定义任意数量的类、结构、接口和事件。

* [微软官方文档][官方文档]

#### 程序结构

一个 C# 程序主要包括以下部分：

- 命名空间声明（Namespace declaration）
  - Class 类声明
    - 一个 Main 方法
      - 语句（Statements）& 表达式（Expressions）
    - 其他方法和属性
  - 其他类声明
- 其他命名空间...

```c#
using System; // 在程序中包含System命名空间
namespace HelloWorldApplication // 声明命名空间
{
   class HelloWorld // 声明一个类
   {
      static void Main(string[] args) // 静态方法
      {
         /* 我的第一个 C# 程序*/
         HelloWorld n = new HelloWorld();
         Console.WriteLine("Hello World");  // System.Console.WriteLine
         /* 定义在 System 命名空间中的 Console 类的一个方法 */
         Console.ReadKey(); //等待一个按键的动作
      }
   }
}
```

#### 数据类型

##### 值类型

* bool，char，float(1.0F)，double(1.0D)，short(16)，int(32)，long(64)，uint...
  * byte 8位无符号整数
  * decimal：128位十进制整数/小数，有效位数28-29位(1.0M)
  * 结构体(Struct)
* 传参时进行值传递，拷贝副本
* 在栈空间上分配内存，不会给垃圾回收(GC)造成负担
* 不能派生其他子类，不能使用线程锁

##### 引用类型

* 所有类型的基类object, 字符串string，数组Array，类class，接口interfac，委托delegate..

* 传参和直接赋值时进行引用传递，可以在函数内部改变其值

  * string类较为特殊，string间赋值被重载为深复制

    ```c#
    string s1 = "Hello, World!";
    string s2 = s1;
    s2 = "See you!";
    Console.WriteLine(s1); // "Hello, World!"
    Console.WriteLine(s2); // "See you!"
    ```

* 在堆空间上分配内存，并由GC机制进行内存管理

* 可以派生，可以使用线程锁等

##### 指针类型

* 可以对方法添加unsafe关键字，并使用C，C++中的指针 int*等
* 在vs项目中设置允许使用不安全的代码
* 由于C#中的GC机制，一个变量（例如一个大数组）有可能在运行过程中被移动到内存中的其他位置，因此不建议使用指针类型(可以使用fixed关键字固定内存位置)
* 可以在unsafe环境中使用stackalloc分配栈内存，栈内存不受GC的影响

##### 可空类型

* 定义变量时，在类型后添加?表示该变量可能为null：`double? num = null;`
* 使用变量时，在变量后添加 ?? 表示若该变量为null，则使用 ?? 后的替换值
  * `double num2 = num ?? 1.0`

##### 类型转化

* 前加(类型名)，(int)
* 调用数据对象的ToString()，ToBoolean()，ToDouble()，Toint32()方法
* 调用System空间的Convert类的相应方法 `double a=Convert.ToDouble(1)`
* 调用VarType.Parse()方法，参数必须为string，如 `Int.Parse("32")`
* 使用as关键字，如果转换失败则返回null，只能用于引用类型间转化

##### 类型判断

* 使用 is 关键字 `if( x is int)`

##### 装箱与拆箱

* 装箱：把值类型转换成引用类型；拆箱：把引用类型转换成值类型

* ```c#
  //装箱
  int i = 1;
  object obj = (object)i;
  //拆箱
  int j = (int)obj;
  ```

* 装箱与拆箱的过程会有性能损耗

#### 基本语法

##### 条件语句

* if else：同C, C++
* ?运算符：同C, C++
* switch case default：同C，C++，case需要添加break语句

##### 循环语句

* for( init; condition; end) 语句，同C, C++
* while循环，do while循环，同C, C++
* foreach语句
  * foreach(typename x in Array/Collection) //可迭代对象
  * 逐一取出可迭代对象内的元素x，语句块内可以读取x的值，但不能改变x的值

#### String 字符串

* String类的对象，用双引号表示字符串
* 使用String类的方法多种字符串操作
  * Compare, Concat, Contains, Copy, Ends/StartsWith, IndexOf, Insert, Replace, Remove, Split, Trim..
* 使用ToCharList方法转换为字符数组
* 使用@前缀表示转义字符串：`@"C:\Windows"`
* 使用$前缀进行字符串内插：

```c#
string name = "Mark";
var date = DateTime.Now;
Console.WriteLine($"Hello, {name}! Today is {date.DayOfWeek}.");
// Hello, Mark! Today is Wednesday.
```

* 也可使用Format方法插入数值，但较为繁琐

`Console.WriteLine("Hello, {0}! Today is {1}.", name, date.DayOfWeek);`



#### Array 数组

* `double[] a = new double[10];` `double[] b = a;//a和b指向同一内存位置` 
* `double[] a = { 2340.0, 4523.69, 3421.0};`
* 数组作为参数传入时，函数体内可修改数组元素的值 

##### 多维数组

* 类似矩阵的数据结构

  ```c#
  int [,] a = new int [2,3] 
  {
   {0, 1, 2} ,
   {3, 4, 5} ,
  };
  ```

* 访问元素：`int b = a[1,2] \\5`
* 使用Rank属性获取多维数组的维数，使用GetLength(d)来获取第d维的长度
* foreach循环会遍历每个元素

##### 交错数组

* 类似C，C++中的多维数组，本质是“元素是数组的数组"
* `int[][] a = new int[2][]{new int[]{92,93,94},new int[]{85,66,87,88}};`
* 获取a的Rank属性，得到结果为1，foreach循环只会遍历各个数组

#### Struct 结构体

* 可以定义字段，属性(区别一会儿再说)，方法，构造函数，不能定义析构函数
* 可以声明静态成员
* 构造函数必须带参数，且在构造函数中必须为每个字段赋值
* 作为参数时是值传递，储存在栈空间中，所需空间较小
* 不能继承和派生

```c#
struct Books
{
   private string title;
   private string author;
   public Books(string t, string a)
   {
   		title = t;
        author = a;
   }
}; 
```

#### Enum 枚举

* 同C, C++，默认为Public，可以显式指定枚举对应的值

```c#
enum Numbers
{
    One,
	Three = 3,
    Four // 从上一项的值+1
}
static void Main()
{
	Numbers num = Numbers.Three;
	Console.WriteLine(num); // "Three"
	int one = 1;
	num = (Numbers) one; // Enum和int可以强制类型转换
	Console.WriteLine(Convert.ToString(num)); // 使用Convert获取枚举字符串
	string four = "Four";
	num = (Numbers)Enum.Parse(typeof(Numbers), four); //由字符串转换为枚举
	Console.WriteLine((int)num);
}
```



#### Class 类

* 基本定义同C，C++，有构造和析构函数(不支持构造函数的简洁写法)
* 作为参数时是引用传递
* 静态变量和静态方法：该类的各个对象共享同一个变量，而**静态方法只能使用静态变量，调用静态方法**
  * main方法是静态方法，故Program类中的全局变量应该设为静态变量
  * 可以使用类名.方法名，不实例化类的对象直接调用静态方法

##### 方法

* 在类中定义方法，每一个 C# 程序至少有一个带有 Main 方法的类。

```c#
   public int Max(int ref num1, int ref num2)
   {
       return num1 > num2 ? num1 : num2;
   }
```

* 使用非静态方法时必须先实例化类的对象，如在Program类中声明了main函数和以上Max函数，则在main函数中调用Max函数时，需先声明Program对象：`Program n = new Program();`，再调用相应的方法：`n.Max(ref a, ref b)`

* 参数传递：
  * 值传递：拷贝值型变量的副本
  * 引用参数：在方法的参数列表和调用方法时均增加**ref**关键字
  * 输出参数：在方法的参数列表和调用方法时均增加**out**关键字, out参数必须在方法内赋值，且不能在赋值前被使用

##### 访问控制

* public, private, protected(对该类对象及其子类对象可以访问)
* 如果不声明，则默认为private


##### 继承与派生

* 继承和派生与C，C++类似，继承后子类可以访问父类中public和protected的字段，属性和方法

|                |       实方法       |          虚方法          |         抽象方法         |
| :------------: | :----------------: | :----------------------: | :----------------------: |
|     修饰符     |         /          |         virtual          |         abstract         |
|    父类要求    |         /          |            /             | 有抽象方法的类也为抽象类 |
|    父类实现    |         /          | 父类必须给出虚方法的实现 |  父类可以只声明抽象方法  |
|    子类实现    | 子类可以覆盖实方法 | 子类可以重载或覆盖虚方法 |    子类必须重载虚方法    |
| 重载(override) |         ×          |            √             |            √             |
|   覆盖(new)    |         √          |            √             |            ×             |
| 基类调用(base) |         √          |            √             |            √             |
| 密封类(sealed) |         √          |            √             |            ×             |

* 覆盖与重载的区别：覆盖后子类的实例可以调用父类被覆盖的方法(强制类型转换)，而重载后则不可以，对于虚方法一般使用重载
* 声明密封类：此类不能被继承

```c#
using System;

namespace CSharpLearning
{
    abstract class Animal // 有抽象方法的类必须是抽象类
    {
        public Animal(){};
        public void Move() // 实方法
        {
            Console.WriteLine("调用了Animal类的Move方法");
        }
        public virtual void Attack() // 虚方法，必须给出实现
        {
            Console.WriteLine("调用了Animal类的Attack方法");
        }
        public abstract void Name(); // 抽象方法，可以只声明，不实现

    }

    sealed class Cat : Animal // 密封类，不能派生，继承了Animal类
    {
        public override void Name() // 若不重载抽象方法则会报错
        {
            Console.WriteLine("调用了Cat类的Name方法");
        }

        public override void Attack() // 可以重载父类的虚方法，也可不重载，还可用new覆盖父类的虚方法
        {
            Console.WriteLine("调用了Cat类的Attack方法");
        }

        public new void Move() // 使用new覆盖父类的实方法
        {
            base.Move(); // 使用base关键字调用父类的同名方法
            Console.WriteLine("调用了Cat类的Move方法");
        }

    }
    class Program
    {
        static void Main(string[] args)
        {
            // Animal animal = new Animal(); 报错：无法创建抽象类Animal的实例
            Cat cat=new Cat();
            cat.Name(); // 调用了Cat类的Name方法
            cat.Move(); // 调用了Animal类的Move方法/n 调用了Cat类的Move方法
            ((Animal)cat).Move(); // 调用了Animal类的Move方法
            ((Animal)cat).Attack(); // 调用了Cat类的Attack方法
            Console.ReadKey();
        }
    }
}
```

##### 字段与属性

* [更多参考资料][字段和属性]
* 字段又称“成员变量”，一般在类的内部做数据交互使用，命名时通常首字母小写
* 属性是外界访问私有字段的入口，负责指定相应字段的读、写方式，命名与对应字段相同且首字母大写
* 声明属性时，首先声明相应的私有字段，然后指定属性的get和set访问器

```c#
class Person
{
    private int age;
	public int Age
	{
		get { return age; }
    	set { age = value > 120 ? 120 : value; }
        // 此处value为关键字，代表用户所赋的值
	}
}
```

* 在C# 7.0之后也可用类似lambda表达式的方法设置属性

```c#
class Person
{
    private int age;
	public int Age { get => age; set => age = value > 120 ? 120 : value; }
    // 注意set语句中仍需对age赋值
    // 如果只实现get访问器，则可以进一步简化为 public int Age => age;
}
```

* 使用属性对应字段的值时，直接对属性读取或赋值：

```c#
Person person = new Person();
person.Age = 20;
Console.WriteLine(person.Age);
```

* 若属性访问器中**不需要任何其他逻辑**时，我们可以使用自动实现的属性，不需要声明相应字段

  `public int Age { get; set; }`

* 此时也可进行初始化`public string Name { get; set; } = "Jane";`

* 若去除set访问器，则属性变为只读的，必须为其指定初始值

  `public string Name { get; } = "Jane";`

#### 运算符重载

* 基本与C，C++一致，使用operator关键字且应声明为static方法

```c#
public static Student operator +(Student s1, Student s2)
{
	return new Student(s1.age + s2.age, s1.name + " And " + s2.name);
}
```

* 重载 == 操作符后也必须重载 != 操作符
* 重载 + 操作符后 += 操作符也自动被重载，- , * , / 等类似
* 使用Implict/Explict关键字重载隐式/显式类型转换运算符
  * `public static implict operator A(B b)` 类型B到类型A的隐式转换

#### Interface 接口

* 接口使用 **interface** 关键字声明，它与类的声明类似。接口声明默认是 public 的
* 抽象类在某种程度上与接口类似，但是，抽象类大多用于只有少数方法由基类声明而由派生类实现时，接口则指定的其派生类应遵循的标准
* 接口通常以大写 I 开头命名，接口的定义与类的定义相似(interface关键字)，其中方法默认为public，接口内也可有属性的声明，但不能有字段
* C#中不允许继承多个类，但可以继承多个接口
* 接口可以继承其他接口，而实现该接口的类应该实现所有接口的方法和属性

```c#
interface IPerson
{
　　string Name { get; set; }`
　　void Show(string name);
}

interface IStudent //也可继承IPerson接口，则Student类只需继承IStudent接口
{
　　string Id { get; set; }`
　　void Show(string id); //若继承IPerson接口，则应加new修饰符覆盖同名方法
}

class Student: IPerson, IStudent //多继承
{
　　public string Name { get; set; }`
　　public string Id { get; set; }`
      
　　void IPerson.Show(string name) //分别实现不同接口的同名方法
　　{
    　　Console.WriteLine("姓名为{0}", name);
　　}
    
　　void IStudent.Show(string id) //如果指定实现接口的函数，则可以不使用访问控制
　　{
    　　Console.WriteLine("学号为{0}", id);
　　}
    
	//public void Show(string id) //如果统一实现，则必须指定访问控制符
    	//{
        //    Console.WriteLine("姓名为{name},学号为{id}");
        //}
}

class Program
{
　　static void Main()
　　{
    　　Student s = new Student();
    　　Console.WriteLine("输入姓名");
    　　s.Name = Console.ReadLine();
    　　Console.WriteLine("输入学号");
    　　s.Id = Console.ReadLine();
    　　IPerson per = s;
    　　per.Show(s.Name);
    　　IStudent stu = s;
    　　stu.Show(s.Id);
　　}
}
```

* 函数可以使用接口作为参数，在传参时传入不同实现该接口的类的实例

#### Exception 异常处理

* 类似C++的 try - throw - catch - finally结构
* 一个try块至少对应一个catch块或1个finally块
* 只会进入从上向下的第一个匹配的代码块，若当前函数中没有匹配的catch块则会搜索外层函数

```c#
static int GetInt(int[] array, int index)
{
	try
	{
		return array[index];
	}
	catch (System.IndexOutOfRangeException ex)  //下标越界的更具体原因在于传递了越界的参数index
	{
		Console.WriteLine(ex.Message);
        // 创建更精确的异常并抛出给外层函数
		throw new ArgumentException("index parameter is out of range.", "index", ex);
    }
}
static void Main()
{
    try
    {
        int[] a = {1, 2, 3, 4, 5};
        GetInt(a, 5);
    }
    catch (ArgumentException ex)
    {
        Console.WriteLine(ex.Message);
    }
    catch (Exception)
    {
        Console.WriteLine("发生未知错误!");
    }
    finally //一般用于释放资源
    {
        Console.WriteLine("Done!");
    }
}
```

#### Delegate 委托

* 类似于C, C++的函数指针，可用于引用任何返回值和参数列表相同的方法
* delegate void printString(string s);`
* 声明委托后，使用new创建委托对象，并且传入要引用的函数名作为参数
  * `printString ps1 = new printString(WriteToScreen);`
* 此后可以使用委托对象调用对应

##### 多播委托

* 作用于参数和返回值相同的委托对象直接
* 委托类型重载了 + - 运算符，可用于依次执行一系列任务，再返回值

```c#
using System;
namespace Program
{
	delegate int NumberChanger(int n); // 委托可以直接在命名空间内声明
    class TestDelegate
    {
        public static int Num { get; set; } = 10;
        public static int AddNum(int p)
        {
            Num += p;
            return Num;
        }

        public static int MulNum(int q)
        {
            Num *= q;
            return Num;
        }
        static void Main(string[] args)
        {
            NumChanger fc1 = new NumChanger(AddNum);
            NumChanger fc2 = new NumChanger(MulNum);
            NumChanger fc = fc2 + fc1;
            Console.WriteLine(fc(5)); // 75 = (10 * 5) + 5
        }
    }
}
```

* 委托可以接受匿名函数作为参数

`NumChanger fc1 = delegate(int p) { Num += p; return p;};`

* 也可以接受一个**lambda表达式**作为参数：

`NumChanger fc1 = (int p) =>  { Num += p; return p;};` 

##### lambda表达式

* 表达式lambda，自动返回表达式的值
  * (int x, int y) => x * y 或省略类型声明 (x, y) => x * y
  * 只有1个参数时可省略左侧的括号 x => x * x * x
* 语句lambda
  * (int x, int y) => { return x * y; }
  * 右侧用大括号扩起，内部可以有多条语句(不宜过多)，也可没有返回值

#### Generic 泛型

* 类似C++ 的模板，可以兼容不同的数据类型，但限制更多
* 泛型类：`class MyArray<T>`
* 泛型方法： `static void Swap<T>(ref T x, ref T y)`
* 泛型委托：`delegate T NumberChanger<T>(T n);`
* 泛型接口：`interface IDictionary<K, V>`
* 继承泛型类或接口时待定类型只能不变或增多

##### 泛型的类型约束

* 声明泛型时可以给泛型添加一定的约束：`class MyArray<T> where T : struct`

* where T : struct ：T必须为(不可为空的)值类型

* where T : class ：T必须为(不可为空的)引用类型

* where T : notnull ：T必须为不可为空的类型

* where T : new() ：T必须具有无参数的构造函数，不能与struct合用

* where T : \<interface name> ：T必须实现指定的接口

* where T : \<base class name> ：T必须为指定类或其派生类

* 多个限制并用：用逗号分隔

* 约束多个参数：

  ```c#
  class Base { }
  class Test<T, U>
      where U : struct
      where T : Base, new()
  ```

#### Collections 集合

* 包含了一系列基本数据结构的命名空间
* ArrayList, SortedList, Hashtable, Stack, Queue..
  * 一般包含Add, Clear, Remove等方法
* 包含一些基本的接口，如 IComparer, IEnumerator(迭代), IList(按索引访问)
* 并未指定成员的数据类型，因此全部成员都被转换为object类
* 对于值类型，使用Collections意味着频繁的装箱和拆箱，性能不佳

##### Collections.Generic

* 利用泛型值类数据类型的数据结构，拥有更好的类型安全性和性能
* Tuple<T1, T2, T3, ...> ，使用.Item1, .Item2来访问，类似C++的pair
  * 使用C# 7.0的新特性**元组**实现此功能
  * (1, 2)； ("one", "two")，...
  * 可以为每个元组的元素起别名：（x : 1, y : 2)
  * 元组支持直接赋值和比较
* List\<T>  类似C++ vector
* Dictionary<T1, T2>
* Queue\<T>， Stack\<T>
* HashSet\<T>

##### 常用库函数介绍(补充)

* System.IO 包含对一系列系统调用的支持，比如各种文件操作
  * FileStream
  * StreamReader 与 StreamWriter 进行文本文件读写
  * BinaryReader 和 BinaryWriter 类用于二进制文件的读写
  * DirectoryInfo 类和 FileInfo 类用于进行windows文件系统的操作
* System.Linq 使用一定格式的语句查询和筛选可迭代对象
* System.Text 包含一系列编解码相关的功能
* System.Text.RegularExpressions; 包含正则表达式的基类Regex
* System.Threading 提供启用多线程的类和接口.

* **事件、异步、多线程... 未完待续**



[官方文档]: https://docs.microsoft.com/zh-cn/dotnet/csharp/

[字段和属性]: https://www.cnblogs.com/doThing/p/properties-in-csharp.html



