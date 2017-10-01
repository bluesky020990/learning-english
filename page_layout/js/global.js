var currentResourceXMLDataSource = null;

function loadProductData() {
    productDataObject.loadDataXML("data/category.xml");
}

function ProductDataObject() {
    var productXMLData;
    var me = this;
    this.programSeriesObjects = new Array();

    this.loadDataXML = function (xmlDataSource) {
        $.ajax({
            type: "GET",
            url: xmlDataSource,
            dataType: "xml",
            success: loadProductXMLData
        });
    }

    this.generateDataFromXMLElement = function (xmlElement) {

        var numberOfProduct = $(xmlElement).find('programSeries').length;
        for (var i = 0; i < numberOfProduct; i++) {
            var programSeriesXMLElement = $(xmlElement).find('programSeries').eq(i);
            var programSeriesObject = new ProgramSeriesObject();
            programSeriesObject.generateDataFromXMLElement(programSeriesXMLElement);
            this.programSeriesObjects.push(programSeriesObject);
        }
    }

    function loadProductXMLData(_productXMLData) {
        productXMLData = _productXMLData;
        me.generateDataFromXMLElement(productXMLData);

        generateLayout();

        bindEventForPage();
    }

    function generateLayout() {
        var $categoryGroup = $('#program-series-tab');
        var $unitItemsDisplay = $('#unitItemsDisplay');

        if (productDataObject.programSeriesObjects != null && productDataObject.programSeriesObjects.length > 0) {

            $categoryGroup.addClass("group-" + productDataObject.programSeriesObjects.length + "-columns");

            for (var i = 0; i < productDataObject.programSeriesObjects.length; i++) {
                var programSeriesObj = productDataObject.programSeriesObjects[i];

                $categoryGroup.append(programSeriesObj.generateHTMLDisplay());
                $unitItemsDisplay.append(programSeriesObj.generateListUnitDisplay());
            }
        }

    }
}

var productDataObject = new ProductDataObject();

function ProgramSeriesObject() {
    this.programSeriesCode = null;
    this.programSeriesName = null;
    this.products = new Array();

    this.generateDataFromXMLElement = function (xmlElement) {

        this.programSeriesCode = $(xmlElement).find("programSeriesCode").text();
        this.programSeriesName = $(xmlElement).find("programSeriesName").text();

        var numberOfProduct = $(xmlElement).find('products').find('product').length;
        for (var i = 0; i < numberOfProduct; i++) {
            var productXMLElement = $(xmlElement).find('products').find('product').eq(i);
            var productObject = new ProductObject();

            productObject.generateDataFromXMLElement(productXMLElement);

            this.products.push(productObject);
        }
    }

    this.generateHTMLDisplay = function () {
        var htmlDisplayArray = new Array();
        htmlDisplayArray.push('<div class="program-series-container" target="' + this.programSeriesCode + '">');
        htmlDisplayArray.push('<div class="program-series-header"></div>');
        htmlDisplayArray.push('<div class="program-series-title">' + this.programSeriesName + '</div>');
        htmlDisplayArray.push('</div>');

        return htmlDisplayArray.join("");
    }


    this.generateListUnitDisplay = function () {
        var htmlDisplayArray = new Array();
        htmlDisplayArray.push('<div class="program-series-list-items" target="' + this.programSeriesCode + '">');
        htmlDisplayArray.push(    '<h3 class="program-series-title">' + this.programSeriesName + '</h3>');
        htmlDisplayArray.push(    '<div class="program-series-items">');
        htmlDisplayArray.push(        '<div class="panel-group" role="tablist" aria-multiselectable="true" id="program-series-list-items-display">');
        for (var i = 0; i < this.products.length; i++) {
            var productObject = this.products[i];
            htmlDisplayArray.push(productObject.generateListUnitDisplay());
        }
        htmlDisplayArray.push(        '</div>');
        htmlDisplayArray.push(    '</div>');
        htmlDisplayArray.push('</div>');
        return htmlDisplayArray.join("");
    }
}

function ProductObject() {
    this.productCode = null;
    this.productName = null;
    this.units = new Array();

    this.generateDataFromXMLElement = function (xmlElement) {
        this.productCode = $(xmlElement).find("productCode").text();
        this.productName = $(xmlElement).find("productName").text();

        var numberOfUnit = $(xmlElement).find('listUnits').find('unit').length;
        for (var i = 0; i < numberOfUnit; i++) {
            var unitXMLData = $(xmlElement).find('listUnits').find('unit').eq(i);
            var unitObject = new UnitObject();

            unitObject.generateDataFromXMLElement(unitXMLData);

            this.units.push(unitObject);
        }
    }

    this.generateListUnitDisplay = function () {
        var htmlDisplayArray = new Array();
        htmlDisplayArray.push('<div class="panel panel-default">');
        htmlDisplayArray.push(    '<div class="panel-heading">');
        htmlDisplayArray.push(        '<h4 class="panel-title"><a role="button" data-toggle="collapse" data-parent="#program-series-list-items-display" href="#product-item-' + this.productCode + '" aria-expanded="false" aria-controls="collapseTwo">' + this.productName + '</a></h4>');
        htmlDisplayArray.push(    '</div>');
        htmlDisplayArray.push(    '<div id="product-item-' + this.productCode + '" class="panel-collapse collapse">');
        // htmlDisplayArray.push(        '<div class="panel-body">');
        htmlDisplayArray.push(            '<ul class="list-group">');
        for (var i = 0; i < this.units.length; i++) {
            var unitObj = this.units[i];
            htmlDisplayArray.push(unitObj.generateListUnitDisplay());
        }
        htmlDisplayArray.push(            '</ul>');
        // htmlDisplayArray.push(        '</div>');
        htmlDisplayArray.push(    '</div>');
        htmlDisplayArray.push('</div>');
        return htmlDisplayArray.join("");
    }
}

function UnitObject() {
    this.unitCode = null;
    this.unitName = null;
    this.xmlSource = null;

    this.generateDataFromXMLElement = function (xmlElement) {
        this.unitCode = $(xmlElement).find("unitCode").text();
        this.unitName = $(xmlElement).find("unitName").text();
        this.xmlSource = $(xmlElement).find("xmlSource").text();
    }

    this.generateListUnitDisplay = function () {
        var htmlDisplayArray = new Array();
        htmlDisplayArray.push('<li class="list-group-item unit-list-item" sourceItem="' + this.xmlSource + '" target="' + this.unitCode + '">' + this.unitName + '</li>');
        return htmlDisplayArray.join("");
    }
}

// COMMON FUNCTION

function bindEventForPage(){
    $('.program-series-container').click(function(){
        if (! $(this).hasClass("active")){
            var target = $(this).attr("target");

            $('.program-series-container.active').removeClass("active");
            $('.program-series-container.active').removeClass("active");

            $('.program-series-list-items.active').removeClass('active');

            $(this).addClass("active");
            $('.program-series-list-items[target="' + target +'"]').addClass("active");


            $('#program-series-tab').collapse('hide');
        }
    });


    $('#unitItemsDisplay').find('.unit-list-item').click(function (e) {
        if (!$(this).hasClass("active")){
            var unitListItem = this;

            if($('#unitContentViewer').length > 0){
                bootbox.confirm({
                    message: "Would you like load new resource?",
                    buttons: {
                        confirm: {
                            label: 'Load resource',
                            className: 'btn-success'
                        },
                        cancel: {
                            label: 'Cancel',
                            className: 'btn-danger'
                        }
                    }, callback: function (result) {
                        if(result){
                            loadNewResource(unitListItem)
                        }
                    }
                });
            } else {
                loadNewResource(unitListItem);
            }
        }
    });

    loadSampleLayout();
}


function loadNewResource(unitListItem){
    $('#unitItemsDisplay').find('.unit-list-item.active').removeClass("active");

    var targetUrl = $(unitListItem).attr("sourceItem");
    loadResource(targetUrl);

    $(unitListItem).addClass("active");
}

function loadResource(targetUrl) {
    $('#content-unit-container').find('#unitContentViewer').remove();
    currentResourceXMLDataSource = targetUrl;

    $('<iframe id="unitContentViewer" src="lesson/unit-content.html" style="width: 100%; height: auto; margin-bottom: 50px; border: 1.1px solid #ccc;"/>').appendTo($('#content-unit-container'));
}

function loadProgramSeriesClass(){
    return $('#unitItemsDisplay').find('.unit-list-item.active').closest('.program-series-list-items').attr("target");
}

function loadSampleLayout() {
    var sampleUrl = "../data/vocabulary_in_use/elementary/unit_1.xml";
    loadResource(sampleUrl);
}

function loadResourceXMData(targetUrl) {
    if (document.getElementById('unitContentViewer').contentWindow.generateResourceLayout) {
        document.getElementById('unitContentViewer').contentWindow.generateResourceLayout(targetUrl);
    } else {
        console.dir(document.getElementById('unitContentViewer').contentWindow);
    }
}


function stretchOutDocument(height) {
    $('#unitContentViewer').height(height + 10);
}

function updateResourceTitleDisplay (resourceTitleDisplay){
    $('.resource-header-title').show();
    $('.resource-actions').show();

    $('.resource-header-title').find('h3').html(resourceTitleDisplay);
}

function getIframeDocument(iFrameId){
    var iFrameElement = document.getElementById(iFrameId);
    return iFrameElement.contentDocument || iFrameElement.contentWindow.document;
}


