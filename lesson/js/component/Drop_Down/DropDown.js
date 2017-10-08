/**
 * Created by Khanh Tran on 10/2/2017.
 */
function DropDownComponent(){
    var me = this;

    this.initComponent = function () {
        if ($('[componentType="' + DROP_DOWN_TYPE + '"]').length > 0) {
            $('[componentType="' + DROP_DOWN_TYPE + '"]').each(function (index, component) {
                me.component_init(component);
            });
        }


    }

    this.showCorrectAnswer = function (containerType, questionNumber, componentId, answer) {

    }

    this.getStudentResponse = function (questionNumber) {

    }


    this.clearAnswer = function () {

    }

    this.clearAnswerForQuestion = function (questionContainer) {

    };

    this.component_init = function (component) {
        $(component).children().each(function(){
           $(this).addClass("component-dropdown-option");
        });

        $(component).prepend('<span class="component-dropdown-option" idx="">Choose answer</span>');
    }

    this.bindEvent = function(){

    }
}

var dropDownComponent = new DropDownComponent();