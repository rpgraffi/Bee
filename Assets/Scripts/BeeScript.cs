using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BeeScript : MonoBehaviour
{
    public LogicScript logic;
    public bool isAlive = true;
    private Rigidbody rb;

    private void Start()
    {
        logic = GameObject.FindGameObjectWithTag("Logic").GetComponent<LogicScript>();
        rb = GetComponent<Rigidbody>();
    }

    private void OnCollisionEnter(Collision other)
    {
        logic.gameOver();
        isAlive = false;
        rb.useGravity = true;

    }
}
