using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Manager : MonoBehaviour
{
    public Text scoreText;
    public Text timeText;

    public GameObject food;
    public float interval;
    private float time;
    private float score;
    private float spawnTime;
    // Start is called before the first frame update
    void Start()
    {
        spawnTime = 0;
        time = 0;
        score = 0;
    }

    // Update is called once per frame
    void Update()
    {
        if (spawnTime > interval)
        {
            var f = Instantiate(food, new Vector3(Random.Range(-5f, 5f), 0.2f, Random.Range(-5f, 5f)), Random.rotation);
            f.GetComponent<Food>().manager = this;
            spawnTime = 0;
        }
        else
        {
            spawnTime += Time.deltaTime;
        }
        time += Time.deltaTime;
        scoreText.text = "Score: " + score.ToString();
        timeText.text = "Time: " + time.ToString();
    }

    public void AddScore()
    {
        score++;
    }
}
