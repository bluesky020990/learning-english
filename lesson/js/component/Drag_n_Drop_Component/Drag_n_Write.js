/**
 * Created by Khanh Tran on 10/2/2017.
 */

function Choosing_n_Write_Component(){
    var me = this;
    var dragNDropUtil = new DragNDropUtil();

    this.initComponent = function () {
        if ($('[componentType="' + CHOOSING_AND_WRITE_TYPE + '"]').length > 0) {
            $('[componentType="' + CHOOSING_AND_WRITE_TYPE + '"]').each(function (index, component) {
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

        $(component).addClass(DRAG_DROP_ZONE_CLASS);
        $(component).find('.work-box-display').addClass(TARGET_DRAG_ITEM_CLASS);
        $(component).find('.work-box-display').find('.draggable').addClass(DRAG_ITEM_CLASS);

        $(component).find('.choosing-n-write-container').addClass(TARGET_DROP_ITEM_CLASS);
        $(component).find('.choosing-n-write-container').find('.droppable').addClass(DROP_ITEM_CLASS);

        var callbackDrag = null;
        $(component).find('.' + DRAG_ITEM_CLASS).each(function(){
            //element, removeAfterDrag, multipleDrag
            dragNDropUtil.component_bindEventDrag(this, true, false, callbackDrag);
        });

        var callbackDrop = null;
        $(component).find('.' + DROP_ITEM_CLASS).each(function(){
            //element removeAfterDrag, multipleDrag, multipleDrop
            dragNDropUtil.component_bindEventDrop(this, true, false, false, callbackDrop);
        });

    }
}

var choosingAndWriteComponent = new Choosing_n_Write_Component();
