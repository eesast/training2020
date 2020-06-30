using System;

namespace CSharpLearning
{
    delegate int NumChanger(int num);

    enum Numbers
    {
        One,
        Three = 3,
        Four
    }

    interface IPerson
    {
        string Name { get; set; }
        void Show(string name);
    }

    interface IStudent
    {
        string Id { get; set; }
        void Show(string id);
    }

    public class Student : IStudent, IPerson //多继承
    {
        public string Name { get; set; }
        public string Id { get; set; }

        public void Show(string name) //分别实现不同接口的同名方法
        {
            Console.WriteLine("姓名为{0}", name);
        }
    }

    abstract class Animal
    {
        private int _age;

        public Animal(int age)
        {
            Age = age;
        }

        public int Age { get => _age; set => _age = value > 120 ? 120 : value; }
        public void Move()
        {
            Console.WriteLine("调用了Animal类的Move方法");
        }
        public virtual void Attack() // 虚方法必须给出实现
        {
            Console.WriteLine("调用了Animal类的Attack方法");
        }
        public abstract void Name(); // 抽象方法可以只声明，不实现

    }

    class Cat : Animal
    {
        public Cat(int age) : base(age) {}
        public override void Name() // 若不重载抽象方法则会报错
        {
            Console.WriteLine("调用了Cat类的Name方法");
        }

        public override void Attack() // 可以重载虚方法，也可不重载
        {
            Console.WriteLine("调用了Cat类的Attack方法");
        }

        public new void Move()
        {
            base.Move();
            Console.WriteLine("调用了Cat类的Move方法");
        }

    }
    class Program
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

        public static void ChangeAge(Cat cat)
        {
            cat.Age -= 10;
        }
        public static int GetInt(int[] array, int index)
        {
            try
            {
                return array[index];
            }
            catch (System.IndexOutOfRangeException ex) // CS0168
            {
                Console.WriteLine(ex.Message);
                // Set IndexOutOfRangeException to the new exception's InnerException.
                throw new ArgumentException("index parameter is out of range.", "index", ex);
            }
            catch (Exception)
            {
                Console.WriteLine("不会进入此catch块");
                return 0;
            }
        }

        static void Main()
        {
            /*字符串特性*/
            //string s1 = "Hello, World!";
            //string s2 = s1;
            //s2 = "See you!";
            //Console.WriteLine(s1);
            //Console.WriteLine(s2);

            /*枚举实例*/
            //Numbers num = Numbers.Three;
            //Console.WriteLine(num); // "Three"
            //int one = 1;
            //num = (Numbers)one; // Enum和int可以强制类型转换
            //Console.WriteLine(Convert.ToString(num)); // 使用Convert获取枚举字符串
            //string four = "Four";
            //num = (Numbers)Enum.Parse(typeof(Numbers), four); //由字符串转换为枚举
            //Console.WriteLine((int)num);

            /*类实例*/
            // Animal animal = new Animal(); 报错：无法创建抽象类Animal的实例
            //Cat cat = new Cat(80);
            //cat.Age = 130;
            //Console.WriteLine(cat.Age);
            //ChangeAge(cat);
            //Console.WriteLine(cat.Age);
            //cat.Name(); // 调用了Cat类的Name方法
            //cat.Move(); // 调用了Animal类的Move方法/n 调用了Cat类的Move方法
            //((Animal)cat).Move(); // 调用了Animal类的Move方法
            //((Animal)cat).Attack(); // 调用了Cat类的Attack方法：override后，即使强制类型转换，调用的也是Cat类的Attack方法

            /*接口实例*/
            Student s = new Student();
            Console.WriteLine("输入姓名");
            s.Name = Console.ReadLine();
            Console.WriteLine("输入学号");
            s.Id = Console.ReadLine();
            IPerson per = s;
            per.Show(s.Name);
            IStudent stu = s;
            stu.Show(s.Id);

            /*异常实例*/
            //try
            //{
            //    int[] a = { 1, 2, 3, 4, 5 };
            //    GetInt(a, 5);
            //}
            //catch (ArgumentException ex)
            //{
            //    Console.WriteLine(ex.Message);
            //}
            //catch (Exception)
            //{
            //    Console.WriteLine("发生未知错误!");
            //}
            //finally
            //{
            //    Console.WriteLine("Done!");
            //}

            /*委托实例*/
            //NumChanger fc1 = (int p) =>
            //{
            //    Num += p;
            //    return Num;
            //};
            //NumChanger fc2 = new NumChanger(MulNum);
            //NumChanger fc = fc2 + fc1;
            //Console.WriteLine(fc(5));

            Console.ReadKey();
        }
    }
}
