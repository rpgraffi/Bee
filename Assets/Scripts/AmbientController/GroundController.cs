using UnityEngine;

public class ScrollGround : MonoBehaviour
{
    public float scrollSpeed = 60f;


    void Update()
    {
        ScrollGroundTexture();
    }

    void ScrollGroundTexture()
    {
        float offset = Time.time * scrollSpeed/100;
        GetComponent<Renderer>().material.SetTextureOffset("_MainTex", new Vector2(-offset, 0));
    }
}
