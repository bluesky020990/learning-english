function QuestionComponent() {

    // create map for saving each component

    var componentMap = {};
    componentMap[FILL_IN_BLANK_TYPE] = fibComponent;
    componentMap[MATCHING_TYPE] = matchingComponent;


    // set to array
    var componentArray = new Array();

    Object.keys(componentMap).map(function (key) {
        return componentArray.push(componentMap[key]);
    });

    this.initComponent = function () {
        audioComponent.initComponent();

        componentArray.forEach(function (item) {
            try {
                item.initComponent();
            } catch (error) {
                console.log("Having error when init component ");
                console.log(error);
            }
        });

    }

    this.submitAnswer = function () {

    }

    this.showResult = function () {

    }
}


var questionComponent = new QuestionComponent();
