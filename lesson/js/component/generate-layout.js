function generateLayout() {
    validateBrClass();

    // create two tab: Lesson and Practice.
    generateResourceTab();

    // generate Question layout
    generateQuestionLayout();

    stretchOutDocument();


    function generateResourceTab() {
        var $controlTabHTML = $('<div class="lesson-controller-tab">' +
            '<span class="tab-controller"  target="lesson-container">Lesson</span>' +
            '<span class="tab-controller"  target="exercise-container">Practice</span>' +
            '</div>');


        $('.resource-content').prepend($controlTabHTML);

        $controlTabHTML.find('.tab-controller').click(function () {
            if (!$(this).hasClass("active")) {
                selectActiveTable(this);
            }
        });

        selectActiveTable($('.resource-content').find('.tab-controller').eq(0));

        function selectActiveTable(tab) {
            var $currentActiveTab = $(tab).closest(".lesson-controller-tab").find('.tab-controller.active');
            if ($currentActiveTab.length > 0) {
                $('#' + $currentActiveTab.attr("target")).removeClass("active");
                $currentActiveTab.removeClass("active");


                console.dir("stop all action in current page!");
                audioComponent.audio_stopped();
            }

            $(tab).addClass("active");
            $('#' + $(tab).attr("target")).addClass("active");

            stretchOutDocument();
        }
    }


    function generateQuestionLayout() {
        generateQuestionListItems();

        function generateQuestionListItems() {
            $('.question-items').each(function () {
                $(this).find('li').each(function (idx, element) {
                    $(element).prepend('<span class="question-number">' + (idx + 1) + '.</span>');
                });
            });
        }
    }

    function validateBrClass(){
        $('.lesson-content').find('br').each(function(){
            if($(this).closest('.question_description') == null || $(this).closest('.question_description').length == 0){
                if(this.previousSibling != null && this.previousSibling.nodeValue != null && (this.previousSibling.nodeValue.length == 1 || this.previousSibling.nodeValue.trim() == "")){
                    if(this.previousSibling.previousSibling != null && this.previousSibling.previousSibling.nodeName != null && this.previousSibling.previousSibling.nodeName == "BR"){
                        $(this).addClass("break-new-line");
                    }
                }
            }
        });

        $('.question-content').find('br').each(function(){
            if(this.previousSibling != null && this.previousSibling.nodeValue != null && (this.previousSibling.nodeValue.length == 1 || this.previousSibling.nodeValue.trim() == "")){
                if(this.previousSibling.previousSibling != null && this.previousSibling.previousSibling.nodeName != null && this.previousSibling.previousSibling.nodeName == "BR"){
                    $(this).addClass("break-new-line");
                }
            }
        });
    }
}

function stretchOutDocument() {
    window.parent.stretchOutDocument($('body').height());
}


