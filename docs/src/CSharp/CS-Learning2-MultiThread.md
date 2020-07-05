# C#课程2（事件、异步、多线程）

- [C#课程2（事件、异步、多线程）](#c课程2事件异步多线程)
  - [一、事件（event）](#一事件event)
  - [二、多线程](#二多线程)
    - [1. 简介](#1-简介)
    - [2. 常用方法](#2-常用方法)
    - [3. 常用属性](#3-常用属性)
  - [三、异步编程](#三异步编程)
    - [1. 简介](#1-简介-1)
    - [2. Task介绍](#2-task介绍)
    - [3. async 和 await](#3-async-和-await)
  - [四、锁](#四锁)
    - [读写锁](#读写锁)
    - [死锁的产生](#死锁的产生)
    - [哲学家就餐问题](#哲学家就餐问题)
    - [死锁产生的条件](#死锁产生的条件)
    - [死锁的解决](#死锁的解决)
  - [五、原子操作](#五原子操作)
  - [六、C# 并发集合](#六c-并发集合)
  - [七、C#定时器](#七c定时器)
    - [System.Threading.Timer](#systemthreadingtimer)
    - [System.Timers.Timer](#systemtimerstimer)
  - [八、C# 线程池](#八c-线程池)

---


## 一、事件（event）

通俗来讲，事件是一种广播机制

比如某个组件订阅了一个事件，那么在这个事件被触发的时候组件会收到通知。

例：小明家里有一部电话，有一个正在烧水的热水壶，电话响了（这是一个event）就会触发小明接电话（这是一个方法）这个动作。（*注：这部分代码参考Event.cs）

事件可以实现底层程序集调用高层程序集的方法。并且在调用的时候可以向高层程序集的方法传入参数。

例：我写了一个库，这个库给出一个Read的事件，这个事件会在控制台输入字符串的时候被调用。（*注：这部分代码参考Event2.cs）

---

## 二、多线程

### 1. 简介

进程是操作系统执行程序的基本单位

一个进程拥有多个线程，这些线程之间资源共享。

使用线程进行并发式编程。

C#提供了完整的多线程库

### 2. 常用方法

以下代码显示了如何创建一个线程

```csharp
using System.Threading; // 包含多线程需要的库

public static void Function() // 一个需要被线程调用的函数
{
    Console.WriteLine("Function !");
}

Thread t = new Thread(Function); // 用Function函数初始化线程
```

上面的代码并没有让线程运行，如果要让线程开始运行，需要调用 Start() 方法。

```csharp
t.Start();
``` 

如果Function的定义修改为如下
    
```csharp
public static void Function(string str);
```

那么在Start()方法中就要传入参数。

```csharp
t.Start("Hello World");
```

使用Sleep()方法可以暂停线程一段时间，单位为毫秒。

```csharp
Thread.Sleep(1000) // 线程停顿1秒
```

使用Join()方法可以阻塞当前线程，等待某一个线程执行完毕后再进行后面的任务。比如下面的代码，展示了Join()方法的阻塞作用

```csharp
public static void Function()
{
    for (int i = 0; i < 10; i++)
    {
        Thread.Sleep(200);
        Console.WriteLine("Function !");
    }
}
public static void Run()
{
    Thread t = new Thread(Function);
    t.Start();
    Thread.Sleep(500);
    t.Join(); // 这里阻塞了Run()方法所在线程，等待t执行完毕
    Console.WriteLine("Finish !");
}
```

注意！非常不建议使用Suspend()、Abort()等方法在线程外部暂停或终止一个线程。

### 3. 常用属性
    
- IsBackground 属性，显示一个线程是否为后台线程。
- 如果一个线程为后台线程，那么程序不会等待这个线程执行完毕；如果一个线程是前台线程，程序会等待线程执行完毕再退出。
- IsAlive 属性，显示一个线程是否正在运行。
- IsThreadPoolThread 属性，显示线程是否属于托管线程池。

下面的代码展示了如何控制一个线程是否为后台线程

```csharp
new Thread(() =>
{
    for (int i = 0; i < 10; i++)
    {
        Thread.Sleep(300);
        Console.WriteLine("Thread1 : " + i);
    }
})
{ IsBackground = true }.Start();
new Thread(() =>
{
for (int i = 0; i < 6; i++)
{
    Thread.Sleep(300);
    Console.WriteLine("Thread2 : " + i);
}
})
{ IsBackground = false }.Start();
```

--- 

## 三、异步编程

### 1. 简介

C# 引入了async和await关键字后，异步编程变得十分方便

实际上异步编程也是多线程的一种，只不过不需要手动创建线程，线程从线程池中被创建

例：比如我们在处理UI和按钮单击时，需要运行一个长时间运行的方法，比如读取一个大文件，如果采用同步编程，整个程序必须等待这个任务完成才能执行其他任务。

### 2. Task介绍

使用Task可以很方便地创建一个任务并运行，下面的代码展示了如何创建任务。

```csharp
Task.Run(Method1);
```

还可以采用其他形式创建任务

```csharp
Task task = new Task(Method1);
task.Start();
```

还可以采用Factory创建并运行任务

```csharp
Task.Factory.StartNew(Method1);
```
Task的生命周期：Task.Status

Task的生命周期有如下几种状态：

- Created : 已经被创建但还未开始运行
- Running : 正在运行
- RanToCompletion : 执行完毕

下面的代码展示了Task的生命周期：

```csharp
public static void Method1()
{
    for (int i = 0; i < 5; i++)
    {
        Thread.Sleep(200);
        Console.WriteLine("Method1 : " + i);
    }
}
public static void Run()
{
    Task task = new Task(Method1);
    Console.WriteLine(task.Status);
    task.Start();
    for (int i = 0; i < 7; i++)
    {
        Thread.Sleep(200);
        Console.WriteLine(task.Status);
    }
}
```

输出结果如下：

```csharp
Created
Running
Method1 : 0
Method1 : 1
Running
Running
Method1 : 2
Method1 : 3
Running
Running
Method1 : 4
RanToCompletion
RanToCompletion
```

Task的任务控制，可以控制多个Task的执行顺序

Task.Wait()方法等待任务执行完毕

```csharp
Task task1 = new Task(Method1);
task1.Start();
task.Wait(); // 等待任务执行完毕
Console.WriteLine("task Finish");
```

Task.WaitAll()等待所有任务执行完毕

```csharp
Task task1 = new Task(Method1);
task1.Start();
Task task2 = new Task(Method2);
task2.Start();
Task.WaitAll(task1, task2);
Console.WriteLine("task Finish");
```

Task.WaitAny() 等待任一任务执行完毕

```csharp
Task task1 = new Task(Method1);
task1.Start();
Task task2 = new Task(Method2);
task2.Start();
Task.WaitAny(task1, task2);
Console.WriteLine("task Finish");
```

Task 返回值 Task< TResult >

任何一个异步Task都可以返回一个值，下面的代码展示了如何获取Task的返回值。

```csharp
public static string MethodReturn()
{
    for (int i = 0; i < 5; i++)
    {
        Thread.Sleep(200);
        Console.WriteLine("MethodReturn : " + i);
    }
    return "MethodReturn finish";
}
Task<string> taskReturn = new Task<string>(MethodReturn);
taskReturn.Start();
Console.WriteLine("Task finish with : " + taskReturn.Result);
```
可以看到只需要调用Task.Result就可以获取Task的返回值，并且在尝试获得Task的返回值时会自动阻塞当前线程，直到Task结束。

### 3. async 和 await

await 和字面意思一样，就是等待，下面的代码展示了等待一个任务执行完毕

```csharp
public static async void Run()
{
    await Task.Run(Method1);
    Console.WriteLine("Task1 finish ");
}
```
await 更大的用处是等待一个有返回值的Task，如下代码所示：
```csharp
public static async void Run()
{
    Task<string> task = new Task<string>(MethodReturn);
    task.Start();
    Console.WriteLine("Task1 finish with : " + await task);
}
```
async 的意思也和字面意思完全一样，就是表明一个方法是异步方法，下面展示了一个异步方法：
```csharp
public static async void TestAsync()
{
    await Task.Run(
        () =>
        {
            for (int i = 0; i < 5; i++)
            {
                Thread.Sleep(200);
                Console.WriteLine("TestAsync : " + i);
            }
        });
}
public static async void Run()
{
    TestAsync();
    Console.WriteLine("Task1 finish  ");
}
```
可以注意到凡是方法体里出现了await关键字的，方法定义必然要出现async关键字，这是显然的，因为凡是有await关键字的方法必为异步方法。

需要注意的是如果一个被async修饰的方法里面没有await关键字的话，那么这个方法和同步方法没有区别。

一个async方法里面的异步操作仅出现在await关键字之后。

```csharp
public static async void TestAsync()
{
    for (int i = 0; i < 3; i++)
    {
        Thread.Sleep(200);
        Console.WriteLine("Sync : " + i);
    }
    await Task.Run(
        () =>
        {
            for (int i = 0; i < 5; i++)
            {
                Thread.Sleep(200);
                Console.WriteLine("TestAsync : " + i);
            }
        });
}
public static async void Run()
{
    TestAsync();
    Console.WriteLine("Task1 finish  ");
}
```

因为async方法为异步方法，所以调用async方法的时候常常也使用await。
```csharp
public static async Task<string> AsyncReturn()
{
    await Task.Run(
        () =>
        {
            for (int i = 0; i < 5; i++)
            {
                Thread.Sleep(200);
                Console.WriteLine("AsyncReturn : " + i);
            }
        });
    return "AsyncReturn finish";
}
public static async void Run()
{
    var str = await AsyncReturn();
    Console.WriteLine("Task1 finish with : " + str);
}
```

注意：async方法的返回值只能为void、Task、Task< TResult >，不能为其他

---

## 四、锁

多线程编程过程中常常会出现多个线程同时访问一个资源的情况，这个时候就需要用到锁，把共享的资源锁起来。

一个不使用锁的例子：

```csharp
int num = 0;
Task.Run(
() =>
{
    for (int i = 0; i < 1000; i++)
    {
        num++;
    }
    Console.WriteLine("Thread 1 : " + num);
}
);
Task.Run(
() =>
{
    for (int i = 0; i < 1000; i++)
    {
        num++;
    }
    Console.WriteLine("Thread 2 : " + num);
}
);
```

锁的使用非常简单，只需要使用 lock 关键字就可以锁住一个对象，一个对象同时只允许一个线程访问，其他线程在这个期间会被阻塞。

```csharp
int num = 0;
object numlock = new object();
Task.Run(
    () =>
    {
        for (int i = 0; i < 1000; i++)
        {
            lock (numlock)
                num++;
        }
        lock (numlock)
            Console.WriteLine("Thread 1 : " + num);
    }
);
Task.Run(
    () =>
    {
        for (int i = 0; i < 1000; i++)
        {
            lock (numlock)
                num++;
        }
        lock (numlock)
            Console.WriteLine("Thread 2 : " + num);
    }
);
```

下面这段代码展示了锁是如何阻塞线程的：
```csharp
object tasklock = new object();
Task.Run(() =>
    {
        lock (tasklock)
            for (int i = 0; i < 5; i++)
            {
                Thread.Sleep(200);
                Console.WriteLine("Thread 1");
            }
    }
);
Task.Run(() =>
    {
        lock (tasklock)
            for (int i = 0; i < 5; i++)
            {
                Thread.Sleep(200);
                Console.WriteLine("Thread 2");
            }
    }
);
```

除了使用 lock 关键字，还可以使用 Moniter 来锁定和释放对象。
```csharp
Monitor.Enter(objlock);
Monitor.Exit(objlock);
```

注意：

- 应避免锁定 public 对象，否则实例将超出代码的控制范围。
- 锁定对象应当为 readonly 以免在锁定的过程中发生改变
- 不能锁定值类型

```csharp
lock(9) // 错误，不能锁定值类型
lock(this) // 错误，违反了不能锁定 public 对象的规范
lock("Hello World") // 错误，相同字符串同一程序中只有一个实例对象，相当于锁定 public 对象。
```
下面是正确示例
```csharp
private static readonly object objlock = new object();
lock(objlock)
  ...
```

### 读写锁
    
允许多个线程同时获取读锁，但同一时间只允许一个线程获得写锁

当某个线程进入读取模式时，此时其他线程依然能进入读取模式，假设此时一个线程要进入写入模式，那么他不得不被阻塞。

如果某个线程进入了写入模式，那么其他线程无论是要写入还是读取，都是会被阻塞的。

```csharp
ReaderWriterLockSlim rw = new ReaderWriterLockSlim();
int num = 5;
for (int i = 0; i < 5; i++)
{
    int tmp = i;
    Task.Run(() =>
    {
        rw.EnterReadLock();
        for (int j = 0; j < 5; j++)
        {
            
            Thread.Sleep(200);
            Console.WriteLine("Thread " + tmp + " is reading");
        }
        rw.ExitReadLock();
    });
}
```

上面的代码展示了多个线程可以同时获取读锁。

```csharp
ReaderWriterLockSlim rw = new ReaderWriterLockSlim();
int num = 5;
for (int i = 0; i < 5; i++)
{
    int tmp = i;
    Task.Run(() =>
    {
        for (int j = 0; j < 5; j++)
        {
            rw.EnterReadLock();
            Thread.Sleep(200);
            Console.WriteLine("Thread " + tmp + " is reading");
            rw.ExitReadLock();
        }
    });
}
Thread.Sleep(400);
Task.Run(() =>
{
    rw.EnterWriteLock();
    for (int j = 0; j < 5; j++)
    {
        Thread.Sleep(200);
        Console.WriteLine("Thread is writing");
    }
    rw.ExitWriteLock();
});
```

上面的代码展示了当一个线程获取写锁的时候其他线程都被阻塞。

### 死锁的产生

考虑下面的程序运行过程：

Thread1 : lock 1 -> attempt to lock 2

Thread2 : lock 2 -> attempt to lock 1

这是一个最简单的死锁例子。两个线程都无法继续运行下去，程序产生了死锁。

```csharp
object lock1 = new object();
object lock2 = new object();
Task.Run(() =>
{
    lock (lock1)
    {
        Console.WriteLine("Thread 1 has lock 1");
        Thread.Sleep(1);
        Console.WriteLine("Thread 1 attempt to lock 2");
        lock (lock2)
        {
            Console.WriteLine("Thread 1 has lock 2");
        }
    }
});
Task.Run(() =>
{
    lock (lock2)
    {
        Console.WriteLine("Thread 2 has lock 2");
        Thread.Sleep(1);
        Console.WriteLine("Thread 2 attempt to lock 1");
        lock (lock1)
        {
            Console.WriteLine("Thread 2 has lock 1");
        }
    }
});
```

### 哲学家就餐问题
    
有五个哲学家，他们的生活方式是交替地进行思考和进餐。他们共用一张圆桌，分别坐在五张椅子上。

在圆桌上有五个碗和五支筷子，平时哲学家进行思考，饥饿时便试图取用其左、右最靠近他的筷子，只有在他拿到两支筷子时才能进餐。进餐完毕，放下筷子又继续思考。

死锁的产生：五位哲学家同时饥饿而各自拿起了左边的筷子，当他们试图去拿起右边的筷子时，都将因无筷子而无限期地等待下去。

### 死锁产生的条件

1. 互斥条件。即某个资源在一段时间内只能由一个进程占有
2. 不可抢占条件。进程所获得的资源在未使用完毕之前，资源申请者不能强行地从资源占有者手中夺取资源
3. 占有且申请条件。进程至少已经占有一个资源，但又申请新的资源
4. 循环等待条件。存在一个进程等待序列{P1，P2，...，Pn}，其中P1等待P2所占有的某一资源，P2等待P3所占有的某一源，......

### 死锁的解决

1. 打破互斥条件，允许进程同时访问某些资源（废话）
2. 打破不可抢占条件，即允许进程强行从占有者那里夺取某些资源（也是废话）
3. 打破占有且申请条件。可以实行资源预先分配策略。即进程在运行前一次性地向系统申请它所需要的全部资源（很难满足条件）
4. 资源编号，线程在申请资源时，必须按顺序申请（实现简单，常用）
5. 银行家算法（有一定的限制条件）

资源编号策略：
- 1 号哲学家拿起 1 号筷子
- 2 号哲学家拿起 2 号筷子
- 3 号哲学家拿起 3 号筷子
- 4 号哲学家拿起 4 号筷子
- 5 号哲学家拿起 ? 号筷子

“避免死锁的最好办法，就是不要用锁。” 著名哲学家沃尔兹基说。

---

## 五、原子操作

就如其字面意思，原子操作就是计算机中不可再分割的操作。

C# 提供了一个原子操作库 Interlocked ，可以使用 Interlocked 把常见的操作转化为原子操作。

常见的操作有 i++ （自增操作），如果使用 lock 则系统开销过大，不值得使用，可以使用原子操作进行改写。

```csharp
int num = 0;
Task.Run(
    () =>
    {
        for (int i = 0; i < 1000; i++)
        {
            Interlocked.Increment(ref num);
        }
        Console.WriteLine("Thread 1 : " + num);
    }
);
Task.Run(
    () =>
    {
        for (int i = 0; i < 1000; i++)
        {
            Interlocked.Increment(ref num);
        }
        Console.WriteLine("Thread 2 : " + num);
    }
);
```

除了 Increment 之外，还有许多其他原子操作，比如：

```csharp
Add(ref T a, T b); // a = a + b
Exchange(ref T a, T b); // a = b
CompareExchange(ref T a, T b, int c); // if(b == c) a = b;
Decrement(ref T a); // a--
```

---

## 六、C# 并发集合

C# 默认的集合并不是线程安全的，当多个线程同时对一个集合作修改时可能会发生异常：

```csharp
List<int> l = new List<int>();
Task.Run(() =>
{
    for (int i = 0; i < 10000; i++)
    {
        l.Add(i);
    }
    Thread.Sleep(10);
    Console.WriteLine(l.Count);
});
Task.Run(() =>
{
    for (int i = 0; i < 10000; i++)
    {
        l.Add(i);
    }
    Thread.Sleep(10);
    Console.WriteLine(l.Count);
});
```

C# 提供了多个线程安全集合类，这些线程安全集合都是无锁的，能够支持高效的多线程操作

下面以 ConcurrentQueue< T > 为例展示一下线程安全集合类的用法：

```csharp
ConcurrentQueue<int> q = new ConcurrentQueue<int>(); // 新建一个线程安全队列。
q.Enqueue(9); // 数字 9 入队
q.TryDequeue(out int temp); // 从队列头取出一个数
Console.WriteLine(temp);
```

注意，Concurrent 集合通常都有 Try 方法，凡是 Try 方法都不一定能执行成功，并且都会返回一个布尔值，用来显示 Try 方法是否执行成功。

Concurrent 命名空间下没有 HashSet< T > 的对应线程安全集合，但可以用 ConcurrentDictionry< T, byte > 来代替。

除了 Concurrent 命名空间下的集合，C# 还提供了 BlockingCollection 阻塞集合。这个集合的特点是当集合为空时，想要从集合里取出元素会被阻塞

```csharp
BlockingCollection<int> b = new BlockingCollection<int>();
Task.Run(() =>
{
    for (int i = 0; i < 10; i++)
    {
        Thread.Sleep(300);
        b.Add(i);
        Console.WriteLine("Add " + i);
    }
});
Task.Run(() =>
{
    for (int i = 0; i < 10; i++)
    {
        Console.WriteLine("Take " + b.Take());
    }
});
```

上面这段代码展示了 BlockingCollection 是如何把线程阻塞的。

利用 BlockingCollection 可以实现事件队列，强制把所有事件放在同一线程里执行。

```csharp
BlockingCollection<Action> EventQueue = new BlockingCollection<Action>();
new Thread(() =>
{
    while (true)
        EventQueue.Take()();
}).Start();
```

只需要很少的代码就可以实现事件队列的编写。

我们可以用如下代码测试事件队列：

```csharp
for (int i = 0; i < 10; i++)
{
    Thread.Sleep(300);
    Task.Run(() =>
    {
        EventQueue.Add(() =>
        {
            Console.WriteLine(DateTime.Now);
        });
    });
}
```

---

## 七、C#定时器

C# 里提供了几种定时器的实现方法。

### System.Threading.Timer
  
下面的代码展示了如何新建一个定时器
```csharp
System.Threading.Timer timer = new Timer(
    (o) =>
    {
        Console.WriteLine("Timer !");
    }, null, 1000, 200);
```

Timer() 的构造方法第一个参数为定时执行的回调函数，第二个参数为传递给回调的参数，第三个参数为 duetime ，即在开始计时前等待多长时间，第四个参数为 period ，即定时器周期。

也可以采用如下代码开始一个定时器：
```csharp
System.Threading.Timer timer = new Timer(
    (o) =>
    {
        Console.WriteLine("Timer !");
    });
timer.Change(1000, 200);
```

上面的定时器在构造时并没有开始运行，在调用 Change() 方法后才开始运行。

System.Threading.Timer 在运行过程中随时可以调用 Change() 方法改变定时器的周期。

### System.Timers.Timer

System.Timers.Timer 是比 System.Threading.Timer 更加灵活的一种定时器。

下面的代码展示了如何使用 System.Timers.Timer

```csharp
System.Timers.Timer timer = new System.Timers.Timer();
timer.Elapsed += (o, e) =>
{
    Console.WriteLine("Timer !");
};
timer.Interval = 300;
timer.Enabled = true;
```

timer.Elapsed 是一个 event ，每个周期都会被调用。

注意： System.Timers.Timer 比 System.Threading.Timer 更加灵活的地方就在于 Elapsed ，你可以在不重新 new 定时器的情况下改变定时器的回调函数。

```csharp
public static void CallBack(Object o, System.Timers.ElapsedEventArgs e)
{
    Console.WriteLine("Timer !");
}

System.Timers.Timer timer = new System.Timers.Timer();
timer.Elapsed += CallBack;
timer.Interval = 300;
timer.Enabled = true;
Thread.Sleep(1200);
timer.Elapsed -= CallBack; // 这里把 CallBack 函数剥离 Elapsed
```

System.Timers.Timer 的一些属性：

```csharp
bool Enabled; // 定时器是否正在运行
bool AutoReset; // 定时器是否周期执行，若为false，则表明定时器只执行一次。
int Interval; // 定时器执行的周期
```

---

## 八、C# 线程池

线程池的作用是避免重复创建和销毁线程。

程序里常常会创建大量线程，但这些线程只使用了一小段时间就被挂起或进入休眠，一直等到程序结束都不会再使用。

C# 提供了线程池用于线程复用，当一个异步方法想要调用线程来运行，可以先到线程池里看看有没有空闲线程

如果有空闲线程则调用空闲线程完成任务。

```csharp
ThreadPool.QueueUserWorkItem(
    (o) =>
    {
        for (int i = 0; i < 5; i++)
        {
            Thread.Sleep(300);
            Console.WriteLine("Thread Pool !");
        }
    }
);
```

调用线程池非常简单，只要像上面这段代码一样把一个 Callback 塞进线程就行。

线程池在创建之初会有一个最小线程数，这与计算机的 CPU 核心数有关，可以用 ThreadPool.GetMinThreads() 方法获取。

```csharp
ThreadPool.GetMinThreads(out int workerThreads, out int IOThreads);
Console.WriteLine(workerThreads + "  " + IOThreads);
```

需要注意的是，Task 和 Timer 也是默认调用线程池里的线程来完成工作的。

如果线程池中的线程被用完了怎么办呢？这个时候系统会停顿 1 秒钟，观察线程池中其他线程是否执行完毕，如果有线程执行完毕的话则调用这个线程，如果没有的话则对线程池进行扩容，增加一个线程。

```csharp
for (int i = 0; i < 12; i++)
{
    int tmp = i;
    Task.Run(() =>
    {
        Console.WriteLine("Thread " + tmp);
        Console.ReadKey();
    });
}
```

上面这段代码展示了线程池是如何进行扩容的。

我们可以用 SetMinThreads() 方法设置线程池的最小线程数

```csharp
ThreadPool.SetMinThreads(16, 16);
```

设置了最小线程数后再执行上面的代码则不会出现新的任务要等待 1 秒的情况

我们也可以用 SetMaxThreads() 方法设置线程池的最小线程数

```csharp
ThreadPool.SetMaxThreads(8, 8);
```

像这样设置了线程池的最大线程数后，上面的代码中 Thread 8 ~ 11 则永远不会被执行，因为 Thread 8 ~ 11 要等到线程池有空闲时才能执行。

线程池的其他方法：
```csharp
ThreadPool.GetAvailableThreads(out int workerThreads, out int completionPortThreads); // 获取线程池中的空闲线程。
ThreadPool.ThreadCount; // 获取线程池中的线程数目
```
