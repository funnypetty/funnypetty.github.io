;(function () {
	"use strict";
	
	var doc = document;
	var contentDiv = doc.getElementById( 'body' );
	var loadmoreBtn = doc.getElementById( 'more' );
	var newestUrl = 'pages/newest.html';
	
	//Automatic load newest post
	window.onload = function() {
		getMorePost( newestUrl, contentDiv );
	}
	
	
	//Load more post when click on loadmoreBtn
	loadmoreBtn.addEventListener( 'click', function() {
		//Set loading text
		this.innerHTML = 'Đang tải...';
		this.setAttribute( 'class', 'loading' );
		
		//Declare vars
		var newestPage = this.getAttribute( 'data-newest-page' );
		newestPage = parseInt( newestPage );
		
		//When loaded all post
		if( newestPage === 0 ) {
			this.innerHTML = 'Đã tải hết !';
			return;
		}
		
		var url = 'pages/page-' + newestPage + '.html';
		getMorePost( url, contentDiv );
		
		//Change page
		this.setAttribute( 'data-newest-page', newestPage - 1 );
		
		//Change loading text
		this.innerHTML = 'Xem thêm...';
		this.setAttribute( 'class', '' );
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
		xhttp.open( "GET", url, true );
		xhttp.send();
		
		//Append post
		xhttp.onreadystatechange = function() {
			if ( this.readyState == 4 && this.status == 200 ) {
				contentDiv.insertAdjacentHTML( 'beforeend', xhttp.responseText );
			}
		};
	}
	
})( window );