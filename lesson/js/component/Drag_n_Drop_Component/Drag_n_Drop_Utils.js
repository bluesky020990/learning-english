/*
* <div class="drag-drop-zone">
*     <div class="source-items" multipleDrag="false|true">
*         <span class="drag-item" idx="a"></span> <span class="drag-item" idx="b"></span> <span class="drag-item" idx="c"></span>
*     </div>
*     <div class="target-items">
*         <div class="drop-item" acceptOne="true|false" idx="1"></div>
*         <div class="drop-item" acceptOne="true|false" idx="1"></div>
*     </div>
* </div>
*
* */

var DRAG_DROP_ZONE_CLASS = "drag-drop-zone";
var DRAG_ITEM_CLASS = "drag-item";
var DROP_ITEM_CLASS = "drop-item";
var TARGET_DRAG_ITEM_CLASS = "source-items";
var TARGET_DROP_ITEM_CLASS = "target-items";

function DragNDropUtil(){

    var click = {
        x: 0,
        y: 0
    };
    var me = this;


    this.component_bindEventDrag = function (element, removeAfterDrag, multipleDrag, callbackDrag){
        var $containment = $(element).closest('.' + DRAG_DROP_ZONE_CLASS);

        $(element).data('REMOVE-AFTER-DRAG', removeAfterDrag);
        $(element).data('MULTIPLE-DRAG', multipleDrag);

        $(element).draggable({
            scroll: false,
            cursor: "move",
            start: function (event, ui) {
                click.x = event.clientX;
                click.y = event.clientY;

                $(event.target).data('IN-DROP-ZONE', null);

                if($(event.target).closest('.' + TARGET_DRAG_ITEM_CLASS).length >0){
                    $(event.target).data('IS-SOURCE-ITEM', true);
                }

            },
            stop: function (event, ui) {
                handleStopDrag(event.target, ui, callbackDrag);
            },
            cursorAt: { left: Math.floor(5)},
            helper: 'clone',
            drag:function (event, ui) {
                if(window.parent.scrollToOffset){
                    window.parent.scrollToOffset(ui.offset.top);
                }
            },
            containment: $containment
        });
    };

    function handleStopDrag(element, ui, callbackDrag){
        console.dir("handle stop drag ");
        var $containment = $(element).closest('.' + DRAG_DROP_ZONE_CLASS);

        var removeAfterDrag  = $(element).data('REMOVE-AFTER-DRAG');
        var multipleDrag = $(element).data('MULTIPLE-DRAG');

        if(! multipleDrag){
            // If dropped is undefined, ie. it has been dropped outside a dropzone !
            // enable the original dragging item.
            if ($(element).data("IN-DROP-ZONE") == null || $(element).data("IN-DROP-ZONE") == undefined) {
                $containment.find('.' + TARGET_DRAG_ITEM_CLASS).find('.' + DRAG_ITEM_CLASS +'[idx="' + $(element).attr('idx') +'"]').each(function(index, e) {
                    if ($(e).hasClass('ui-draggable') && $(e).hasClass('ui-draggable-disabled')) {
                        $(e).draggable("enable");
                        if (removeAfterDrag) {
                            $(e).show();
                        }
                    }
                });
            }
        }

        if ($(element).data('IS-SOURCE-ITEM') != true && $(element).data('IN-DROP-ZONE') == null && removeAfterDrag){
            $(element).remove();
        } else if($(element).data('IS-SOURCE-ITEM') == undefined &&  $(element).data('IN-DROP-ZONE') != null){
            $(element).remove();
        }

        // callbackDrag

        stretchOutDocument();
    }


    this.component_bindEventDrop = function (element, removeAfterDrag, multipleDrag, multipleDrop, callbackDrag, callbackDrop){
        if (removeAfterDrag) {
            multipleDrag = false;
        }
        $(element).droppable({
            accept: '.' + DRAG_ITEM_CLASS,
            hoverClass: "ui-state-hover",
            cursor: "move",
            tolerance: "pointer",
            drop: function (event, ui) {
                handleStopDrop(event.target, ui, removeAfterDrag, multipleDrag, multipleDrop, callbackDrag, callbackDrop);
            }
        });
    };

    function handleStopDrop(element, ui, removeAfterDrag, multipleDrag, multipleDrop, callbackDrag, callbackDrop){
        if (! multipleDrop) {
            var accept = acceptAnElement(element, ui);
            if (! accept) {
                return;
            }
        }

        if (! multipleDrag) {
            $(ui.draggable).data('IN-DROP-ZONE', true);
            if ($(ui.draggable).hasClass('ui-draggable')) {
                $(ui.draggable).draggable('disable', true);

                if (removeAfterDrag) {
                    $(ui.draggable).hide();

                    if( $(ui.draggable).closest('.' + DROP_ITEM_CLASS).length > 0){
                        $(ui.draggable).remove();
                    }
                }
            }
        }

        var helper = $(ui.helper.detach()).clone();
        helper.initItem = ui.helper.initItem;
        $(helper).removeClass("ui-draggable-dragging");
        $(element).append(helper);

        me.component_bindEventDrag(helper, true, false, callbackDrag);

        if ($(element).hasClass(DROP_ITEM_CLASS)) {
            $(helper).removeAttr('style');
        }

        $(ui.helper).remove();
        stretchOutDocument();

        function acceptAnElement(dropZone, ui){
            var $dragChild = $(dropZone).find('.' + DRAG_ITEM_CLASS);
            if ($dragChild.length == 0) {
                return true;
            } else {
                return $(ui.draggable).data('IN-DROP-ZONE') == $(dropZone).attr('idx');
            }
        }
    }
}