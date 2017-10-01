function iWord() {
    var activeSong = null;
    var chooseList = [];
    var typeSet = "A";
    var currentAudioVolumn = 1;

    var me = this;


    this.iWord_init = function(){
        /*copyAudioForPassage();*/

        me.iWord_audio_bindEvent();
        me.iWord_bindEvent();
        me.iWord_reload();


        $(".scroll-iword").mCustomScrollbar({
            theme:"dark",
            axis:"yx"
        });

        function copyAudioForPassage(){
            var href_attr = $('#fileDownload').attr('href');

            if ( href_attr != undefined && href_attr.trim() != ''  ) {
                $('.lesson-show').find('.desc').addClass('passageAudio').attr('audio-src', href_attr);
            }
        }
    };

    this.iWord_bindEvent = function (){
        $('.desc').on('click', function(){
                me.iWord_loadWord($(this));
            }
        );
        $('.box-content').find('.content-show').find('.i-word').each(function(index, iword){
            $(iword).click(function(){
                if(! $(this).closest('.i-word-container').hasClass("selected")){
                    chooseList.push(index);
                    me.iWord_loadWord($(this));
                }
            });
        });

        $('.audio-iword').find('.prev').find('a').click(function(event){
            event.preventDefault();
//            me.iWord_previousWord();
            me.iWord_audio_startOver();
        });

        $('#fileDownload').unbind();
        $('#fileDownload').click(function(event){
            event.preventDefault();
            var fileSource = $(this).attr("href");
            me.iWord_downloadAudioFile(fileSource);
        });

        $('.scroll-iword').find('.i-word-group').each(function(index, iWordGroup){
            $(iWordGroup).select2({
                minimumResultsForSearch: Infinity
            }).on("change", function (e) {
                var $iWordGroup = $(this).closest('.i-word-group-container');
                me.iWord_loadWordFromGroup($(this).val(), $iWordGroup);
            });
        });

        me.iWord_bindEventForCommonContainer ();
    };

    this.iWord_loadWordFromGroup = function(word, $iWordGroup){
        if(word != null && word != undefined && word.trim() != ""){

            if(! $iWordGroup.hasClass("selected")){
                me.iWord_unselectedWord();
                $iWordGroup.addClass("selected");
            }

            var $optionSelected = $iWordGroup.find('select.i-word-group').find('option.i-word[title="' + word + '"]');

            var wordDisplay = $iWordGroup.find('select.i-word-group').find('option').eq(0).attr("title") + ": " + $optionSelected.attr("title");
            var audioSource = $optionSelected.attr("audio-src");

            me.iWord_loadWordData(wordDisplay, audioSource);
        } else {
            if($iWordGroup.hasClass("selected")){
                me.iWord_unselectedWord();
            }
        }
    };

    this.iWord_loadWord = function ($wordElement){
        me.iWord_unselectedWord();

        $wordElement.closest('.i-word-container').addClass("selected");

        var wordDisplay = $wordElement.text();
        var audioSource = $wordElement.attr('audio-src');

        me.iWord_loadWordData(wordDisplay, audioSource);
    };

    this.iWord_unselectedWord = function (){
        var $iWordContainerSelected = $('.box-content').find('.content-show').find('.i-word-container.selected');
        $iWordContainerSelected.removeClass("selected");

        me.iWord_clearData();

        if($iWordContainerSelected.hasClass('i-word-group-container')){
            $iWordContainerSelected.find('select.i-word-group').val("").trigger("change");
        }
    };

    this.iWord_clearData = function (){
        $('.box-content').find('.word').html(" ");
        me.iWord_audio_clearAudioData();
    };

    this.iWord_loadWordData = function(wordDisplay, audioSource){
        // load word
        $('.box-content').find('.word').html(wordDisplay);

        // load audio
        me.iWord_loadAudio(audioSource);
    };

    this.iWord_loadAudio = function (audioSource){
        me.iWord_audio_clearAudioData();

        if(audioSource != null && audioSource != undefined && audioSource.trim() != ""){
            me.iWord_audio_init(audioSource);
        }
    };

    this.iWord_audio_init = function (audioSource){
        var hasError = false;
        try{
            // add new audio
            var newAudioSource = getLiveURLWithCategory() + audioSource + "?" + getCloudFrontSignedPolicy();
//            newAudioSource = encodeURIComponent(newAudioSource);

            var $newAudio = $('<audio id="song"><source src="' + newAudioSource +'" type="audio/mpeg" />Your browser does not support the audio tag.</audio>');
            $('.audio-iword').append($newAudio);

            activeSong = $newAudio[0];

            activeSong.onloadedmetadata = function() {
                me.iWord_audio_loadAudioData();
            };

            // bind event for new audio
            $('#songPlayPause').click(function(){
                me.iWord_audio_playPause();
            });

            $('#songSlider').click(function(event){
                me.iWord_audio_setPosition(this, event);
            });

            $('#songPlayPause').click();
        }catch (e){
            hasError = true;
            console.dir("Have problem when load audio file!");
        }
    };

    this.iWord_audio_loadAudioData = function(){
        // update new audio
        activeSong = document.getElementById('song');

        if(activeSong != null && activeSong.duration != null && activeSong.duration >= 0){
            activeSong.addEventListener("timeupdate", me.iWord_audio_updateTime);
            activeSong.volume = currentAudioVolumn;

            $('.total-time').html(Math.floor(activeSong.duration / 60) + ":" + (Math.floor(activeSong.duration % 60) < 10 ? '0' : '') + Math.floor(activeSong.duration % 60));

        } else {
            $('.total-time').html("00:00");
        }

        $('.iwords-page').find('.box-content').find('.audio-iword').addClass("active");
    };

    this.iWord_downloadAudioFile = function(fileUrl) {
        var domain = document.referrer.split("/")[2],
            host = document.referrer.split("/")[0],
            fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1, fileUrl.lastIndexOf('.'));
        var urlCategory = host + "//" + domain + "/download.html?file=" + fileUrl + "&name=" + fileName;
        window.open(urlCategory);
    };

    this.iWord_audio_clearAudioData = function(){
        me.iWord_audio_stop();

        $('.audio-iword').find('#song').remove();

        $('#songPlayPause').unbind();
        $('#songSlider').unbind();

        $('.process-time').html("00:00");
        $('.total-time').html("00:00");
        $('.iwords-page').find('.box-content').find('.audio-iword').removeClass("active");

        document.getElementById('trackProgress').style.left = 0 + "px";
    };


    this.iWord_audio_startOver = function(){
        document.getElementById('trackProgress').style.left = 0 + "px";
        if(activeSong != null){
            activeSong.pause();
            document.getElementById('trackProgress').style.left = 0 + "px";
            activeSong.currentTime = 0;

            if(playingAudio()){
                activeSong.play();
            }
        }

        function playingAudio(){
            return $('#songPlayPause').hasClass("play") ? true : false;
        }
    };

    this.iWord_audio_playPause = function (){
        if(activeSong != null){
            if (activeSong.paused){
                me.iWord_audio_play();
            } else{
                me.iWord_audio_pause();
            }
        }
    };

    this.iWord_audio_play = function (){
        if(activeSong != null){
            activeSong.play();
            $('#songPlayPause').removeClass('pause');
            $('#songPlayPause').addClass('play');
        }

    };

    this.iWord_audio_pause = function (){
        if(activeSong != null){
            activeSong.pause();
            $('#songPlayPause').removeClass('play');
            $('#songPlayPause').addClass('pause');
        }
    };

    this.iWord_audio_stop = function (){
        if(activeSong != null){
            // stop audio
            me.iWord_audio_pause();

            activeSong = null;
        }
    };

    // BEGIN BIND EVENT FOR UPDATE TIME  //

    this.iWord_audio_updateTime = function (){
        if(activeSong != null){
            var currentSeconds = (Math.floor(activeSong.currentTime % 60) < 10 ? '0' : '') + Math.floor(activeSong.currentTime % 60);
            var currentMinutes = Math.floor(activeSong.currentTime / 60);
            $('.process-time').html(currentMinutes + ":" + currentSeconds);
            $('.total-time').html(Math.floor(activeSong.duration / 60) + ":" + (Math.floor(activeSong.duration % 60) < 10 ? '0' : '') + Math.floor(activeSong.duration % 60));

            var percentageOfSong = (activeSong.currentTime/activeSong.duration);
            var percentageOfSlider = document.getElementById('songSlider').offsetWidth * percentageOfSong;

            if(percentageOfSong == 1){
                // add class
                // set begin time
                $('#songPlayPause').removeClass('play');
                $('#songPlayPause').addClass('pause');
                activeSong.currentTime = 0;
            }

            document.getElementById('trackProgress').style.left = Math.round(percentageOfSlider) + "px";
        }
    };

    this.iWord_audio_setPosition = function (obj, e){
        var songSliderWidth = obj.offsetWidth;
        var evtobj = window.event ? event : e;

        var clickLocation = evtobj.offsetX;
        var percentage = (clickLocation/songSliderWidth);
        me.iWord_audio_setLocation(percentage);
    };

    this.iWord_audio_setLocation = function (percentage){
        activeSong.currentTime = activeSong.duration * percentage;
    };


    // BEGIN BIND EVENT FOR CHANGE VOLUME //

    this.iWord_audio_updateVolume = function (number){
        activeSong.volume = number / 100;
    };

    this.iWord_audio_changeVolume = function(number, direction){
        if(activeSong.volume >= 0 && direction == "down"){
            activeSong.volume = activeSong.volume - (number / 100);
        }
        if(activeSong.volume <= 1 && direction == "up"){
            activeSong.volume = activeSong.volume + (number / 100);
        }
        var percentageOfVolume = activeSong.volume / 1;
        var percentageOfVolumeSlider = document.getElementById('volumeMeter').offsetWidth * percentageOfVolume;
        document.getElementById('volumeStatus').style.width = Math.round(percentageOfVolumeSlider) + "px";
    };

    this.iWord_audio_bindEvent = function (){
        $('.volume-control').slider({
            orientation: 'vertical',
            range:       false,
            min: 0,
            max: 100,
            value:  100,
            stop: function( event, ui ) {
                var $this = $(this);
                var $audioElement = $('.icon-two');
                var volume  = ui.value;

                if(volume > 50){
                    $audioElement.removeClass("mid").removeClass("mute");
                    $audioElement.addClass("max");
                } else if(volume <= 50 && volume > 0){
                    $audioElement.removeClass("max").removeClass("mute");
                    $audioElement.addClass("mid");
                } else{
                    $audioElement.removeClass("max").removeClass("mid");
                    $audioElement.addClass("mute");
                }

                me.iWord_audio_setVolume(volume / 100);
            }
        });
    };

    this.iWord_audio_setVolume = function (percentage){
        if(activeSong != null && activeSong != undefined){
            activeSong.volume =  percentage;
        }

        currentAudioVolumn = percentage;
//        var percentageOfVolume = activeSong.volume / 1;
//        var percentageOfVolumeSlider = document.getElementById('volumeMeter').offsetWidth * percentageOfVolume;
//        document.getElementById('volumeStatus').style.width = Math.round(percentageOfVolumeSlider) + "px";
    };

    this.iWord_audio_setNewVolume = function (obj, e){
        var volumeSliderWidth = obj.offsetWidth;
        var evtobj = window.event? event: e;
        var clickLocation = evtobj.layerX - obj.offsetLeft;
        var percentage = (clickLocation/volumeSliderWidth);
        me.iWord_audio_setVolume(percentage);
    };

    // END BIND EVENT FOR CHANGE VOLUME //

    this.iWord_reload = function (){
        chooseList = [];
        me.iWord_audio_stop();
        me.iWord_unselectedWord();
        me.iWord_updateStatusTypeSetContainer();


        $('.box-content').find('.content-show').find('.i-word').each(function(index, iword){
            var currentType = $(iword).attr("setType");
            if ((typeSet != "A" && typeSet != "B") || typeSet == currentType) {
                $(iword).closest('.i-word-container').show();
            } else {
                $(iword).closest('.i-word-container').hide();
            }
        });

        $('.box-content').find('.content-show').find('.i-word-group-container').each(function(index, iwordGroup){
            var currentType = $(iwordGroup).attr("setType");
            if ((typeSet != "A" && typeSet != "B") || typeSet == currentType) {
                $(iwordGroup).show();
            } else {
                $(iwordGroup).hide();
            }
        });

        stretchOutDocument();
    };

    this.iWord_previousWord = function (){
//        if(chooseList.length > 1){
//            // get previous index
//            var previousIndex = chooseList[chooseList.length - 2];
//            var previousWord = $('.box-content').find('.content-show').find('.i-word').eq(previousIndex);
//
//            // remove last index of the choose list
//            chooseList.splice(chooseList.length - 1, 1);
//
//            // load new word
//            me.iWord_loadWord(previousWord);
//        }
    };

    // --------------------------------------- BEGIN COMMON FUNCTION  ------------------------------------------//
    this.iWord_bindEventForCommonContainer = function (){
        //1. Change type set
        $(".menu.type-set-container").find("li.set-type-button").each(function(index, setTypeButton){
            $(setTypeButton).unbind();
            $(setTypeButton).click(function(event){
                event.preventDefault();
                var setType = $(this).attr("setType");
                me.iWord_changeTypeSet(setType);
            });
        });

        //3. Change display type     \
        $(".display-type-container").find(".item").each(function(index, changeDisplayType){
            $(changeDisplayType).unbind();
            $(changeDisplayType).click(function(event){
                event.preventDefault();
                var typeDisplay = $(changeDisplayType).attr("displayType");
                me.iWord_changeDisplayType(typeDisplay);
            });
        });

        //4. Show flag/ all mode
        $(".display-flagged-container").find(".item").each(function(index, changeFlagged){
            $(changeFlagged).unbind();
            $(changeFlagged).click(function(event){
                event.preventDefault();
                var newFlaggedMode = $(this).attr("displayFlagged");
                me.iWord_changeFlaggedMode(newFlaggedMode);
            });
        });

        //5. Print
        $('#printButton').unbind();
        $('#printButton').click(function(event){
            event.preventDefault();
            me.iWord_print();
        });
    };

    this.iWord_changeTypeSet = function (setType){
        if(setType != typeSet){
            typeSet = setType;
            me.iWord_reload();
        }
    };

    this.iWord_changeDisplayType = function (typeDisplay){
        $('.menu-box').toggleClass('open');
    };

    this.iWord_changeFlaggedMode = function (newFlaggedMode){
        $('.menu-box').toggleClass('open');
    };

    this.iWord_print = function (){
        $('.menu-box').toggleClass('open');
    }


    this.iWord_updateStatusTypeSetContainer = function (){
        $(".type-set-container").find("li.set-type-button").each(function(index, setTypeButton){
            if($(setTypeButton).attr("setType") != typeSet){
                $(setTypeButton).removeClass("active");
            } else {
                $(setTypeButton).addClass("active");
            }
        });
    };

    // --------------------------------------- BEGIN COMMON FUNCTION  ------------------------------------------//
}


var iWord = new iWord();

function getIWord() {
    return iWord;
}

$(document).ready(function () {
    iWord.iWord_init();
});


