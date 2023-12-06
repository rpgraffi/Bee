using UnityEngine;

public class backgroundController : MonoBehaviour
{
    // Start is called before the first frame update
    public float rotationSpeed = 1.0f;

    void Update()
    {
        // Rotates the skybox around the Y axis
        RenderSettings.skybox.SetFloat("_Rotation", Time.time * rotationSpeed);
    }
}

