function ResourceXMLReading (){
    var me = this;
    var unitData = null;

    this.loadXMLData  = function(targetSource){
        var unitXMLDataSource = targetSource;

        $.ajax({
            type: "GET",
            url: unitXMLDataSource,
            dataType: "xml",
            success: loadUnitXMLData
        });
    };

    function loadUnitXMLData (_unitXMLData){
        unitData = getUnitDataFromXML (_unitXMLData);

        me.renderLayoutFromData(unitData);

        $('body').addClass("load-data-finished");


        generateLayout();

        questionComponent.initComponent();

        stretchOutDocument();

        window.parent.updateResourceTitleDisplay(unitData.title + ": " +unitData.description);

        setTimeout(stretchOutDocument, 500);
    };

    this.renderLayoutFromData = function (){
        $('body').find('.unit-title').html(unitData.title);
        $('body').find('.resource-title').html(unitData.description);

        for(var i = 0; i < unitData.lessons.length; i++){
            var lessonDataHTML = unitData.lessons[i];
            $('#lesson-container').find('.lesson-group').append($(lessonDataHTML));
        }

        for (var i = 0; i < unitData.questions.length; i++){
            var questionData = unitData.questions[i];
            $('#exercise-container').append($(questionData.questionGenerateHTML));
        }
    };

    this.submitScoreAndGrading = function(){

    };


}

var resourceXMLReading = new ResourceXMLReading();
