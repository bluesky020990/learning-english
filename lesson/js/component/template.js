/*<span componentType="Fill_in_Blank" componentId="1_2_1" hint="(what I he I do)"></span>*/

function componentTE() {
    var me = this;

    this.initComponent = function () {
        if ($('[componentType="' + COUNTER_TYPE + '"]').length > 0) {
            $('[componentType="' + COUNTER_TYPE + '"]').each(function (index, component) {
                me.component_init(component, COUNTER_TYPE);
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

    this.component_init = function () {

    }


}

var componentTE = new componentTE();

