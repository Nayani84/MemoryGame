const gameContainer = document.getElementById("gameBoard");
const displayScore = document.getElementById("errors");
const bestScore = document.getElementById("bestScore");
const btnNewGame = document.getElementById("btnNew");
const btnRestartGame = document.getElementById("btnRestart");
const txtNumberOfCards = document.getElementById("txtnumberofcards");

let firstCard = null;
let secondCard = null;
let scoreCount = 0;
let winCount = 0;
let numberOfCards = 0;
let isGameOver = false;


window.onload = showBestScore;

btnNewGame.addEventListener("click", function () {
    clearGame();
    runGame();
    this.classList.add("hide");
    btnRestartGame.classList.remove("hide");
});

btnRestartGame.addEventListener("click", function () {
    if (isGameOver) {
        clearGame();
        runGame();
    }
    else {
        if (confirm("Are you sure, Do you want to restart the Game ?")) {
            isGameOver = true;
            clearGame();
            runGame();
        }
    }
});

// this function loops over the array of colors.
// it creates a new div and gives it a class with the value of the color.
// it also adds an event listener for a click for each card.
//let shuffledColors = shuffle(COLORS);
function createDivsForColors(colorArray) {
    let cardId = 0;

    setRowsColumns();

    for (let color of colorArray) {
        // create a new div
        const newDiv = document.createElement("div");
        cardId++;
        // give it a class attribute for the value we are looping over.
        newDiv.classList.add('card');
        newDiv.id = cardId;
        newDiv.style.backgroundColor = color;
        // call a function handleCardClick when a div is clicked on.
        newDiv.addEventListener("click", handleCardClick);
        // append the div to the element with an id of game.
        gameContainer.append(newDiv);
    }
}

// Function for shuffle colors.
function shuffle(array) {
    let counter = array.length;

    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

// TODO: Implement this function!
function handleCardClick(event) {
    if (winCount != numberOfCards) {
        scoreCount++;
        displayScore.innerText = scoreCount.toString();
    }
    else {
        alert("YOU WON, Game Over!!! Please restart the game.");
        return;
    }
    // you can use event.target to see which element was clicked
    if (firstCard != null && (firstCard === this)) {
        alert("You have selected the same card!!!");
        return;
    }
    if (this.classList.contains("matchCard")) {
        alert("this is a matched color!!!");
        return;
    }
    if (firstCard == null) {
        firstCard = this;
        this.classList.add('openCard');
    }
    else if (secondCard == null) {
        secondCard = this;
        this.classList.add('openCard');
    }
    else {
        return;
    }

    if (firstCard != null && secondCard != null) {
        if (firstCard.style.backgroundColor != secondCard.style.backgroundColor) {
            document.getElementById(firstCard.id).classList.add("shake");
            document.getElementById(secondCard.id).classList.add("shake");

            // Set Timeout.
            setTimeout(() => {
                document.getElementById(firstCard.id).classList.remove("shake");
                document.getElementById(secondCard.id).classList.remove("shake");
                document.getElementById(firstCard.id).classList.remove("openCard");
                document.getElementById(secondCard.id).classList.remove("openCard");
                firstCard = null;
                secondCard = null;
            }, 1000)
        }
        else {
            document.getElementById(firstCard.id).classList.add("matchCard");
            document.getElementById(secondCard.id).classList.add("matchCard");
            firstCard = null;
            secondCard = null;
            winCount += 2;
        }
    }

    // console.log("you just clicked", event.target.id);
    // console.log(`win count = ${winCount} , number of cards = ${numberOfCards}`);
    // Set Timeout.
    if (winCount == numberOfCards) {
        setTimeout(() => {
            alert("YOU WON !!!, Please restart the game.");
            isGameOver = true;
            saveScoreData();
        }, 500);

    }
}

// Function for create a random color array using rgb colors.
function createRandomColorArray() {
    let arrColors = [];
    let numColors = numberOfCards / 2;
    for (let x = 0; x < numColors; x++) {
        const r = Math.round((Math.random() * 255 + 1));
        const g = Math.round((Math.random() * 255 + 1));
        const b = Math.round((Math.random() * 255 + 1));
        const color = `rgb(${r} , ${g} , ${b})`;
        // console.log(`rgb(${r} , ${g} , ${b})`);
        arrColors.push(color);
    }
    return [...arrColors, ...arrColors];
}

// Funcation for Set Rows & Columns according to the Number of Cards.
function setRowsColumns() {
    //set card height
    gameContainer.className = '';
    if (numberOfCards < 10) {
        gameContainer.classList.add('gameBoardCols10');
    }
    else if (numberOfCards <= 30) {
        gameContainer.classList.add('gameBoardCols30');
    }
    else if (numberOfCards <= 80) {
        gameContainer.classList.add('gameBoardCols80');
    }
    else {
        gameContainer.classList.add('gameBoardCols81');
    }
}

// Function for Save Best Score in the localStorage.
function saveScoreData() {
    let _bestScore = JSON.parse(localStorage.getItem("memoryGame-bestScore"));
    if (_bestScore == null || (scoreCount < _bestScore)) {
        localStorage.setItem("memoryGame-bestScore", JSON.stringify(scoreCount));
    }
    showBestScore();
}

// Function for Show Best Score in local Storage.
function showBestScore() {
    let _bestScore = JSON.parse(localStorage.getItem("memoryGame-bestScore"));
    if (_bestScore != null) {
        bestScore.classList.remove('hide');
        bestScore.innerText = ` Best score : ${_bestScore.toString()}`;
    }
}

// Function for Clear Game Board.
function clearGame() {
    winCount = 0;
    scoreCount = 0;
    displayScore.innerText = scoreCount.toString();
    gameContainer.innerHTML = "";
}

// Function for run Game.
function runGame() {
    numberOfCards = txtNumberOfCards.value;
    if (numberOfCards > 1) {
        isGameOver = false;
        // if # of cards odd then get the next even.
        if (numberOfCards % 2 == 1) {
            numberOfCards++;
        }
        let colrArr = createRandomColorArray();
        createDivsForColors(shuffle(colrArr));
    }
    else {
        alert("Please enter number of cards between 2-150 to start the game!!!");
        numberOfCards = 0;
    }
    txtNumberOfCards.value = "";
}


