

document.body.style.backgroundColor = "gray";



// DOM ELEMENTS


const inputTextareaTextInput = document.getElementById("textarea-text-input");
const buttonTextareaTextInput = document.getElementById("button-textarea-text-input");
const divViewHome = document.getElementById("div-view-home");
const divViewStudy = document.getElementById("div-view-study");
const wordDisplayed = document.getElementById("word-displayed");
const buttonCorrect = document.getElementById("button-correct");
const buttonWrong = document.getElementById("button-wrong");
const divStudyReport = document.getElementById("div-view-report");
const divDisplayWrongWords = document.getElementById("div-display-wrong-words");
const buttonExit = document.getElementById("button-exit");
const selectLanguage = document.getElementById("language");



// STATE

let state = {
    vocabulary : [],
    vocabularyStudied : [],
    vocabularyMeaning : [],
    vocabularyOfObjectsInitial : [],
    vocabularyOfObjectsStudied : [],
    vocabularyWrong : [],
    vocabularyCorrect : [],
    vocabularyDisplayed : "" 
}





// FUNCTIONS

// handle input and construct the state by pasting the vocabulary data and then 
// hitting the GO button to trigger the following function by 

function getTextFromTextareaAndStoreItIntoTheState () {

    let vocabulary = inputTextareaTextInput.value;
    state.vocabulary = vocabulary;

 

    let vocabularyToStudy = vocabulary.split("\n");

    vocabularyToStudy = vocabularyToStudy.filter(item => item !== "");

    console.log(vocabularyToStudy);

    

    vocabularyToStudy.forEach(item => {
        let vocabularyObject = {studied : "", meaning : ""};
        let splitAndTurnIntoObject = item.split("\t");

        state.vocabularyStudied.push(splitAndTurnIntoObject[0]);
        state.vocabularyMeaning.push(splitAndTurnIntoObject[1]);
        vocabularyObject.studied = splitAndTurnIntoObject[0];
        vocabularyObject.meaning = splitAndTurnIntoObject[1];
        state.vocabularyOfObjectsInitial.push(vocabularyObject);

        state.vocabularyOfObjectsStudied = [...state.vocabularyOfObjectsInitial];

    });

    console.log(state.vocabularyOfObjectsInitial);
   
}


// event listener of function getTextFromTextareaAndStoreItIntoTheState ()

buttonTextareaTextInput.addEventListener("click", function(){
    getTextFromTextareaAndStoreItIntoTheState();
    divViewStudy.style.display = "block";
    divViewHome.style.display = "none";
    handleDisplayWordAfterGoButtonPressed();
});



// handle the vocabulary display when GO is pressed
// we want to display the words from the state into the div display after 
// the user presses GO button... this will initialize the test and the user 
// now can check if he/she knows the word

function handleDisplayWordAfterGoButtonPressed () {

  
   


    console.log(state.vocabularyDisplayed)
    let randomNumber = Math.floor(Math.random() * state.vocabularyOfObjectsStudied.length);
    let wordToDisplay = state.vocabularyOfObjectsStudied[randomNumber].studied;

    //state.vocabularyOfObjectsStudied = state.vocabularyOfObjectsStudied.filter(item => item.studied !== wordToDisplay);
    
    state.vocabularyDisplayed = wordToDisplay;
    
    wordDisplayed.textContent = wordToDisplay;

    console.log(state.vocabularyDisplayed);

  

  
}


// then we design the correct and wrong buttons functionality
// if user chooses correct we will update the vocabularyOfObjects, vocabularyCorrect
// in other words if the user chooses right we will remove the right object from
// the vocabularyOfObjects array and we will push the word into the vocabularyCorrect array

// if the user chooses wrong we will just go on, but we will push the wrong word into the
// vocabularyCorrect array so that we can restudy or evaluate later on


function handleVocabularyCorrect () {


let wordToHandle = state.vocabularyDisplayed;

state.vocabularyOfObjectsStudied = state.vocabularyOfObjectsStudied.filter(item => item.studied !== wordToHandle);

// handle the situation when there is no word left in the study array
if(state.vocabularyOfObjectsStudied.length === 0) {

    wordDisplayed.textContent = "no words left to study";

    let directive = confirm("no words left... study the unknown words?");

    if(directive) {


        if(state.vocabularyWrong.length === 0) {
            alert("congratulations! no words answered wrong...exitting to homepage");
            location.reload();
        }




        // set of unknown words :

        let setOfWrongWords = [...new Set(state.vocabularyWrong)];

        let filteredArrayOfWrongObjectsOnly = []

        setOfWrongWords.forEach(veri => {

            let filtered = state.vocabularyOfObjectsInitial.filter(item => item.studied === veri);

            filteredArrayOfWrongObjectsOnly = filteredArrayOfWrongObjectsOnly.concat(filtered);

        });

        state.vocabularyOfObjectsStudied = [...filteredArrayOfWrongObjectsOnly];

        console.log(state.vocabularyOfObjectsStudied);

        

        handleDisplayWordAfterGoButtonPressed();
        
        trackWrongWords();

    } else {

        divStudyReport.style.display = "block";
        divViewStudy.style.display = "none";

        let wrongWordsCountToDisplay = trackWrongWords();

        if(wrongWordsCountToDisplay.length > 0) {

        wrongWordsCountToDisplay.sort((a,b) => b.count - a.count);

        wrongWordsCountToDisplay.forEach(item => {

            let filteredTarget = state.vocabularyOfObjectsInitial.filter(kelime => kelime.studied === item.word);
            let meaning = filteredTarget[0].meaning;

            let element = document.createElement("p");
            element.innerHTML = ` ${item.word} (= ${meaning}) was wrong ${item.count} times `;
            divDisplayWrongWords.append(element);
        });

    } else {

        divDisplayWrongWords.textContent = "There are no unknown words."

    }

    
    }

    return;
}

let randomNumber = Math.floor(Math.random() * state.vocabularyOfObjectsStudied.length);

let nextWord = state.vocabularyOfObjectsStudied[randomNumber].studied;

state.vocabularyDisplayed = nextWord;

wordDisplayed.textContent = nextWord;

console.log(wordToHandle);

console.log(state.vocabularyOfObjectsInitial);
console.log(state.vocabularyOfObjectsStudied);

}



buttonCorrect.addEventListener("click", function() {
    handleVocabularyCorrect();
});




// handle wrong button functionality

function handleVocabularyWrong () {

    let wordToHandle = state.vocabularyDisplayed;
    // push into the wrong words list
    state.vocabularyWrong.push(wordToHandle);


    let randomNumber = Math.floor(Math.random() * state.vocabularyOfObjectsStudied.length);

    let nextWord = state.vocabularyOfObjectsStudied[randomNumber].studied;


    state.vocabularyDisplayed = nextWord;

    wordDisplayed.textContent = nextWord;


    findMeaning();

}





buttonWrong.addEventListener("click", function(){

    handleVocabularyWrong();


});



// find details of wrong words at a given time

function trackWrongWords () {

    let trackReport = [];
    

    let setOfWrongWords = [...new Set(state.vocabularyWrong)];


    setOfWrongWords.forEach(veri => {

        let object = {word : "", count : 0};

        let counted = state.vocabularyWrong.filter(item => item === veri).length;

        object.word = veri;
        object.count = counted;

        trackReport.push(object);

    });

    return trackReport;

} 




buttonExit.addEventListener("click", function(){
    location.reload();
});




document.body.oncopy = () => {


    let language = selectLanguage.value
    let copiedText = window.getSelection().toString()
    console.log(copiedText)

switch (language) {

    case "russian" :

    // window.open(`https://ceviri.yandex.com.tr/?from=morda_new&lang=ru-en&text=${copiedText}`, "_blank")
    window.open(`https://en.pons.com/translate/russian-english/${copiedText}`, "_blank")
    break;
    case "japanese" :

    window.open(`https://jisho.org/search/${copiedText}`,"_blank")
    break;

    case "chinese" :

    //window.open(`https://www.collinsdictionary.com/dictionary/english-chinese/${copiedText}`, "_blank")
    window.open(`https://dict.naver.com/linedict/zhendict/dict.html#/cnen/search?query=${copiedText}`, "_blank")
    window.open(`plecoapi://x-callback-url/s?q=${copiedText}`)
    

    break;
    case "french-english" :

    window.open(`https://translate.google.com/#view=home&op=translate&sl=fr&tl=en&text=${copiedText}`, "_blank")
    break;

    case "english-french" :

        window.open(`https://translate.google.com/#view=home&op=translate&sl=en&tl=fr&text=${copiedText}`, "_blank")
        break;

    default :

    alert ("please select language")

}

}


// find meaning of the word

function findMeaning () {

    let wordToSearch = state.vocabularyDisplayed

    let filtered = state.vocabularyOfObjectsInitial.filter(item => item.studied === wordToSearch);

    let meaning = filtered[0].meaning

   return [wordToSearch, meaning]


}

wordDisplayed.addEventListener("click", function(e) {
    let [wordToSearch, meaning] = findMeaning();
    wordDisplayed.innerHTML = `${wordToSearch} = ${meaning}`
})


