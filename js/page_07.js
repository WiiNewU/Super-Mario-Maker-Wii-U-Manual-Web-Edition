"use strict";

var attention = null;

var touch_area_up = null;
var touch_area_down = null;

window.addEventListener("DOMContentLoaded", function() {
	attention = $('.attention');
	touch_area_up = $(".click07-01, .click07-02, .click07-03, .click07-04, .click07-05");
	touch_area_down = $(".click07-11, .click07-12, .click07-13, .click07-14, .click07-15");

	// ダイアログの閉じるボタンの設定
	setDialogCloseBtn();

	var hash = location.hash;
	if (hash.match(/^#open0[1-5]/)) {
		attention[0].classList.add("hidden");
		attention[1].classList.remove("hidden");
		touch_area_up.addClass("mark-hidden");
		touch_area_down.removeClass("mark-hidden");
	}
	if (hash.match(/^#open0[6-9]/) || hash == "#open10") {
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
	if (hash.match(/^#open0[1-5]/)) {
		attention[0].classList.add("hidden");
		attention[1].classList.remove("hidden");
		touch_area_up.addClass("mark-hidden");
		touch_area_down.removeClass("mark-hidden");
	}
	else if (hash.match(/^#open0[6-9]/) || hash == "#open10") {
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
