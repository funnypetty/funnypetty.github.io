;(function () {
	"use strict";
	
	
	var tag = document.createElement('script');
	tag.src = "//www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
	var doc = document,
		contentDiv = doc.getElementById( 'body' ),
		page = 1,
		id = 0,
		url = '/includes/newest.html';

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
				contentDiv.insertAdjacentHTML( 'beforeend', xhttp.responseText );
				
				//Only play video when it's visible
				var ytIframes = doc.getElementsByClassName( 'yt-content' );
				for( var i = 0; i < ytIframes.length; i++ ) {
					
					//Get iframe
					var _this = ytIframes[i];
					id++;
					_this.setAttribute( 'id', 'yt-iframe-' + id );
					
					//Youtube API 
					var player;
					var iId = 'yt-iframe-' + id;
					function onYouTubeIframeAPIReady() {
						player = new YT.Player( iId, {
							events: {
								'onReady': onPlayerReady
							}
						});
					}
					
					function onPlayerReady( event ) {
						console.log( 'a' );
						event.target.playVideo();
					}
				}
			}
		};
		
		xhttp.open( "GET", url, true );
		xhttp.send();
	}
})( window );