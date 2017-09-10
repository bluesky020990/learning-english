function generateLayout() {
    console.dir("generateLayout ............................");
    // create two tab: Lesson and Practice.
    generateResourceTab();

    // generate Question layout
    generateQuestionLayout();

    stretchOutDocument();

    console.dir("stretchOutDocument ............................" + $('body').height());

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
}

function stretchOutDocument() {
    window.parent.stretchOutDocument($('body').height());
}

