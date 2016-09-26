;( function() {
	"use strict";
	
	//Get El
	var doc = document;
	var btn = doc.getElementById( 'get-code' );
	var codeBox = doc.getElementById( 'result-box' );
	var statusEl = doc.getElementById( 'status' );
	var captionTxt = doc.getElementById( 'caption' );
	var linkTxt = doc.getElementById( 'link' );
	var authorTxt = doc.getElementById( 'author' );
	var videoTxt = doc.getElementById( 'type-video' );
	var pictureTxt = doc.getElementById( 'type-picture' );
	
	//When click on Get Code button
	btn.onclick = function() {
		//Get data
		var video = videoTxt.checked ;
		var picture = pictureTxt.checked ;
		var data = {
			'caption': captionTxt.value,
			'link': linkTxt.value,
			'author': authorTxt.value,
			'type': video ? 'video' : 'picture'
		};
		
		//Validate
		if( hasNull( data ) ) {
			postStatus( 'Vui lòng điền đủ các trường !!' );
			return;
		}
		
		//Combine & replace html
		var html = doc.getElementById( data.type + '-html' ).innerHTML.trim();
		var youtubeQuery = data.link.split( '?' )[1];
		
		//Check if link of video is of youtube
		if( data.link.indexOf( 'youtube.com' ) === -1 && data.type == 'video' ) {
			postStatus( 'Link của video không phải là youtube' );
			return;
		}
		
		//If link doesn't contain id of video
		if( !youtubeQuery && data.type == 'video' ) {
			postStatus( 'Link của video không hợp lệ' );
			return;
		}
		var videoId = getQueryParams( youtubeQuery ).v;
		if( !videoId && data.type == 'video' ) {
			postStatus( 'Link của video không hợp lệ' );
			return;
		}
		
		var link = data.type == 'picture' ? data.link : videoId;
		html = html.replace( /{@caption}/g, data.caption );
		html = html.replace( /{@link}/g, link );
		html = html.replace( '{@author}', data.author );
		
		codeBox.innerHTML = html;
	}
	
	//Select all text in codebox
	codeBox.onclick = function() {
		this.setSelectionRange( 0, this.value.length );
	}
	
	//Fn validate
	function hasNull(target) {
		for (var member in target) {
			if ( target[member] == '' || target[member] == 'http://' )
				return true;
		}
		return false;
	}
	
	//Fn show status
	function postStatus( status ) {
		statusEl.innerHTML = status;
		codeBox.innerHTML = '';
		window.setTimeout( function() {
			statusEl.innerHTML = '';
		}, 5000 );
	}

	//Fn get param
	function getQueryParams(qs) {
		qs = qs.split('+').join(' ');
		var params = {},
			tokens,
			re = /[?&]?([^=]+)=([^&]*)/g;
		while (tokens = re.exec(qs)) {
			params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
		}
		return params;
	}
	
} ) ();