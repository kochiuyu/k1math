// select all elements
const start = document.getElementById("start");
const quiz = document.getElementById("quiz");
const question = document.getElementById("question");
const logo = document.getElementById("logo");
const startauthor = document.getElementById("startauthor");

//const qImg = document.getElementById("qImg");
const choiceA = document.getElementById("A");
const choiceB = document.getElementById("B");
const choiceC = document.getElementById("C");
const choiceD = document.getElementById("D");
const counter = document.getElementById("counter");
const timeGauge = document.getElementById("timeGauge");
const progress = document.getElementById("progress");
const scoreDiv = document.getElementById("scoreContainer");
const starDiv = document.getElementById("starContainer");
const qlevel = document.getElementById("qlevel");
const levels = document.getElementById("levels");
const yessound = document.getElementById("yesaudio");
const nosound = document.getElementById("noaudio");
const levelreportDiv = document.getElementById("levelreport");	
const scorereportDiv = document.getElementById("scorereport");	
	
// loading the sound first
yessound.load();
nosound.load();	


// declare variables
const lastQuestion = 10-1; // ten question for each level
let runningQuestion = 0;  // current question
let count = 0; //counter for time
let maxLevel = 5;
const questionTime = 30; // 15s
const gaugeWidth = 250; // 150px
const gaugeUnit = gaugeWidth / questionTime;
let TIMER;
let score = 0;
let currentlevel=1; // default level is 1

// getting questions from outside files 
function setDifficulty(level){
	currentlevel = level;
	qlevel.innerHTML = "Level "+ currentlevel ;
	startQuiz(level)
}

// difficulty level
function generateQuestions(){
	//additionQ = additionQ.filter(item => item.level ==currentlevel);	
	//subtractionQ = subtractionQ.filter(item => item.level == currentlevel);	
	//multiplicationQ = multiplicationQ.filter(item => item.level ==currentlevel);	
	//divisionQ = divisionQ.filter(item => item.level ==currentlevel);	
	//questions.push(...additionQ,...subtractionQ,...multiplicationQ,...divisionQ)


	// filter questions using the same level
	// store the filter questions in "questions"
	questions = questionbank.filter(item => item.level == currentlevel);
	//just focus on addition
	questions = questions.filter(item => item.operation == "plus");
	// randomization over questions
	shuffleArray(questions);
	
}


// randomize questions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



// render a question
function renderQuestion(){
    let q = questions[runningQuestion];
    
    question.innerHTML = "<p>"+ q.question +"</p>";
    //qImg.innerHTML = "<img src="+ q.imgSrc +">";
    choiceA.innerHTML = "<p> A. " + q.choiceA +"</p>";
    choiceB.innerHTML = "<p> B. " + q.choiceB +"</p>";
    choiceC.innerHTML = "<p> C. " + q.choiceC +"</p>";
	choiceD.innerHTML = "<p> D. " + q.choiceD +"</p>";
}

// start quiz
function startQuiz(level){
    start.style.display = "none"; //remove the div start 
	levels.style.display = "none"; //remove the levels div (level selector)
	scoreDiv.style.display = "none";
	logo.style.display = "none";
	startauthor.style.display = "none";
	runningQuestion = 0;
	count = 0;
	score = 0;
	progress.innerHTML = "";
	
	generateQuestions(); 
    renderQuestion();  //display the first question
    quiz.style.display = "block";
    renderProgress();
    renderCounter();
    TIMER = setInterval(renderCounter,1000); // 1000ms = 1s
}

// exit to the main menu at the score div
function mainmenu(){
	scoreDiv.style.display = "none";
	quiz.style.display = "none";
	start.style.display = "block";
	levels.style.display = "block";
	logo.style.display = "block";
	startauthor.style.display = "block";
	runningQuestion = 0;
	count = 0;
	score = 0;
	progress.innerHTML = "";
}


// restart at the input level
/* function restart(level){
	scoreDiv.style.display = "none";
	runningQuestion = 0;
	count = 0;
	score = 0;
	progress.innerHTML = "";
	startQuiz(level);
} */

// restart with level up
function levelup(){
	if (currentlevel < maxLevel){
		currentlevel++;
	}
	qlevel.innerHTML = "Level "+ currentlevel ;
	//alert(currentlevel);
	startQuiz(currentlevel);
}



// render progress
// note that progress use div with id qIndex
function renderProgress(){
    for(let qIndex = 0; qIndex <= lastQuestion; qIndex++){
        progress.innerHTML += "<div class='prog' id="+ qIndex +"></div>";
    }
}

// counter render
function renderCounter(){
    if(count <= questionTime){
        // backward counting
		//counter.innerHTML = questionTime-count;
		timeGauge.style.width = (gaugeWidth-count * gaugeUnit) + "px";
		// forward counting
		//counter.innerHTML = count;
        //timeGauge.style.width = count * gaugeUnit + "px";
        count++
    }else{
        count = 0;
        // change progress color to red
        answerIsWrong();
        if(runningQuestion < lastQuestion){
            runningQuestion++;
            renderQuestion();
        }else{
            // end the quiz and show the score
            clearInterval(TIMER);
            scoreRender();
        }
    }
}



function checkAnswer(answer){
	// checkAnswer == correct question
	// based on the onclick in the html
    if( answer == questions[runningQuestion].correct){
        // answer is correct
		// score goes up by 1
        score++;
        // change progress color to green
        answerIsCorrect();
		// play yes sound
		yessound.play();
    }else{
        // answer is wrong
        // change progress color to red
        answerIsWrong();
		nosound.play();
    }
    count = 0;
    if(runningQuestion < lastQuestion){
        runningQuestion++;
        renderQuestion();
    }else{
        // end the quiz and show the score
        clearInterval(TIMER); //stop the timer
        scoreRender();  //render final score
    }
}

// if answer is correct, fill the green color
function answerIsCorrect(){
    document.getElementById(runningQuestion).style.backgroundColor = "#09db17";
    document.getElementById(runningQuestion).style.borderColor = "#09db17";
}

// answer is wrong, fill the red color
function answerIsWrong(){
    document.getElementById(runningQuestion).style.backgroundColor = "#f50c0c";
	document.getElementById(runningQuestion).style.borderColor = "#f50c0c";
}


// score final in the scoreDiv
// 
function scoreRender(){
    scoreDiv.style.display = "block";
    
    // calculate the amount of question percent answered by the user
    const scorePerCent = Math.round(100 * score/(lastQuestion+1));
    const yellowstar = Math.round(scorePerCent / 10);
	const graystar = 10 - yellowstar;
    // choose the image based on the scorePerCent
   
    // reporting level
	levelreportDiv.innerHTML =  "<p> Level "+ currentlevel + "</p>";
	
	// reporting score
	scorereportDiv.innerHTML =  "<p> Score: "+ scorePerCent + "</p>";
	
	// creating stars
	starDiv.innerHTML = "";
	//alert(yellowstar);
	//starDiv.innerHTML += "<img class='inline-block' src='img/GoldenStar.png'>";
	//starDiv.innerHTML += "<img class='inline-block' src='img/GoldenStar.png'>";
	for (let counter= 0;counter < yellowstar; counter++){
			starDiv.innerHTML += "<img src='img/GoldenStar.png'>";
			//alert(counter);
	}
	for (let counter= 0;counter < graystar; counter++){
			starDiv.innerHTML += "<img src='img/GrayStar.png'>";
			//alert(counter);
	}
	
    //scoreDiv.innerHTML = "<img src="+ img +">";
	//scoreDiv.innerHTML = ""
    //scoreDiv.innerHTML += "<p>"+ scorePerCent +"%</p>";
}





















