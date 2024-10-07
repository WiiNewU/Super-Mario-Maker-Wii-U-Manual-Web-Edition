"use strict";

var attention = null;
var touch_area = null;

// 光っているところと吹き出しを表示
var showAttentionAndTouchArea = function() {
	attention.removeClass("hidden");
	touch_area.removeClass("mark-hidden");
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

window.addEventListener("DOMContentLoaded", function() {

	attention = $('#attention');

	// タッチエリア
	touch_area = $(".click04-01, .click04-02, .click04-03, .click04-04, .click04-05, .click04-06, .click04-07, .click04-08, .click04-09, .click04-10");

	// ダイアログの閉じるボタンの設定
	setDialogCloseBtn();

	var hash = location.hash;
	if (hash.match(/^#open[0-9]{2,}/)) {
		attention.addClass("hidden");
		touch_area.addClass("mark-hidden");
	}
});

window.onhashchange = function() {
	var hash = location.hash;
	if (hash.match(/^#open[0-9]{2,}/)) {
		attention.addClass("hidden");
		touch_area.addClass("mark-hidden");
	}
	else{
		//それ以外のページ内リンクの時 (目次ボタンからのアンカーも含む）
		showAttentionAndTouchArea();
	}

};
