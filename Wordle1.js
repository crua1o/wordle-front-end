
const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES; // number of guesses remaining
let rightGuessString = "";
let words = [];

fetch('wordle-words.txt')
  .then(response => response.text())
  .then(text => {
    // randomly select a word from the list
    words = text.split("\n");
    rightGuessString = words[Math.floor(Math.random() * words.length)];
    console.log(rightGuessString);
  });


window.onload = function(){
    initBoard();
}


function initBoard(){
    // Get a reference to the div element
    let board = document.getElementById('game-board');
    
    for(let i = 0; i < NUMBER_OF_GUESSES; i++){
        let row = document.createElement('div'); // creates 6 rows
        row.className = 'letter-row';

        for(let j = 0; j < 5; j++){
            // creates 5 divs in each row
            let box = document.createElement('div'); 
            box.className = 'letter-box';
            row.appendChild(box);
        }

        board.appendChild(row);
    }
}

function validChars(){
    let input = document.getElementById('text-box').value;
    let regex = new RegExp("[a-zA-Z]");
    return regex.test(input);
}

function validWord(){
    let input = document.getElementById('text-box').value;
    // check if input is contained in the word list
    if (words.includes(input)) return true;
    else return false;
}

function checkGuess(word){
    console.log(word);
    let input_arr = Array.from(word);

    // identify which row to fill in
    console.log(guessesRemaining);
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    

    for(let i = 0; i < input_arr.length; i++){
        let box = row.children[i] // box to shade
        let letter = word[i] // letter to add to box
        let letterColor = '' // color of box
        console.log(input_arr[i]);

        // set row[box[i]] to input_arr[i]
        box.textContent = letter.toUpperCase();

        // display the box's content
        box.classList.add('filled-box');

        // change box color accordingly
        if (letter === rightGuessString[i]) {
            letterColor = 'lightgreen';
        }

        else if (letter !== rightGuessString[i] && rightGuessString.includes(letter)) {
            letterColor = 'yellow';
        }

        else {
            letterColor = 'lightgrey';
        }
        // set delay for each box
        let delay = 250 * i;
        setTimeout(()=> {
            //shade box
            box.style.backgroundColor = letterColor;
        }, delay)

        document.getElementById('text-box').value = "";

    }
    if (word === rightGuessString) {
        //alert("You guessed right! Game over!")
        guessesRemaining = 0;
    }
    else guessesRemaining--;
}

function clearBoard(){
    let row = document.getElementsByClassName("letter-row")[0]
    // for each row:
    for (let i = 0; i < 6; i++) {
        // for each box:
        for (let j = 0; j < 5; j++) {
            row.children[j].textContent = "";
            // remove box color
            row.children[j].style.backgroundColor = "white";
        }
        row = row.nextElementSibling;
    }
}


document.getElementById("endModal").style.display = "none";
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', function(){
    if (guessesRemaining === 0) {
        // toggle the modal
        document.getElementById("endModal").style.display = "flex";
        document.getElementById("correct-answer").textContent = 
        "The correct word was " + rightGuessString + ".";
        
        // need to clear the board and generate another word

        return;
      }

    let input = document.getElementById('text-box').value;
    if(document.getElementById("text-box").value.length == 5) {
        if (!validChars()) {
            alert("Please enter a word with only letters.");
            return
        }
        if (!validWord()) {
            alert("Invalid word! Please enter a valid word.");
            return
        }

        checkGuess(input);
        /*if (input === rightGuessString) {
            alert("You guessed right! Game over!")
            guessesRemaining = 0;
        } */
    }
    else {
        alert("Please enter a word with exactly 5 letters!");
        return
    }
});

//document.getElementById("playAgain").addEventListener("click", clearBoard());

// clear word from text box after submitting

// show correct word on board before getting the notification

// if a word has a double letter, then only the first letter is shaded

// add letter bank (used/unused letters)