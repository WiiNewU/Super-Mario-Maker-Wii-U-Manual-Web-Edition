"use strict";


// 通信状況（online/offline）に応じてコンテンツを切り替える
function updateConnectionStatus(connected) {
	if (connected) {
		var elements = document.getElementsByClassName("online-block");
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = "block";
		}
		elements = document.getElementsByClassName("offline-block");
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = "none";
		}
		elements = document.getElementsByClassName("online-inline");
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = "inline";
		}
		elements = document.getElementsByClassName("offline-inline");
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = "none";
		}
	} else {
		var elements = document.getElementsByClassName("online-block");
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = "none";
		}
		elements = document.getElementsByClassName("offline-block");
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = "block";
		}
		elements = document.getElementsByClassName("online-inline");
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = "none";
		}
		elements = document.getElementsByClassName("offline-inline");
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = "inline";
		}
	}
};

window.addEventListener('DOMContentLoaded', function(e) {
	if (isOnLine()) {
		updateConnectionStatus(true);
	} else {
		updateConnectionStatus(false);
	}
}, false);

window.addEventListener('onLine', function(e) {
	updateConnectionStatus(true);
}, false);

window.addEventListener('offLine', function(e) {
	updateConnectionStatus(false);
}, false);


var isOnLine = function() {
	return navigator.onLine;
};

// デバッグ機能 PCブラウザでオンラインオフラインを切り替える
// Xキー：オンラインモード Zキー：オフラインモード
// 使う人は以下のコメントアウトを外してください

/*
var changeOnlineMode = function(key)
{
    if(key == 88){ updateConnectionStatus(true); }
    if(key == 90){ updateConnectionStatus(false); }

}

document.onkeyup = function (e)
{
    var key_code = e.keyCode;
    changeOnlineMode(key_code);
}
*/
