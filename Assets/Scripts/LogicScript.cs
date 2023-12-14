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
}
