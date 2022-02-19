function debug(text) {
  console.log(text);
  return 0;
}

const el = {
  read : function(id) {
    return document.getElementById(id).value;
  },
  change : function(id, content) {
    document.getElementById(id).innerHTML = content;
    return 0
  },
  append : function(id, content) {
    document.getElementById(id).innerHTML += content;
    return 0
  }
};

let wholeTranslation = [];

function createInterlace() {

  function parseOriginalText() {
    //Initialize variables
    let originalParagraphs = [];
    let hardwrap = /(\\r\\n|\\n|\\r|<br>)/g;
    //Retrieve whatever text has been pasted.
    let originalText = el.read("original-text");
    //Add obvious and unique keyword between every common type of sentence ending.
    originalText = originalText.replace(/\. /g, ".xxsentencexx").replace(/\? /g, "?xxsentencexx").replace(/\! /g, "!xxsentencexx");
    //If text has any kind of line breaks, assume it's paragraphs.
    originalText = originalText.replace(hardwrap, "xxparagraphxx");
    //Split text into paragraphs and return value
    return originalText.split("xxparagraphxx");
  }

  function displayInterlace(paragraphs) {
    //Initialize variables
    let c;
    let d;
    let eachPara = "";
    let empty = true;

    //Loop through each paragraph to generate html and display on page
    for(c = 0; c < paragraphs.length; c++) {
      //Create empty subarray to hold paragraphs of translated sentences
      wholeTranslation[c] = [];
      //Split each paragraph into subarrays of sentences
      paragraphs[c] = paragraphs[c].split("xxsentencexx");
      //Start generating the html for displaying this paragraph
      eachPara = "<div class='paragraph'>";
      for(d = 0; d < paragraphs[c].length; d++) {
        //First check for and skip empty sentences. Any non-empty sentence means the whole paragraph is not empty.
        if(paragraphs[c][d] == "") {
          break;
        }
        else {
          empty = false;
        }
        //Create empty string element in translated paragraph subarray
        wholeTranslation[c][d] = "";
        //Generate html to hold original sentence
        paragraphs[c][d] = "<p class='original-sentence'>" + paragraphs[c][d] + "</p>";
        //Add this sentence html to the whole paragraph's html
        eachPara += paragraphs[c][d];
        //Generate a field for typing translations below each original sentence
        eachPara = eachPara +
          "<p id='" + c + "-" + d + "' class='translated-sentence' contenteditable='true' onblur='updateTranslation(this)'></p>";
      }
      //Finish the html for this paragraph
      eachPara += "</div>";
      //If entire paragraph is not empty, draw it and reset empty variable. Otherwise don't bother even drawing it.
      if(!empty) {
        //Draw the whole paragraph on the webpage (can't do piecemeal because browsers autoclose "missing" tags)
        el.append("wrapper", eachPara);
        empty = true;
      }
    }

    return 0;
  }

  el.change("wrapper", "");
  displayInterlace(parseOriginalText());

  return 0;
}

function updateTranslation(received) {
  //Initialize variables
  let upId = received.id.split("-");
  let translatedOutput = [];
  let thisPara;

  //Read the content of the user-supplied translation and save it in the whole remembered translation
  wholeTranslation[upId[0]][upId[1]] = received.innerText.replace("\n",""); //tab key has weird newline behavior sometimes

  function removeEmpties(original) {
    let condensed = [];
    for(let c = 0; c < original.length; c++) {
      if(original[c].length > 0) {
        condensed.push(original[c]);
      }
    }
    return condensed;
  }

  //Collate only non-empty paragraphs and sentences into single text block.
  for(let c = 0; c < wholeTranslation.length; c++) {
    thisPara = removeEmpties(wholeTranslation[c]);
    if(thisPara.length > 0) {
      translatedOutput.push(thisPara.join(" "));
    }
  }

  debug(translatedOutput);
  translatedOutput = translatedOutput.join("\n\n");

  //Update webpage to show entire translation
  el.change("translated-text", translatedOutput);
  return 0;
}

function interlaceCheck() {
  //Make sure user really wants to redraw page to parse original language text.
  let confirmed = confirm("Parse language text? This will delete any sentence translations in progress.");
  if(confirmed) {
    createInterlace();
  }
  return 0;
}

function test() {
  el.change("original-text", "This is one kind of sentence. It ends in a period. \nIs this another? It should be! Why wouldn't it be? I don't know.");
  createInterlace();
  return 0;
}
