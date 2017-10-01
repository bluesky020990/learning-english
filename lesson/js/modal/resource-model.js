

function ResourceModel (){

    this.code = null;
    this.title = null;
    this.description = null;

    this.lessons = new Array ();
    this.questions = new Array();

    this.generateDataFromXMLElement = function (_xmlData){
        this.code =  $(_xmlData).find("code").text();
        this.title =  $(_xmlData).find("title").text();
        this.description = $(_xmlData).find("description").text();


        var totalLessonGroup = $(_xmlData).find("lessonGroup").find("lessonContent").length;

        for(var i = 0; i < totalLessonGroup; i++){
            var $element = $(_xmlData).find("lessonGroup").find("lessonContent").eq(i);
            var lessonObject = new LessonModel();
            lessonObject.generateDataFromXMLElement($element);
            this.lessons.push(lessonObject);
        }

        var totalQuestion =  $(_xmlData).find("questionGroup").find("questionItem").length;

        for(var i = 0; i < totalQuestion; i++) {
            var $element = $(_xmlData).find("questionGroup").find("questionItem").eq(i);
            var questionObject = new QuestionModel();
            questionObject.generateDataFromXMLElement($element);

            this.questions.push(questionObject);
        }

        return this;
    };
}
