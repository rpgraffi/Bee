using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BeeMovementMouse : MonoBehaviour
{

    public bool useMouse = false;
    BeeScript bee;
    private void Start()
    {
        bee = GetComponent<BeeScript>();
    }
    public void MoveBee()
    {
        if (useMouse && bee.isAlive)
        {


            // Get the mouse position in screen coordinates
            Vector3 mousePosition = Input.mousePosition;

            // Convert the screen position to world position
            Vector3 worldPosition = Camera.main.ScreenToWorldPoint(new Vector3(mousePosition.x, mousePosition.y, Camera.main.nearClipPlane));


            // Optionally, you can scale the movement or limit it to certain axes

            worldPosition.x -= Camera.main.transform.position.x;
            worldPosition.y -= Camera.main.transform.position.y;
            worldPosition.x *= 20f;
            worldPosition.y *= 20f;
            // Keeping the Z position constant or based on a predefined value
            worldPosition.z = 0;

            // Update the bee's position
            transform.position = new Vector3(worldPosition.x, worldPosition.y, worldPosition.z);
        }
    }

    void Update()
    {
        if (useMouse)
        {
            // Call MoveBee() in the Update method to continuously update the bee's position
            MoveBee();
        }
    }

}


