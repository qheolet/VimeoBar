var listvideo = [121986760, 88797850, 122368314, 122271823, 122322480];
var global = [];
var ox = {}
var videoNo = 0;
var amountTime = 0;
var countp = 0;
var startFrom=0;

function addToGlobalObject(o, i) {
    amountTime = amountTime + o.duration;
    global[i] = o;
    $('.title').eq(i).html(o.title);
    if (i + 1 >= listvideo.length) {
        setTimeout(function() {
            putVideo(0);

            // console.log(global[0]);
            $.each($('[part-no]'), function(i, v) {

                var of = global[i];
                var oi = of.duration / amountTime;
                var ok = oi.toFixed(2) * 100;



                $(this).css('width', ok + '%');
                if (i > 0) {
                    var point = ((countp / 100) * $('.barto').width()) - 11;
                    $('.barto').append('<div class="point" point-no="' + i + '" style="left:' + point + 'px"></div>');
                } else {
                    $('.barto').append('<div class="point" point-no="0" style="left:0"></div>');
                }
                countp = countp + ok;

                // console.log($(this).offset().left);
            });



            // $('.barto').fadeIn('fast');




        }, 1000);
    }
}

function setInfoForEvent() {
    ox.player = $('iframe');
    ox.url = $('iframe').attr('src').split('?')[0];
    // console.log(ox);
}


function notificationPlus(t) {
	// console.log(startFrom+t/global[videoNo].duration/amountTime*100)
	 $('.lineCounter').css('width', (startFrom+(global[videoNo].duration/amountTime)*(t/global[videoNo].duration*100)) + '%');
}


function notificationBarSet() {
    var space = 0;
    for (var i = 0; i < videoNo; i++) {
        var of = global[i];
        var oi = of.duration / amountTime;
        var ok = oi.toFixed(2) * 100;
        space = space + (ok);
    };
	startFrom = space;
    $('.lineCounter').css('width', space + '%');
}



// function notificationBar(t){
// 	
// 	var completeWidth = $('.barto').width();
// 	var videoLong = global[videoNo].duration;




// }

function putVideo(h) {
    videoNo = h;
    $('.iframe').html(global[h].html);
    setInfoForEvent();
    $('.point').css('backgroundImage', 'url(images/miball.png)');
    $('.point').eq(h).css('backgroundImage', 'url(images/bball.png)');
    notificationBarSet();
}

$.each(listvideo, function(index, val) {
    // $('.videos').children('ul').append('<li vimeo-id="' + val + '" class="item-' + index + '"><img  width="200" src="images/loading.gif"><p class="title"></p></li>');

    $('.barto').append('<div part-no="' + index + '" class="part item-' + index + '"><p class="title"></p></div>');


    if (index !== 0) {
        var autoload = true;
    } else {
        var autoload = false;
    }

    $.get('https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/' + val, {
        'maxwidth': '1000px',
        api: true,
        autoplay: autoload
    }, function(d) {
        addToGlobalObject(d, index);
    });
});


$(document).ready(function() {
    function main() {

        $('[part-no]').click(function(event) {
            putVideo(parseInt($(this).attr('part-no')));
            // console.log(parseInt($(this).attr('part-no')));
        });



        $('.point').click(function(event) {
            putVideo(parseInt($(this).attr('point-no')));
            // console.log(parseInt($(this).attr('part-no')));
        });

        // Listen for messages from the player
        if (window.addEventListener) {
            window.addEventListener('message', onMessageReceived, false);
        } else {
            window.attachEvent('onmessage', onMessageReceived, false);
        }

        // Handle messages received from the player
        function onMessageReceived(e) {
            var data = JSON.parse(e.data);

            switch (data.event) {
                case 'ready':
                    onReady();
                    break;

                case 'playProgress':
                    onPlayProgress(data.data);
                    break;

                case 'pause':
                    onPause();
                    break;

                case 'finish':
                    onFinish();
                    break;
            }
        }

        // Helper function for sending a message to the player
        function post(action, value) {
            var data = {
                method: action
            };

            if (value) {
                data.value = value;
            }

            var message = JSON.stringify(data);
            ox.player[0].contentWindow.postMessage(data, ox.url);
        }

        function onReady() {
            // $('.status').text('ready');

            post('addEventListener', 'pause');
            post('addEventListener', 'finish');
            post('addEventListener', 'playProgress');
        }

        function onPause() {
            // $('.status').text('paused');
        }

        function onFinish() {
            // $('.status').text('finished');
            videoNo++;
            if (videoNo < global.length) {
                putVideo(videoNo);
            }

            // post('play',ox.url);

        }

        function onPlayProgress(data) {
            // $('.status').text(data.seconds + 's played');
            notificationPlus(data.seconds);

        }
    }

    setTimeout(main, 2000);
});