"use strict";

var attention = null;
var touch_area = null;

window.addEventListener("DOMContentLoaded", function() {

	// 吹き出し
	attention = $('#attention');

	// タッチエリア
	touch_area = $(".click01-01, .click01-02, .click01-03, .click01-04, .click01-05, .click01-06, .click01-07, .click01-08, .click01-09, .click01-10, .click01-11, .click01-12, .click01-13, .click01-14, .click01-15");

	// ダイアログの閉じるボタンの設定
	setDialogCloseBtn();

	var hash = location.hash;
	if (hash.match(/^#open[0-9]{2,}/)) {
		attention.addClass("hidden");
		touch_area.addClass("mark-hidden");
	}
});
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

window.onhashchange = function() {
	var hash = location.hash;
	if (hash.match(/^#open[0-9]{2,}/)) {
		attention.addClass("hidden");
		touch_area.addClass("mark-hidden");
	}
	else
	{
		//それ以外のページ内リンクの時 (目次ボタンからのアンカーも含む）
		showAttentionAndTouchArea();
	}
};

window.addEventListener("load", function() {

	var links = [
		$("#step-01-link"),
		$("#step-02-link"),
		$("#step-03-link")
	];

	// アニメのパラメータ
	var start_scaleX = 0;
	var start_scaleY = 0;
	var end_scaleX = 1;
	var end_scaleY = 1;
	var end_frame = 10;

	// アイコンをポップアップ
	animPopup(links, start_scaleX, start_scaleY, end_scaleX, end_scaleY, end_frame, 0);
});

// ページ表示時のアニメ　飛び出すやつ
var animPopup = function(targetElement, startScaleX, startScaleY, endScaleX, endScaleY, endFrame) {
	var start_scaleX = startScaleX;
	var start_scaleY = startScaleY;
	var end_scaleX = endScaleX;
	var end_scaleY = endScaleY;
	var end_frame = endFrame;

	var popup = function(targetElement, startScaleX, startScaleY, endScaleX, endScaleY, endFrame, currentFrame, index) {
		if (index == targetElement.length) {
			return;
		}

		if (currentFrame == 0) {
			targetElement[index].css("visibility", "visible");
		}

		var currentRate = Math.sin(Math.PI * 0.5 * currentFrame / endFrame);
		var nowX = (endScaleX - startScaleX) * currentRate + startScaleX;
		var nowY = (endScaleY - startScaleY) * currentRate + startScaleY;

		// 終了条件を満たしている場合は、目標位置に移動し終了
		if (currentFrame >= endFrame || endFrame == 0) {
			currentFrame = 0;
			Cmn.log(nowX)
			targetElement[index].css({
				"-webkit-transform": "scale(" + nowX + "," + nowY + ")"
			});
			targetElement[index].css({
				"opacity": 1
			});

			// AC化されてしまう問題の対策
			// style属性にscaleやopactityの設定が残ってしまうので意図的に削除
			targetElement[index].removeAttr("style");
			setTimeout(function() {
				popup(targetElement, start_scaleX, start_scaleY, end_scaleX, end_scaleY, end_frame, currentFrame, index + 1);
			}, 16);
			return;
		}

		targetElement[index].css({
			"-webkit-transform": "scale(" + nowX + "," + nowY + ")"
		});
		targetElement[index].css({
			"opacity": (currentFrame / endFrame)
		});

		// 16ms後に再実行（疑似60fps）
		setTimeout(function() {
			popup(targetElement, startScaleX, startScaleY, endScaleX, endScaleY, endFrame, currentFrame + 1, index);
		}, 16);
	};

	popup(targetElement, start_scaleX, start_scaleY, end_scaleX, end_scaleY, end_frame, 0, 0);
};
