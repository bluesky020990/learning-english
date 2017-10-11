var FILL_IN_BLANK_TYPE = "Fill_in_Blank";
var MATCHING_TYPE = "Matching_Component";
var DROP_DOWN_TYPE = "Drop_Down_Component";
var CHOOSING_AND_WRITE_TYPE = "Choosing_n_Write";
var CHOOSING_AND_DRAG_TYPE = "Choosing_n_Drag";


var COLOR_ARRAY       = ['red',     'orange',  'yellow',  'lightgreen', 'green',    'darkgreen', 'aqua',    'blue',    'purple',  'pink',    'grey',    'dark'];
var COLOR_ARRAY_VALUE = ['#ED1F24', '#F58220', '#FFCB05', '#99FF00',    '#00A14B', '#00AAAC',    '#00B4EB', '#0474BB', '#7956A4', '#FF00CC', '#999999', '#666666'];

var RAPHAEL_PAPER_CONTAINER_CLASS = "raphael-paper-container";


function generatePaperContainer (container){
    var $paperContainer = $('<span class="' + RAPHAEL_PAPER_CONTAINER_CLASS +'" style="width: 100%; height: 100%"></span>');
    $(container).prepend($paperContainer);

    var paper = new Raphael($paperContainer.get(0), "100%", "100%");
    paper.canvas.setAttribute('preserveAspectRatio', 'none');
    paper.setSize('100%', '100%');

    $(paper).data('CONTAINER', container);
    $(container).data('PAPER', paper);

    return paper;
}

function getPaperFromContainer (container){
    return $(container).data('PAPER') != null ? $(container).data('PAPER') : null;
}

function getColorByIndex(index){
    return COLOR_ARRAY[index % COLOR_ARRAY.length];
}


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