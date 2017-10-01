function Audio_Component() {
    var me = this;
    var ACTIVE_AUDIO_ID = "active-audio-play";
    var activeAudio = null;
    var activeAudio_startTime = null;
    var activeAudio_endTime = null;


    this.initComponent = function(){
        me.audio_bindEvent();
    };


    this.audio_bindEvent = function(){
        $('.audio-component').click(function(){
            me.audio_loadAudio(this);
        })
    };


    this.audio_loadAudio = function (audioComponent){
        if (! $(audioComponent).hasClass("is-playing")){
            me.audio_stopped();

            me.generateAudioComponent($(audioComponent).attr("audioSource"), $(audioComponent).offset().top, $(audioComponent).offset().left + $(audioComponent).width() / 2);

            activeAudio = document.getElementById(ACTIVE_AUDIO_ID);

            activeAudio.onloadedmetadata = function() {
                activeAudio_startTime = getTimeByString($(audioComponent).attr("starTime"));
                activeAudio_endTime = getTimeByString($(audioComponent).attr("endTime"));

                me.audio_loadAudioData();

                $('.audio-play-button').click();
            };
        }

        function getTimeByString(timeByString){
            if(timeByString != null && timeByString != undefined && timeByString.trim() != "" && timeByString.trim() != "-1"){
                if(timeByString.indexOf(":") > -1){
                    return parseInt(timeByString.split(":")[0].trim()) * 60 + parseInt(timeByString.split(":")[1].trim());
                } else {
                    return parseInt(timeByString.trim());
                }
            } else {
                return null;
            }
        }
    };

    this.audio_loadAudioData = function(){
        activeAudio = document.getElementById(ACTIVE_AUDIO_ID);

        if(activeAudio != null && activeAudio.duration != null && activeAudio.duration >= 0){
            if(activeAudio_startTime == null){
                activeAudio_startTime = 0;
            }

            if(activeAudio_endTime == null || (activeAudio_endTime < activeAudio_startTime) ){
                activeAudio_endTime = activeAudio.duration;
            }

            activeAudio.addEventListener("timeupdate", me.audio_updateTime);
            activeAudio.volume = 1;
            activeAudio.currentTime = activeAudio_startTime;

            $('.audio-component-player').find('.process-time').html("0:00");
            $('.audio-component-player').find('.total-time').html(convertSecondToString(activeAudio_endTime - activeAudio_startTime));
        } else {
            $('.audio-component-player').find('.process-time').html("0:00");
            $('.audio-component-player').find('.total-time').html("0:00");
        }
    };

    this.audio_updateTime = function (){
        activeAudio = document.getElementById(ACTIVE_AUDIO_ID);

        if(activeAudio != null){
            var currentTime = activeAudio.currentTime - activeAudio_startTime;
            var duration = activeAudio_endTime - activeAudio_startTime;

            $('.audio-component-player').find('.process-time').html(convertSecondToString(currentTime));

            var percentageOfSong = (currentTime/ duration);
            var percentageOfSlider = $('.audio-component-player').find('.line-song').width() * percentageOfSong;


            if(percentageOfSong >= 1){
                $('.audio-component-player').find('.audio-play-button').removeClass("playing");
                activeAudio.currentTime = activeAudio_startTime;
                activeAudio.pause();
            }

            $('.audio-component-player').find('.track-progress').css({left: Math.round(percentageOfSlider) + "px" });
        }
    };

    function convertSecondToString(second){
        return Math.floor(second / 60) + ":" + (Math.floor(second % 60) < 10 ? '0' : '') + Math.floor(second % 60)
    }




    this.generateAudioComponent = function (audioSource, cx, cy){
        $('.audio-component-player').remove();

        var audioComponent = new Array();
        audioComponent.push('<div class="audio-component-player">');
        audioComponent.push(    '<div class="audio-controller"><span class="audio-play-button"></span></div>');
        audioComponent.push(    '<div class="audio-player">');
        audioComponent.push(        '<div class="process-time">0:00</div>');
        audioComponent.push(        '<div class="song-slider"><div class="line-song"><div class="track-progress"></div></div></div>');
        audioComponent.push(        '<div class="total-time">0:00</div>');
        audioComponent.push(    '</div>');
        audioComponent.push(    '<div class="audio-track"><audio id="' + ACTIVE_AUDIO_ID +'"><source src="' + audioSource +'" type="audio/mpeg" />Your browser does not support the audio tag.</audio></div>');
        audioComponent.push('</div>');

        var $audioComponent = $(audioComponent.join(""));
        $('body').append($audioComponent);

        $audioComponent.find('.audio-play-button').unbind("click").click(function(){
            if ($(this).hasClass("playing")){
                me.audio_paused();
            } else {
                me.audio_played();
            }
        });

        $audioComponent.find('.line-song').unbind("click").click(function(event){
            me.audio_setPosition(this, event);
        });

        $audioComponent.css({
            'top': cx,
            'left': cy
        });

        $(audioComponent).addClass("is-playing");

        return $audioComponent;
    };

    this.audio_played = function(){
        if(activeAudio != null){
            activeAudio.play();
            $('.audio-component-player').find('.audio-play-button').addClass("playing");
        }
    };


    this.audio_paused = function (){
        if(activeAudio != null){
            activeAudio.pause();
            $('.audio-component-player').find('.audio-play-button').removeClass("playing");
        }
    };

    this.audio_stopped = function (){
        if(activeAudio != null){
            activeAudio.pause();
            activeAudio = null;

            $('.audio-component.is-playing').removeClass("is-playing");
            $('.audio-component-player').remove();
        }
    };

    this.audio_setPosition = function (obj, e){
        var songSliderWidth = obj.offsetWidth;
        var evtobj = window.event ? event : e;

        var clickLocation = evtobj.offsetX;
        var percentage = (clickLocation/songSliderWidth);
        me.audio_setLocation(percentage);
    };

    this.audio_setLocation = function (percentage){
        if(activeAudio != null){
            activeAudio.currentTime = activeAudio_startTime + (activeAudio_endTime - activeAudio_startTime) * percentage;
        }
    };

}

var audioComponent = new Audio_Component();