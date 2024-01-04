using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using UnityEngine.SceneManagement;

public class LogicScript : MonoBehaviour
{
    public int playerScore;
    public TMP_Text scoreText;
    public GameObject gameOverScreen;
    public GameObject beeObject;
    BeeScript bee;
    private void Start()
    {
        bee = beeObject.GetComponent<BeeScript>();
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            if (Time.timeScale == 1)
                PauseGame();
            else
                ResumeGame();
        }
    }

    [ContextMenu("Increase Score")]
    public void addScore(int scoreToAdd)
    {
        if (bee.isAlive)
        {
            playerScore += scoreToAdd;
            scoreText.text = playerScore.ToString();
            Application.ExternalCall("incrementCounterInWebApp");
        }
    }

    public void restartGame()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }
    public void gameOver()
    {
        gameOverScreen.SetActive(true);
        Application.ExternalCall("showEndScreenInWebApp");
    }

    [ContextMenu("Pause Game")]
    private void PauseGame()
    {
        //pauseScreen.SetActive(true);
        //beeObject.transform.position = new Vector3(beeObject.transform.position.x, beeObject.transform.position.y, -5);
        StartCoroutine(ChangeTimeScale(0, 0.2f));

    }

    [ContextMenu("Resume Game")]
    private void ResumeGame()
    {
        //pauseScreen.SetActive(false);
        //beeObject.transform.position = new Vector3(beeObject.transform.position.x, beeObject.transform.position.y, 0);
        StartCoroutine(ChangeTimeScale(1, 1.5f));

    }

    IEnumerator ChangeTimeScale(float targetScale, float duration)
    {
        float startScale = Time.timeScale;
        float time = 0f;

        while (time < duration)
        {
            time += Time.unscaledDeltaTime; // Use unscaledDeltaTime so the coroutine isn't affected by Time.timeScale
            Time.timeScale = Mathf.Lerp(startScale, targetScale, time / duration);
            yield return null;
        }

        Time.timeScale = targetScale; // Ensure the target scale is set exactly at the end
    }

}
