using System;
using System.Collections;

class Telephone
{
    public delegate void RangHandler();
    public event RangHandler Rang;

    public void Run()
    {
        Console.WriteLine("Telephone rang");
        Rang?.Invoke();
    }
}

class Pot
{
    public delegate void BoiledHandler();
    public event BoiledHandler Boiled;
    public void Run()
    {
        Console.WriteLine("Water is boiling");
        Boiled?.Invoke();
    }
}

class Person
{
    public readonly string Name;
    public Person(string name)
    {
        Name = name;
    }
    public void AnswerPhone()
    {
        Console.WriteLine(Name + " answer the phone");
    }
    public void TrunOffPot()
    {
        Console.WriteLine(Name + " turn off the pot");

    }
}

public static class Event
{
    public static void Run()
    {
        Person Ming = new Person("XiaoMing");
        Telephone t = new Telephone();
        Pot p = new Pot();

        t.Rang += Ming.AnswerPhone; // 把接电话绑定到电话响
        p.Boiled += Ming.TrunOffPot;

        t.Run();
        p.Run();
    }
}