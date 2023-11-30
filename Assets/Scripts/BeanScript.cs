using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MoveScript : MonoBehaviour
{
    public void MoveBean(string json)
    {
        Vector3 data = JsonUtility.FromJson<Vector3>(json);
        transform.position = new Vector3(data.x * 0.1f, data.y * 0.1f, data.z * 0.01f);
    }

    public void MoveBeanY(float y)
    {
        // GetComponent<MeshRenderer>().material.color = Color.red;
        transform.position = new Vector3(0, y * 0.1f, 0);
    }
    public void MoveBeanZ(float z)
    {
        // GetComponent<MeshRenderer>().material.color = Color.red;
        transform.position = new Vector3(0, 0, z * 0.1f);
    }
}
