
// Selectors
var header = document.querySelector(".header");
var rgb_data = document.querySelector("#rgb-data");
var table = document.querySelector("table");

// button selectors
var newColor = document.querySelector("#new");
var tryAgain = document.querySelector("#try-again");
var easy = document.querySelector("#easy");
var hard = document.querySelector("#hard");


// Application variables
var questionColor;
var easy_level = true;
var curQuestionColors;	//store current question for try again
var correctGuess = false;



function shuffleArray(arr) {
	var j, i, x;
	for(i=arr.length-1; i>0; i--) {
		// j is [0,(i+1))
		j = Math.floor(Math.random() * (i+1));
		x = arr[j];
		arr[j] = arr[i];
		arr[i] = x;
	}
	return arr;
}

var generateColor = function(){
	return `rgb(${randomNumber(256)}, ${randomNumber(256)}, ${randomNumber(256)})`;
}

var generateColors = function(num){
	var colorArr = [];
	for(let i=0;i<num;i++) {
		colorArr.push(generateColor());
	}
	return colorArr;
}

var randomNumber = function(max) {
	return Math.floor(Math.random() * max);
}

// rendering num of colors into html
// num is number of distracted options
var renderingOptions = function(arr){
	var str = `<tr>`;
	
	for(let i=0;i<arr.length;i++) {
		if(i%3==0 && i!=0){
			str += `</tr><tr>`;
			str += `<td class="color" id="color#${i}" style="background-color:${arr[i]}"></td>`;
		} else {
			str += `<td class="color" id="color#${i}" style="background-color:${arr[i]}"></td>`;
		}
	}

	str += `</tr>`;
	tryAgain.textContent = "Try Again";

	console.log(str);
	table.innerHTML = str;
}

// Assign eventListener to each option
var assignEventToOptions = function(){
	var colors = document.querySelectorAll("td");
	
	for(let i=0;i<colors.length;i++) {
		colors[i].addEventListener("click", function clickColor(){
			var curColor = this.style.backgroundColor;
			// Correct answer - skip
			if(correctGuess === true) {
				/*
					If the answer is correct, skip the eventlistener
					solve: unclick colors trigger refresh after answer correct.
				*/
				return;
			}

			if(curColor == questionColor) {
				// Correct guess
				// Turn header background and all option to correct color
				header.style.backgroundColor = questionColor;
				correctGuess = true;
				changeAllOptionsColor(questionColor);
				rgb_data.textContent = "You are right";
			} else {
				// Wrong guess
				colors[i].style.opacity = 1;

				var fadeEffect = setInterval(function(){
					if(colors[i].style.opacity >= 0 && correctGuess==false) {
						colors[i].style.opacity -= 0.1;
					} else {
						clearInterval(fadeEffect);
					}			
				}, 100);
			}

			// The eventListener will be removed once click
			colors[i].removeEventListener("click", clickColor);
		});
	}
}

var generateGame = function(){
	//Generate new color for guessing
	questionColor = generateColor();
	rgb_data.textContent = questionColor;
	
	// Generate options and answer and shuffle the order
	correctGuess = false;
	var colors;
	if(easy_level==true) {
		colors = generateColors(2);
	} else if(easy_level==false) {
		colors = generateColors(5);
	}
	colors.push(questionColor);
	colors = shuffleArray(colors);
	curQuestionColors = colors;
	renderingOptions(colors);

	assignEventToOptions();
}


// New colors button is clicked
newColor.addEventListener("click", function(){
	// Change the text color after selected
	this.classList.add("option-selected");
	header.style.backgroundColor = "rgb(60,132,203)";
	generateGame();
});

// Easy level selected
easy.addEventListener("click", function(){
	// Change the text color after selected
	easy.classList.add("option-selected");
	hard.classList.remove("option-selected");
	easy_level = true;
	generateGame();
});

// Hard level selected
hard.addEventListener("click", function(){
	// Change the text color after selected
	hard.classList.add("option-selected");
	easy.classList.remove("option-selected");
	easy_level = false;
	generateGame();
});

//Try again
tryAgain.addEventListener("click", function(){
	correctGuess = false;
	renderingOptions(shuffleArray(curQuestionColors));
	assignEventToOptions();
	header.style.backgroundColor = "rgb(60,132,203)";
	rgb_data.textContent = questionColor;
});

var changeAllOptionsColor = function(color){
	var colors = document.querySelectorAll("td");

	for(let i=0;i<colors.length;i++){
		colors[i].style.opacity = 0;
	}

	for(let i=0;i<colors.length;i++) {
		colors[i].style.backgroundColor = color;
		var timer = setInterval(function(){
			(function(){
				if(colors[i].style.opacity < 1){
					colors[i].style.opacity = +colors[i].style.opacity + 0.1;
				} else {
					clearInterval(timer);
				}
			})();
		}, 200);
	}
}