using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PipeMiddleScript : MonoBehaviour
{
    public LogicScript logic;
    void Start()
    {
        logic = GameObject.FindGameObjectWithTag("Logic").GetComponent<LogicScript>();
        Debug.Log(logic);
    }

    // Update is called once per frame
    void Update()
    {
        
    }
    private void OnTriggerEnter(Collider collision) {
        if (collision.gameObject.layer == 3)
        {
        Debug.Log("Collission");
        logic.addScore(1);
            
        }
    }

    
}
