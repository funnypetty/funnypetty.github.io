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
			statusEl.innerHTML = 'Vui lòng điền đầy đủ các trường !!';
			window.setTimeout( function() {
				statusEl.innerHTML = '';
			}, 5000 );
			return;
		}
		
		//Combine & replace html
		var html = doc.getElementById( data.type + '-html' ).innerHTML.trim();
		
		var videoId = data.link.split( '=' )[1] ;
		var link = data.type == 'picture' ? data.link : videoId;
		html = html.replace( /{@caption}/g, data.caption );
		html = html.replace( '{@link}', link );
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
	
} ) ();