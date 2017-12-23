/*
 <span componentType="Matching_Component" componentId="1_1">
     <span idx="sourceItems">
         <span idx="1">Please don't make so much noise.</span>
         <span idx="2">I need to eat something soon.</span>
         <span idx="3">I don't have anywhere to live right now.</span>
         <span idx="4">We need to leave soon.</span>
         <span idx="5">They don't need their car any more.</span>
         <span idx="6">Things are not so good at work.</span>
         <span idx="7">lt isn't true what they said.</span>
         <span idx="8">We're going to get wet .</span>
     </span>

     <span idx="targetItems">
         <span idx="a">lt's getting late</span>
         <span idx="b">They're lying.</span>
         <span idx="c">lt's starting to rain.</span>
         <span idx="d">They're trying to sell it.</span>
         <span idx="e">I'm getting hungry.</span>
         <span idx="f">I'm trying to work</span>
         <span idx="g">I'm looking for an apartment.</span>
         <span idx="h">The company is losing money.</span>
     </span>
 </span>
* */

function MatchingComponent() {
    var me = this;

    this.initComponent = function () {
        if ($('[componentType="' + MATCHING_TYPE + '"]').length > 0) {
            $('[componentType="' + MATCHING_TYPE + '"]').each(function (index, component) {
                me.component_init(component, MATCHING_TYPE);
            });
        }
    };

    this.showCorrectAnswer = function (containerType, componentId, answer) {

    }

    this.getStudentResponse = function () {

    }


    this.clearAnswer = function () {

    }

    this.clearAnswerForQuestion = function (questionContainer) {

    };

    this.component_init = function (component) {
        var config = getConfigForComponent(component);

        // step 1 : create drag n drop
        generateDragNDropArea(component);

        // step 2 : create drawable area
        generateDrawableArea(component);


        function getConfigForComponent (component){

        }


        function generateDragNDropArea (component){
            $(component).find('[idx="sourceItems"]').children().each(function(idx){
                $(this).attr("borderColor", getColorByIndex(idx));
                $(this).attr("objectIndex", idx);

                $(this).draggable({
                    revert: true,
                    cursor: "move",
                    start: function(){
                        $(this).addClass("draggable-on-drag");

                    }, stop: function(){
                        $(this).removeClass("draggable-on-drag");

                        var targetItem = $(this).data('DROP_AREA');

                        if(targetItem != null && targetItem != undefined){
                            createConnectLine(this, targetItem);
                        }

                        $(this).data('DROP_AREA', null);
                    },
                    containment: '[componentType="' + MATCHING_TYPE + '"]'
                });
            });

            $(component).find('[idx="targetItems"]').children().each(function(){
                $(this).droppable({
                    drop: function( event, ui ) {
                       $(ui.helper).data('DROP_AREA', this);
                    }
                });
            });
        }

        function generateDrawableArea(container){
            generatePaperContainer (container);
        }
    };

    function createConnectLine(sourceItem, targetItem){
        var $component = $(sourceItem).closest('[componentType="' + MATCHING_TYPE + '"]');
        var paper = getPaperFromContainer($component);

        if(paper == null){
            paper = generatePaperContainer($component);
        }

        paper.matching_createConnectLine(sourceItem, targetItem);

        disableElement(sourceItem);
        disableElement(targetItem);
    }


    Raphael.fn.matching_createConnectLine = function (sourceItem, targetItem) {
        var paper = this;

        var pagerOffset = $(paper.canvas).closest('.' + RAPHAEL_PAPER_CONTAINER_CLASS).offset();
        var offset_source = {cx : $(sourceItem).offset().left + $(sourceItem).outerWidth() - pagerOffset.left, cy: $(sourceItem).offset().top + $(sourceItem).outerHeight() / 2 - pagerOffset.top};
        var offset_target = {cx : $(targetItem).offset().left - pagerOffset.left                        , cy: $(targetItem).offset().top + $(targetItem).outerHeight() / 2 - pagerOffset.top};

        var color = getColorByIndex(parseInt($(sourceItem).attr("objectIndex")));

        var matchingLine = paper.path(getMathchingLineBetweenTwoPoint(offset_source.cx, offset_source.cy, offset_target.cx, offset_target.cy));
        matchingLine.attr({
            'stroke' : color,
            'stroke-width': 2
        });

        var matchingCircle = paper.circle(offset_source.cx + (offset_target.cx - offset_source.cx) / 2, offset_source.cy + (offset_target.cy - offset_source.cy) / 2, 15).attr({
            'fill': color,
            'stroke': color,
            'stroke-width': 0,
            'cursor': 'pointer'
        });

        var matchingIcon = paper.text(offset_source.cx + (offset_target.cx - offset_source.cx) / 2, offset_source.cy + (offset_target.cy - offset_source.cy) / 2, "×").attr({
            'fill': "white",
            'font-size': 30,
            'text-anchor': 'middle',
            'cursor': 'pointer'
        });

        var matchingSet = paper.set();
        matchingSet.push(matchingLine);
        matchingSet.push(matchingCircle);
        matchingSet.push(matchingIcon);

        $(matchingSet).data('sourceItem', sourceItem);
        $(matchingSet).data('targetItem', targetItem);

        $(matchingCircle).data('matchingSet', matchingSet);
        $(matchingIcon).data('matchingSet', matchingSet);


        matchingCircle.click(function(){
            var matchingSet = $(this).data('matchingSet');
            matchingSet.matching_removeConnectLine();
        });

        matchingIcon.click(function(){
            var matchingSet = $(this).data('matchingSet');
            matchingSet.matching_removeConnectLine();
        });

        $(targetItem).attr("borderColor", $(sourceItem).attr("borderColor"));
        $(sourceItem).attr("target", $(targetItem).attr('idx'));

        function getMathchingLineBetweenTwoPoint(cx_1, cy_1, cx_2, cy_2){
            var line_padding = 20;

            if(cx_1 < cx_2){
                return "M" + cx_1 + "," + cy_1 + "L" + (cx_1 + line_padding) + "," + cy_1 +  "L" + (cx_2 - line_padding) + "," + cy_2 + "L" + cx_2 + "," + cy_2;
            } else {
                return "M" + cx_2 + "," + cy_2 + "L" + (cx_2 + line_padding) + "," + cy_2 +  "L" + (cx_1 - line_padding) +  "," + cy_1 + "L" + cx_1 + "," + cy_1;
            }
        }
    };

    Raphael.st.matching_removeConnectLine = function(){
        var matchingSet = this;

        var sourceItem = $(matchingSet).data('sourceItem');
        var targetItem = $(matchingSet).data('targetItem');

        enableElement(sourceItem);
        enableElement(targetItem);

        matchingSet.remove();
    };

    function enableElement(element){
        if($(element).hasClass("ui-draggable")){
            $(element).draggable("enable");
            $(element).attr("target", "");
        } else {
            $(element).droppable("enable");
            $(element).attr("borderColor", "");
        }
    }

    function disableElement(element){
        if($(element).hasClass("ui-draggable")){
            $(element).draggable("disable");
        } else {
            $(element).droppable("disable");
        }
    }
}

var matchingComponent = new MatchingComponent();

