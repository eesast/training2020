using System;

class Monitor1
{
    public class ReadEventArgs : EventArgs
    {
        public readonly string str = "";
        public ReadEventArgs(string str)
        { this.str = str; }
    }
    public event Action<Monitor1, ReadEventArgs> Read;
    public void Run()
    {
        while (true)
        {
            string str = Console.ReadLine();
            Console.WriteLine("Monitor read a string : " + str);
            Read?.Invoke(this, new ReadEventArgs(str));
        }
    }
}


class EventReciever
{
    public void DetectRead(Monitor1 m, Monitor1.ReadEventArgs e)
    {
        Console.WriteLine("Recieve a string from monitor : " + e.str);
    }
}

public static class Event2
{
    public static void Run()
    {
        Monitor1 m = new Monitor1();
        EventReciever er = new EventReciever();
        m.Read += er.DetectRead; // 绑定到事件上
        m.Run();
    }
}