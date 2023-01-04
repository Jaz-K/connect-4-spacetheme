const columns = document.querySelectorAll(".column");
const slotsCheck = document.querySelectorAll(".slot");
const victoryBox = document.querySelector(".victory");
const board = document.querySelector("#board");
const winner = document.querySelector("h2");
const ambientMusic = new Audio("assets/space-chillout-14194.mp3");
const soundButton = document.querySelector(".music");
const goButton = document.querySelector("#go");
const reloadGame = document.querySelector("#relaodGame");
const nameBoard = document.querySelector(".nameBoard");
let nameSlot1 = document.querySelector(".name1");
let nameSlot2 = document.querySelector(".name2");

//creating object thats stores playernames and classname for the css
let player1 = { className: "player1" };
let player2 = { className: "player2" };

// initialize the game after click go

goButton.addEventListener("click", startGame);
function startGame() {
    const input = document.querySelector(".inputPlayerName");
    player1.name = document.querySelector("#player1Name").value;
    player2.name = document.querySelector("#player2Name").value;

    console.log(player1, player2);
    // set players names
    nameSlot1.textContent = `${player1.name}`;
    nameSlot2.textContent = `${player2.name}`;
    nameBoard.classList.add("active");
    //starts ambient music
    ambientMusic.play().loop = true;
    //starts animation board
    board.classList.add("active");
    //hide input field
    input.style.display = "none";
}

// initial player object
let currentPlayer = player1;
let gameover = false;

columns.forEach((column) =>
    column.addEventListener("click", handleColumnClick)
);

function handleColumnClick(event) {
    // sound for click on board
    const clickSound = new Audio("assets/mixkit-fast-sci-fi-bleep-903.wav");

    const column = event.currentTarget;
    const slotsInColumn = column.children;
    // console.log('slotsInColumn: ', slotsInColumn);

    // stop adding more slots after victory
    if (gameover) {
        return;
    }
    //makes sound click on board
    clickSound.play();

    let i;
    //checks the columns from bottom to top if any player has played (check if class is added)
    for (i = slotsInColumn.length - 1; i >= 0; i--) {
        // console.log("slotsInColumn[i]: ", slotsInColumn[i]);
        const slot = slotsInColumn[i];
        const hasPlayer1 = slot.classList.contains(player1.className);
        const hasPlayer2 = slot.classList.contains(player2.className);
        // console.log(hasPlayer1, "has player 1");

        if (!hasPlayer1 && !hasPlayer2) {
            //if slot is free add currentplayer in bottom slot
            slot.classList.add(currentPlayer.className);
            break;
        }
    }

    if (i < 0) {
        return;
    }

    // check if player has a victory...

    const slotsInRow = document.querySelectorAll(".row" + i);
    const winningSound = new Audio(
        "assets/mixkit-sci-fi-positive-item-grab-3173.wav"
    );
    // console.log("slotsInRow: ", slotsInRow);

    // DRY deleted redundant if else statements replaced by OR || all get the same victory info
    if (
        checkForVictory(slotsInColumn) ||
        checkForVictory(slotsInRow) ||
        checkForDiagonalVictory()
    ) {
        // adding victory info inkl relaod button playername and victory sounds
        victoryBox.classList.add("active");
        winner.textContent = `${currentPlayer.name}`;
        winningSound.play();

        // set game to stopp
        gameover = true;
    }

    // change the players turn
    switchPlayer();
}
// possible combinations for diagonals
const diags = [
    [18, 25, 32, 39],
    [12, 19, 26, 33, 40],
    [6, 13, 20, 27, 34, 41],
    [0, 7, 14, 21, 28, 35],
    [1, 8, 15, 22, 29],
    [2, 9, 16, 23],
    [18, 13, 8, 3],
    [24, 19, 14, 9, 4],
    [30, 25, 20, 15, 10, 5],
    [36, 31, 26, 21, 16, 11],
    [37, 32, 27, 22, 17],
    [38, 33, 28, 23],
];
//loop over diags and sub arrays, checking index with slots and push the nodes in slots to check
function checkForDiagonalVictory() {
    const slotsToCheck = [];
    diags.forEach((diag) =>
        diag.forEach((num) => {
            // console.log(num, "num");
            // console.log(slotsCheck, "slotsCheck");
            slotsCheck.forEach((node, index) => {
                // console.log("node", node, "index", index);
                // console.log(num, "num");
                if (num === index) {
                    slotsToCheck.push(node);
                }
            });
        })
    );

    //store function call with param and if its a victory return true
    const diagonalVictory = checkForVictory(slotsToCheck);
    // console.log("diagonalVictory", diagonalVictory);
    if (diagonalVictory) {
        return (gameover = true);
    }
}

function checkForVictory(slots) {
    let count = 0;
    for (let i = 0; i < slots.length; i++) {
        if (slots[i].classList.contains(currentPlayer.className)) {
            console.log(slots[i], "slots i");
            count++;
            if (count >= 4) {
                return true;
            }
        } else {
            count = 0;
        }
    }
    // if we don't return then the function returns undefined
}

//switch players and switch active player style
function switchPlayer() {
    // console.log("switching player");
    if (currentPlayer === player1) {
        currentPlayer = player2;
        nameSlot2.classList.add("activePlayer");
        nameSlot1.classList.remove("activePlayer");
    } else {
        currentPlayer = player1;
        nameSlot2.classList.remove("activePlayer");
        nameSlot1.classList.add("activePlayer");
    }
}

// mute button function and add/switch icon
soundButton.addEventListener("click", music);

function music() {
    const volIcon = document.querySelector(".volumen");
    console.log("it clicks");
    if (ambientMusic.muted == false) {
        volIcon.src = "assets/volume-xmark-solid_2.svg";
        ambientMusic.muted = true;
    } else {
        ambientMusic.muted = false;
        volIcon.src = "assets/volume-low-solid_2.svg";
    }
}

// click new Game hide board victory box and added timeout for relaod
reloadGame.addEventListener("click", reverse);

function reverse() {
    // remove nameboard playboard victorybox
    nameBoard.classList.remove("active");
    board.classList.remove("active");
    victoryBox.classList.remove("active");

    setTimeout(() => document.location.reload(), 3000);
}

//43
// console.log('columns: ', columns);
// const startGame = document.querySelector("go");

// 63
// console.log('i after loop: ', i);
// check if column is full....
// check if first element has either class player 1 or class player 2
// check if i is less than zero... if it is.. the col is full

// 83
// console.log("i: ", i);

// 90
/*     if (checkForVictory(slotsInColumn)) {
        // check vertically
        console.log(checkForVictory(slotsInColumn));
        console.log("column victory");
        // console.log("do the victory dance!");

        // adding victory info
        // adding reload button
        victoryBox.style.visibility = "visible";
        winner.textContent = `${currentPlayer}`;
        victoryBox.textContent.console.log(`${currentPlayer} won the game`);
        gameover = true;
    } else if (checkForVictory(slotsInRow)) {
        console.log("row victory");
        victoryBox.style.visibility = "visible";
        winner.textContent = `${currentPlayer}`;
        victoryBox.textContent.console.log(`${currentPlayer} won the game`);
        gameover = true;
        // console.log("do the victory dance!");
    } else if (checkForDiagonalVictory()) {
        console.log("diagonal victory");
        console.log("do the victory dance!");
        victoryBox.style.visibility = "visible";
        winner.textContent = `${currentPlayer}`;
        victoryBox.textContent.console.log(`${currentPlayer} won the game`);
        gameover = true;
        // check diagionally
    } */

// 124
// loop over diags
// for each array in diags
// first create an empty array i.e. const slotsToCheck = []
// we want to loop over the array of numbers
// and push a slot from the slots variable into slotsToCheck
// once the "internal loop" has finished then pass the array of
// slots to the checkForVictory function
// if checkForVictory returns true... then return true from this function

// 145
// console.log("slotsToCheck", slotsToCheck);

// 147
// console.log(checkForDiagonalVictory(), "check for diagonalVictory");

// 149
// console.log("checking for victory");
// console.log("slots: ", slots);

/* 
        
onclick="document.location.reload()"

        winningSlots.push(slots[i]);
        winningSlots.pop();

                   winningSlots.forEach(() =>{
                    slots[i].classList.add("winningSlots")
                    console.log('slots i in for each loop,' slots[i])}
                ); 

                    console.log(winningSlots, "winnig slots");

*/
