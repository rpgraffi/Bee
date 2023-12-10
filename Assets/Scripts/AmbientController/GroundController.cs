using UnityEngine;

public class ScrollGround : MonoBehaviour
{
    public float scrollSpeed = 5f;
    private float deadZone = -50f; // Adjust this value based on your needs

    void Update()
    {
        ScrollGroundTexture();
        CheckDestroyCondition();
    }

    void ScrollGroundTexture()
    {
        float offset = Time.time * scrollSpeed/100;
        GetComponent<Renderer>().material.SetTextureOffset("_MainTex", new Vector2(-offset, 0));
    }

    void CheckDestroyCondition()
    {
        if (transform.position.x < deadZone)
        {
            Destroy(gameObject);
        }
    }
}
