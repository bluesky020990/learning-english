function UnitDataFromXML(){
    var lessonLabel = "abcdefghijklimnopqrstuvwxyz";

    this.generateData = function (_unitXMLData) {
        var title =  $(_unitXMLData).find("title").text();
        var description = $(_unitXMLData).find("description").text();

        var lessons = new Array ();

        var totalLessonGroup = $(_unitXMLData).find("lessonGroup").find("lessonContent").length;

        for(var i = 0; i < totalLessonGroup; i++){
            var $element = $(_unitXMLData).find("lessonGroup").find("lessonContent").eq(i);
            var lessonGenerateHTML = generateLessonData(i, $element.text());
            lessons.push(lessonGenerateHTML);
        }

        var questions = new Array ();
        var totalQuestion =  $(_unitXMLData).find("questionGroup").find("questionItem").length;

        for(var i = 0; i < totalQuestion; i++) {
            var $element = $(_unitXMLData).find("questionGroup").find("questionItem").eq(i);
            var questionData = generateQuestionData(i, $element.find("direction").text(), $element.find("content").text(), $element.find("answer").text());
            questions.push(questionData);
        }

        return {
            title : title,
            description : description,
            lessons : lessons,
            questions : questions
        }
    };

    function generateLessonData (index, content){
        var labelDisplay = lessonLabel.charAt(index);
        var contentHTML = new Array ();

        contentHTML.push('<div class="lesson-item">');
        contentHTML.push(    '<div class="lesson-title">' + labelDisplay +'</div>');
        contentHTML.push(    '<div class="lesson-content">');
        contentHTML.push(        content);
        contentHTML.push(    '</div>');
        contentHTML.push('</div>');

        return contentHTML.join("");
    }

    function generateQuestionData (index, direction, content, answer){
        var questionNumber = index + 1;
        var questionGenerateHTML = generateQuestionContentHTML(questionNumber, direction, content);

        return {
            questionNumber : questionNumber,
            questionGenerateHTML : questionGenerateHTML,
            answer : answer
        };

        function generateQuestionContentHTML(questionNumber, direction, content){
            var questionContentHTMl = new Array ();

            questionContentHTMl.push('<div class="question-group">');
            questionContentHTMl.push(    '<span class="question-number">' + questionNumber +'</span>');

            questionContentHTMl.push(    '<div class="direction-line">');
            questionContentHTMl.push(        direction);
            questionContentHTMl.push(    '</div>');

            questionContentHTMl.push(    '<div class="question-content">');
            questionContentHTMl.push(        content);
            questionContentHTMl.push(    '</div>');
            questionContentHTMl.push('</div>');

            return questionContentHTMl.join("");
        }
    }
}

var unitDataXML =  new UnitDataFromXML();


function getUnitDataFromXML(_unitXMLData){
    return unitDataXML.generateData(_unitXMLData);
}
