using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MovementScript : MonoBehaviour
{
    Queue<Vector3> recentReadings = new Queue<Vector3>();
    int maxReadings = 7; // You can adjust this number to increase or decrease smoothing
    BeeScript bee;
    private void Start()
    {
        bee = GetComponent<BeeScript>();
    }

    public void MoveBee(string json)
    {
        if (bee.isAlive)
        {


            Vector3 data = JsonUtility.FromJson<Vector3>(json);

            // Add the new reading to the queue
            if (recentReadings.Count >= maxReadings)
            {
                recentReadings.Dequeue(); // Remove the oldest reading
            }
            recentReadings.Enqueue(data);

            // Calculate the average of the readings in the queue
            Vector3 average = new Vector3(0, 0, 0);
            foreach (Vector3 reading in recentReadings)
            {
                average += reading;
            }
            average /= recentReadings.Count;

            // Use the averaged data for smoother movement
            transform.position = new Vector3(average.x * 0.07f, average.y * 0.07f, average.z * 0.01f);
        }
    }


}
