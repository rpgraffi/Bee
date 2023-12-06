using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class LogicScript : MonoBehaviour
{
    public int playerScore;
    public TMP_Text scoreText;

    [ContextMenu("Increase Score")]
    public void addScore() {
        playerScore ++;
        scoreText.text = playerScore.ToString();
    } 
}
