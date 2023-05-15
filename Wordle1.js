const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES; // number of guesses remaining
let rightGuessString = "";
let words = [];
const letterBank = document.getElementById('letterBank');
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


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
    generateLetterBank();
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

// create letter icons
function generateLetterBank() {
    // Clear existing content
    letterBank.innerHTML = '';
  
    // Generate letter icons
    letters.forEach((letter) => {
      const letterButton = document.createElement('ul');
      letterButton.className = 'btn btn-sm';
      letterButton.id = letter;
      letterButton.textContent = letter;
      letterBank.appendChild(letterButton);
    });
  }

// validate only letters
function validChars(){
    let input = document.getElementById('text-box').value;
    let regex = new RegExp("[a-zA-Z]");
    return regex.test(input);
}

// check if word in word bank
function validWord(){
    let input = document.getElementById('text-box').value;
    // check if input is contained in the word list
    if (words.includes(input)) return true;
    else return false;
}

function handle_endmodal(){
    // toggle the modal
    $('#endModal').modal('show');

    // display the correct word
    document.getElementById("correct-answer").textContent = 
    "The correct word was " + rightGuessString + ".";
}

// assign color of box by comparing input letter and correct letter
function assign_color(letter, correct_letter){
    let letterColor = '' // color of box
    // change box color accordingly
    if (letter === correct_letter) {
        letterColor = 'lightgreen';
    }
    else if (letter !== correct_letter && rightGuessString.includes(letter)) {
        letterColor = 'yellow';
    }
    else {
        letterColor = 'lightgrey';
    }
    return letterColor;
}

function checkGuess(word){
    console.log(word);
    let input_arr = Array.from(word);

    // identify which row to fill in
    console.log(guessesRemaining);
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    
    // fill in the boxes 
    for(let i = 0; i < input_arr.length; i++){
        let box = row.children[i] // box to shade
        let letter = word[i] // letter to add to box
        let letterColor = '' // color of box
        const letterBank = document.getElementById('letterBank');

        // set row[box[i]] to input_arr[i]
        box.textContent = letter.toUpperCase();

        // display the box's content
        box.classList.add('filled-box');

        // change box color accordingly
        letterColor = assign_color(letter, rightGuessString[i]);

        // set delay for each box
        let delay = 250 * i;
        setTimeout(()=> {
            //shade box
            box.style.backgroundColor = letterColor;

            // Find the corresponding letter in the letter bank
            const letterElement = letterBank.querySelector('#' + letter.toUpperCase());
            
            // If the letter is found, add the "crossed-out" class
            if (letterElement) {
                letterElement.classList.add('crossed-out');
            }
        }, delay)

        document.getElementById('text-box').value = "";
    }
    if (word === rightGuessString) {
        //alert("You guessed right! Game over!")
        guessesRemaining = 0;
        // modal popup
        handle_endmodal();
    }
    else guessesRemaining--;
}


document.getElementById("endModal").style.display = "none";
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', function(){
    if (guessesRemaining === 0) {
        handle_endmodal();
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
    }
    else {
        alert("Please enter a word with exactly 5 letters!");
        return
    }
});