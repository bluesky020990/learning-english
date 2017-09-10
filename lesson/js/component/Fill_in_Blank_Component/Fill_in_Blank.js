/*<span componentType="Fill_in_Blank" componentId="1_2_1" hint="(what I he I do)"></span>*/

function Fill_in_Blank_Component() {
    var me = this;

    this.initComponent = function() {
        if ($('[componentType="' + FILL_IN_BLANK_TYPE +'"]').length > 0) {
            console.dir("..............................");
            $('[componentType="' + FILL_IN_BLANK_TYPE +'"]').each(function(index, component) {
                me.component_init(component);
            });
        }


    }


    this.getStudentResponse = function (questionNumber){

    }


    this.clearAnswer = function (){

    }

    this.clearAnswerForQuestion = function (questionContainer){

    };

    this.component_init = function (component){
        var config = getConfigData(component);

        $(component).append('<input class="fill-in-blank-field" placeholder="' + (config.hint != null ? config.hint : '') +'"/>');
        // if(config.hint != null){
        //     $(component).append('<span class="fill-in-blank-hint">' + config.hint + '</span>');
        // }


        function getConfigData(component){
            return {
                'componentId': "",
                'componentType': "",
                'hint': $(component).attr("hint") != null && $(component).attr("hint").trim() != "" ? $(component).attr("hint") : null
            }
        }
    }


}

var fibComponent = new Fill_in_Blank_Component();

