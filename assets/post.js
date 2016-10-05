window.addEventListener('scroll', checkVisible, false);
window.addEventListener('resize', checkVisible, false);

function checkVisible( event ) {
	var fraction = 0.65, //65% fully visible
	players = document.querySelectorAll( '.yt-content' );
	for( var i = 0; i < players.length; i++ ) {
		var player = players[i],
			x = player.offsetLeft, 
			y = player.offsetTop, 
			w = player.offsetWidth, 
			h = player.offsetHeight, 
			r = x + w, //right
			b = y + h, //bottom
			visibleX, visibleY, visible;

		visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - x, r - window.pageXOffset));
		visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - y, b - window.pageYOffset));

		visible = visibleX * visibleY / (w * h);
		if (visible > fraction) { //Visible
			player.contentWindow.postMessage(JSON.stringify({
				"event": "command",
				"func": 'playVideo'
			}), "*");
		} 
		else { //Hidden
			player.contentWindow.postMessage(JSON.stringify({
				"event": "command",
				"func": 'pauseVideo'
			}), "*");
		}
	}
}

//Youtube API
window.onYouTubeIframeAPIReady = function() {
    var players = document.querySelectorAll( '.yt-content' );
    for (var i = 0; i < players.length; i++) {
        new YT.Player(players[i], {
            playerVars: {
                'autoplay': 0,
				'rel': 0,
            },
            videoId: players[i].dataset.id,
			events: {
				'onReady': checkVisible,
				'onStateChange': checkVisible
			}
        });
    }
}

//Main script
;(function () {
	"use strict";
	var doc = document,
		contentDiv = doc.getElementById( 'body' ),
		url = '/posts/' + getFileName() + '.html';
		
	//Load content based on fileName
	ajax( url, function( response ) {
		contentDiv.insertAdjacentHTML( 'beforeend', response );
		window.onYouTubeIframeAPIReady();
	})
	
	function getFileName() {
		var fileNameArr = location.href.split( '#' );
		fileNameArr = fileNameArr.filter( function( n ) {return n != "" } );
		var fileName = fileNameArr[fileNameArr.length - 1];
		return fileName;
	}
	
	function ajax( url, callback ) {
		var xhttp;
		
		//Send AJAX
		if ( window.XMLHttpRequest ) {
			xhttp = new XMLHttpRequest();
		} 
		else {
			// code for IE6, IE5
			xhttp = new ActiveXObject( "Microsoft.XMLHTTP" );
		}
		
		//Append post
		xhttp.onreadystatechange = function() {
			if ( this.readyState == 4 && this.status == 200 ) {
				callback( xhttp.responseText );
			}
		};
		
		xhttp.open( "GET", url, true );
		xhttp.send();
	}
})( window );