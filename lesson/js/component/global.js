var FILL_IN_BLANK_TYPE = "Fill_in_Blank";


function generateResourceLayout(targetSource) {
    // 1. get resource data from xml file
    resourceXMLReading.loadXMLData(targetSource);
}

function showAnswer(){
    console.dir("show answer !!!");
}

function checkAnswer(){
    console.dir("check answer !!!");
}

function saveXMLFile(xmlContent) {
    var blob = new Blob([xmlContent], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "saving-data.xml");
}