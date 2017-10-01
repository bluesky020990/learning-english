function Audio_Component() {
    var me = this;
    var activeAudio = null;


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

            var audioSource = $(audioComponent).attr("audioSource");
            var offset = $(audioComponent).offset();
            var $audioComponent = me.generateAudioComponent();

            activeAudio = new Audio(audioSource);

            activeAudio.onloadedmetadata = function() {
                me.audio_loadAudioData(this);
            };

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
                'top': offset.top,
                'left': offset.left + $(audioComponent).width() / 2
            });

            $(audioComponent).addClass("is-playing");

            me.audio_played();
        }
    };

    this.audio_loadAudioData = function(activeAudio){
        if(activeAudio != null && activeAudio.duration != null && activeAudio.duration >= 0){

            activeAudio.addEventListener("timeupdate", me.audio_updateTime);

            activeAudio.volume = 1;

            $('.audio-component-player').find('.process-time').html("00:00");
            $('.audio-component-player').find('.total-time').html(Math.floor(activeAudio.duration / 60) + ":" + (Math.floor(activeAudio.duration % 60) < 10 ? '0' : '') + Math.floor(activeAudio.duration % 60));
        } else {
            $('.audio-component-player').find('.process-time').html("00:00");
            $('.audio-component-player').find('.total-time').html("00:00");
        }
    };

    this.audio_updateTime = function (){
        if(activeAudio != null){
            var currentSeconds = (Math.floor(activeAudio.currentTime % 60) < 10 ? '0' : '') + Math.floor(activeAudio.currentTime % 60);
            var currentMinutes = Math.floor(activeAudio.currentTime / 60);

            $('.audio-component-player').find('.process-time').html(currentMinutes + ":" + currentSeconds);

            var percentageOfSong = (activeAudio.currentTime/ activeAudio.duration);
            var percentageOfSlider = $('.line-song').width() * percentageOfSong;
            $('.track-progress').css({left: Math.round(percentageOfSlider) + "px" });

            if(percentageOfSong == 1){
                $('.audio-component-player').find('.audio-play-button').removeClass("playing");
                activeAudio.currentTime = 20;
            }
        }
    };




    this.generateAudioComponent = function (){
        $('.audio-component-player').remove();

        var audioComponent = new Array();
        audioComponent.push('<div class="audio-component-player">');
        audioComponent.push(    '<div class="audio-controller"><span class="audio-play-button"></span></div>');
        audioComponent.push(    '<div class="audio-player">');
        audioComponent.push(        '<div class="process-time">00:00</div>');
        audioComponent.push(        '<div class="song-slider"><div class="line-song"><div class="track-progress"></div></div></div>');
        audioComponent.push(        '<div class="total-time">00:00</div>');
        audioComponent.push(    '</div>');
        audioComponent.push('</div>');

        var $audioComponent = $(audioComponent.join(""));
        $('body').append($audioComponent);

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
            activeAudio.currentTime = activeAudio.duration * percentage;
        }
    };

}

var audioComponent = new Audio_Component();