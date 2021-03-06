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
		navigationDiv = doc.getElementById( 'navigation' ),
		page = 1,
		url = '/includes/newest.html',
		naviUrl = '/includes/navigation.html';

	//Load navigation
	ajax( naviUrl, function( response ) {
		navigationDiv.innerHTML = response;
	} )
	
	//Load newest
	getMorePost( url, contentDiv );
	
	//Load more post when click on loadmoreBtn
	doc.addEventListener( 'click', function( e ) {
		if( e.target.id !== 'more' ) {
			return;
		}
		
		var _this = e.target;
		
		//Set loading text
		_this.innerHTML = 'Đang tải...';
		_this.setAttribute( 'class', 'loading' );
		
		//Declare vars
		var newestPage = _this.getAttribute( 'data-newest-page' );
		newestPage = parseInt( newestPage );
		
		//When loaded all post
		if( newestPage === 0 ) {
			_this.innerHTML = 'Đã tải hết !';
			return;
		}
		
		var url = 'pages/page-' + newestPage + '.html';
		getMorePost( url, contentDiv );
		
		//Change page
		_this.setAttribute( 'data-newest-page', newestPage - 1 );
		
		//Change loading text
		_this.innerHTML = 'Xem thêm...';
		_this.setAttribute( 'class', '' );
		
		//pushState for SEO
		page++;
		history.pushState( '', '', '/page-' + page );
	} )
	
	function getMorePost( url, contentDiv ) {
		ajax( url, function( response ) {
			contentDiv.insertAdjacentHTML( 'beforeend', response );
			window.onYouTubeIframeAPIReady();
			
		} )
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

