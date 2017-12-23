/**
 * Created by Khanh Tran on 10/2/2017.
 */
function DropDownComponent(){
    var me = this;
    var defaultIdx = "--";

    this.initComponent = function () {
        if ($('[componentType="' + DROP_DOWN_TYPE + '"]').length > 0) {
            $('[componentType="' + DROP_DOWN_TYPE + '"]').each(function (index, component) {
                me.component_init(component);
            });
        }

        // add event for stop

        $('body').click(function(event){
            closeAllDropDown();
        });

    }

    this.showCorrectAnswer = function (containerType, componentId, answer) {

    }

    this.getStudentResponse = function () {

    }


    this.clearAnswer = function () {

    }

    this.clearAnswerForQuestion = function (questionContainer) {

    };
    this.component_init = function (component) {
        $(component).addClass("dropdown-component");

        var max_w = null;

        $(component).children().each(function(){
           $(this).addClass("dropdown-item");
            var currentWidth = calculateDefaultSize($(this).html());
            if(max_w == null || max_w < currentWidth){
                max_w = currentWidth;
            }
        });

        $(component).prepend('<span class="dropdown-item" idx="' + defaultIdx +'">Choose answer</span>');
        $(component).html('<span class="dropdown-list-items">' + $(component).html() + '</span>');


        var currentWidth = calculateDefaultSize("Choose answer");
        if(max_w == null || max_w < currentWidth){
            max_w = currentWidth;
        }

        $(component).css({
            width: max_w
        });

        $(component).find('.dropdown-list-items').find('.dropdown-item').click(function(e){
            e.stopPropagation();

            if (! $(this).hasClass("selected")){
                var $component = $(this).closest('.dropdown-component');
                me.component_selectItem($component,  $(this).attr("idx"));
            }
        });


        me.component_selectItem(component, defaultIdx);

        function calculateDefaultSize(text){
            $('.dropdown-selected-item-template').remove();

            $('body').append('<span class="dropdown-selected-item-template">' + text + '</span>');
            var max_width = $('body').find('.dropdown-selected-item-template').outerWidth();
            $('.dropdown-selected-item-template').remove();
            return max_width;
        }
    }

    this.component_selectItem = function (component, idx){
        $(component).find('.dropdown-selected-item').remove();
        $(component).find('.dropdown-list-items').find('.dropdown-item.selected').removeClass("selected");
        var $selectedItem = $(component).find('.dropdown-list-items').find('.dropdown-item[idx="' + idx +'"]');
        $selectedItem.addClass("selected");
        $(component).prepend('<span class="dropdown-selected-item" idx="' + $selectedItem.attr("idx") +'"><span class="dropdown-item">' + $selectedItem.html() + '</span></span>');

        // hide
        $(component).find('.dropdown-list-items').removeClass("active");


        $(component).find('.dropdown-selected-item').click(function(e){
            e.stopPropagation();

            var $component =  $(this).closest('.dropdown-component');

            if(! $(this).hasClass("active")){
                closeAllDropDown();

                $(this).addClass("active");
                $component.find('.dropdown-list-items').addClass("active");
                var $selectedItem = $component.find('.dropdown-list-items').find('.dropdown-item[idx="' + $(this).attr("idx") +'"]');
                $selectedItem.addClass("selected");
            } else {
                $(this).removeClass("active");
                $component.find('.dropdown-list-items').removeClass("active");
            }
        });
    }

    this.bindEvent = function(){

    }

    function closeAllDropDown(){
        if ($('[componentType="' + DROP_DOWN_TYPE + '"]').find('.dropdown-selected-item.active').length > 0){
            var $activeDropDown = $('[componentType="' + DROP_DOWN_TYPE + '"]').find('.dropdown-selected-item.active').closest(".dropdown-component");
            $activeDropDown.find('.dropdown-selected-item.active').removeClass("active");
            $activeDropDown.find('.dropdown-list-items.active').removeClass("active");
        }
    }


}

var dropDownComponent = new DropDownComponent();