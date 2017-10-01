/**
 * Created by Khanh Tran on 9/14/2017.
 */
function LessonModel (){
    this.lessonId = null;
    this.lessonContentHTML = null;

    this.generateDataFromXMLElement = function (_xmlData){
        var labelDisplay = lessonLabel.charAt(index);
        var contentHTML = new Array ();

        contentHTML.push('<div class="lesson-item">');
        contentHTML.push(    '<div class="lesson-title">' + labelDisplay +'</div>');
        contentHTML.push(    '<div class="lesson-content">');
        contentHTML.push(        content);
        contentHTML.push(    '</div>');
        contentHTML.push('</div>');

        return contentHTML.join("");
    };
}
