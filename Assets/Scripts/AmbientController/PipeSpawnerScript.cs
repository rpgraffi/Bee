using System.Collections;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using UnityEngine;

public class PipeSpawnerScript : MonoBehaviour
{
    public GameObject pipe;
    public float spawnrate = 1;
    public float pipeOffset = 3;
    private float timer = 0;
    void Start()
    {
            spawnPipe();

    }

    // Update is called once per frame
    void Update()
    {
        if (timer < spawnrate)
        {
            timer += Time.deltaTime;
        }
        else
        {
            spawnPipe();
            timer = 0;
        }

    }
        void spawnPipe () {
            float highestPoint = transform.position.y + pipeOffset;
            float lowestPoint = transform.position.y - pipeOffset;
            Instantiate(pipe, new Vector3(transform.position.x, Random.Range(lowestPoint, highestPoint), transform.position.z), transform.rotation);
        }
}
