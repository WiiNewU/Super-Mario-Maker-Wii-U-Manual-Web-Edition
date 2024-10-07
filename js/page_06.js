"use strict";

var attention = null;

var touch_area_up = null;
var touch_area_down = null;

window.addEventListener("DOMContentLoaded", function() {
	attention = $('.attention');

	touch_area_up = $(".click06-01, .click06-02, .click06-03, .click06-04, .click06-05, .click06-06, .click06-07, .click06-08, .click06-09, .click06-10, .click06-11, .click06-12, .click06-13, .click06-14, .click06-15, .click06-16, .click06-17, .click06-18, .click06-19, .click06-20");
	touch_area_down = $(".click06-21, .click06-22, .click06-23, .click06-24, .click06-25, .click06-26, .click06-27");

	// ダイアログの閉じるボタンの設定
	setDialogCloseBtn();

	var hash = location.hash;
	if (hash.match(/^#open[0-1][0-9]/) || hash == "#open20") {
		attention[0].classList.add("hidden");
		attention[1].classList.remove("hidden");
		touch_area_up.addClass("mark-hidden");
		touch_area_down.removeClass("mark-hidden");
	}
	if (hash.match(/^#open2[1-9]/)) {
		attention[0].classList.remove("hidden");
		attention[1].classList.add("hidden");
		touch_area_up.removeClass("mark-hidden");
		touch_area_down.addClass("mark-hidden");
	}
});

// 光っているところと吹き出しを表示
var showAttentionAndTouchArea = function() {
	attention[0].classList.remove("hidden");
	attention[1].classList.remove("hidden");

	touch_area_up.removeClass("mark-hidden");
	touch_area_down.removeClass("mark-hidden");

};

// ダイアログの閉じるボタンの設定
var setDialogCloseBtn = function() {
	var dialog_btn_close = $(".btn-close");

	for (var i = 0; i < dialog_btn_close.length; i++) {
		dialog_btn_close[i].addEventListener("touchstart",
			function() {
				this.className = "btn-close select";
			});
		dialog_btn_close[i].addEventListener("touchend",
			function() {
				this.className = "btn-close";
			});
		dialog_btn_close[i].addEventListener("touchcancel",
			function() {
				this.className = "btn-close";
			});
		dialog_btn_close[i].addEventListener("click",
			function() {
				Cmn.setLocation('#image-view');
				showAttentionAndTouchArea();
				blur();
			});
		dialog_btn_close[i].addEventListener("keyup",
			function(e) {
				if (e.keyCode == 13) {
					Cmn.setLocation('#image-view');
					showAttentionAndTouchArea();
				}
			});
	}
};

window.onhashchange = function() {
	var hash = location.hash;
	if (hash.match(/^#open[0-1][0-9]/) || hash == "#open20") {
		attention[0].classList.add("hidden");
		attention[1].classList.remove("hidden");
		touch_area_up.addClass("mark-hidden");
		touch_area_down.removeClass("mark-hidden");
	}
	else if (hash.match(/^#open2[1-9]/)) {
		attention[0].classList.remove("hidden");
		attention[1].classList.add("hidden");
		touch_area_up.removeClass("mark-hidden");
		touch_area_down.addClass("mark-hidden");
	}
	else{
		//それ以外のページ内リンクの時 (目次ボタンからのアンカーも含む）
		showAttentionAndTouchArea();
	}

};
