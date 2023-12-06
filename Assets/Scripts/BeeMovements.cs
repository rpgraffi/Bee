using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MovementScript : MonoBehaviour
{
    public void MoveBee(string json)
    {
        Vector3 data = JsonUtility.FromJson<Vector3>(json);
        //transform.position = new Vector3(data.x * 0.1f, data.y * 0.1f, data.z * 0.01f);
        transform.position = new Vector3(transform.position.x, (data.y * 0.1f)-1 , transform.position.z);
    }

    public void MoveBeeY(float y)
    {
        // GetComponent<MeshRenderer>().material.color = Color.red;
        transform.position = new Vector3(0, y * 0.1f, 0);
    }
    public void MoveBeeZ(float z)
    {
        // GetComponent<MeshRenderer>().material.color = Color.red;
        transform.position = new Vector3(0, 0, z * 0.1f);
    }
}
