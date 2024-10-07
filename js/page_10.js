"use strict";

var init = function() {

	var ones_place = $("#ones-place");
	var tens_place = $("#tens-place");
	var hundreds_place = $("#hundreds-place");

	var start_count = 179;
	var end_count = 0;

	// スタッフロールアニメ中にキー入力すると処理落ちするので無効化
	changeLockInput(true);
	// TIMEカウント
	startCountTime(hundreds_place, tens_place, ones_place, start_count, end_count);

	// アニメ開始
	marioInAnim($("#mario"), -40, 0, 430, 0, 240, 0);
};

// キー入力無効化
var changeLockInput = function(isLock) {
	if (isLock) {
		Cmn.log("lock");
		window.onkeydown = function(e) {
			e.preventDefault();
		};
	} else {
		Cmn.log("unlock");
		window.onkeydown = function(e) {};
	}
};

// seek 共通
var seek = function(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, currentFrame, onEndFunc, onPlayFunc) {

	var currentRate = currentFrame / endFrame;
	var nowX = (endPosX - startPosX) * currentRate + startPosX;
	var nowY = (endPosY - startPosY) * currentRate + startPosY;
	targetElement.css({
		"-webkit-transform": "translate(" + nowX + "px," + nowY + "px)"
	});

	if (typeof onPlayFunc === 'function') {
		// フレーム指定で処理をフック
		onPlayFunc(currentFrame);
	}

	if (currentFrame >= endFrame || endFrame == 0) {
		if (typeof onEndFunc === 'function') {
			// 終了時に処理をフック
			onEndFunc();
		}
		return;
	}

	// 16ms後に再実行（疑似60fps）
	window.webkitRequestAnimationFrame( function() {
		seek(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, currentFrame + 1, onEndFunc, onPlayFunc);
	});
};

var marioInAnim = function(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, currentFrame) {

	var onEnd = function() {
		staffNameSeekAnim($("#staff-name"), 0, 480, 0, -7480, 10000, 0);
		groundSeekAnim($("#ground"), 0, 0, -8000, 0, 10000, 0);
	};

	seek(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, 0, onEnd);
};

var marioOutAnim = function(targetElement) {
	targetElement.css({
		"opacity": "0"
	});
};


// スタッフ
var staffNameSeekAnim = function(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, currentFrame) {
	seek(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, 0);
};

// 地面
var groundSeekAnim = function(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, currentFrame) {
	var onPlay = function(frame) {
		var start_frame = 691;
		if (frame === endFrame - start_frame) {
			castleSeekAnim($("#castle"), 0, 0, -553, 0, start_frame, 0);
		}
　if(frame === 0){
	  backObjSeekAnim($("#mountain-00"), 0, 0, -1200, 0, 1500, 0);
　}
		if(frame === 500){
			backObjSeekAnim($("#wood-00"), 0, 0, -1200, 0, 1500, 0);
		}
		if(frame === 750){
			backObjSeekAnim($("#cloud-00"), 0, 0, -1200, 0, 1500, 0);
		}
		if(frame === 1000){
			backObjSeekAnim($("#cloud-01"), 0, 0, -1200, 0, 1500, 0);
		}
		if(frame === 1250){
			backObjSeekAnim($("#grass-00"), 0, 0, -1200, 0, 1500, 0);
		}
	};
	seek(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, 0, null, onPlay);
};

// 城
var castleSeekAnim = function(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, currentFrame) {
	var onEnd = function() {
		marioOutAnim($("#mario"));
		window.webkitRequestAnimationFrame(
			function() {
				flagSeekAnim($("#flag"), 0, 0, 0, -36, 60, 0);
			}
		);
	};
	seek(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, 0, onEnd);
};

// 山とか木とか背景の絵
var backObjSeekAnim = function(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, currentFrame) {
	var count = 0;
	// 山ループ
	var onEnd = function() {
		count++;
		if (count > 5) {
			return;
		}
		seek(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, 0, onEnd);
	};

	seek(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, 0, onEnd);
};

// 旗
var flagSeekAnim = function(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, currentFrame) {
	var onEnd = function() {
		// 花火表示
		showfireWorks();
		switch (EpubInfo.region) {
			case "JPN":
 			countScore(19850913);
			break;
			case "EUR":
			countScore(13091985);
			break;
			case "USA":
			countScore(09131985);
			break;
		}
	};

	seek(targetElement, startPosX, startPosY, endPosX, endPosY, endFrame, 0, onEnd);
}

// Time　カウント開始
var startCountTime = function(hundredsPlace, tensPlace, onesPlace, currentCount, endCount) {
	var start_count = currentCount;

	// Time 初期化
	var initTime = function(startCount) {
		changeTimeImg(startCount);
	};

	// 画像変更
	var changeTimeImg = function(currentCount) {
		var hundreds_num = Math.floor(currentCount / 100);
		var tens_num = Math.floor((currentCount - 100 * hundreds_num) / 10);
		var ones_num = currentCount % 10;

		hundredsPlace[0].src = "img/staffroll/staff_time_num" + hundreds_num + ".gif"
		tensPlace[0].src = "img/staffroll/staff_time_num" + tens_num + ".gif"
		onesPlace[0].src = "img/staffroll/staff_time_num" + ones_num + ".gif"
	};

	var countTime = function(currentFrame, endFrame) {
		if (currentFrame >= endFrame || endFrame == 0) {
			showTextAndButton();
			return;
		}

		if (currentFrame % 60 == 0) {
			currentCount--;
			changeTimeImg(currentCount, endCount);
		}

		// 16ms後に再実行（疑似60fps）
		window.webkitRequestAnimationFrame(function() {
			countTime(currentFrame + 1, endFrame);
		});
	};

	initTime(currentCount);
	countTime(0, start_count * 60);
};

// 花火表示
var showfireWorks = function() {
	var fire_works = [
		$("#fireworks-00"),
		$("#fireworks-01"),
		$("#fireworks-02")
	];
	var start_frame = 0;
	var end_frame = 60;

	var show = function(elements, endFrame, currentFrame, index) {
		if (currentFrame >= endFrame || endFrame == 0) {
			currentFrame = 0;
			elements[index].show();
			setTimeout(function() {
				show(elements, endFrame, currentFrame, index + 1);
			}, 16);
			return;
		}
		setTimeout(function() {
			show(elements, endFrame, currentFrame + 1, index);
		}, 16);
	}

	show(fire_works, end_frame, start_frame, 0);
};

// thank you と　トップページに戻るボタンを表示
var showTextAndButton = function() {
	$("#thankyou").show();
	$("#toppage-link").show();
	changeLockInput(false);
};

// スコアカウント
var countScore = function(endScore){
	var current_score = 0;
	var score = [
		$("#score0"),
		$("#score1"),
		$("#score2"),
		$("#score3"),
		$("#score4"),
		$("#score5"),
		$("#score6"),
		$("#score7"),
		$("#score8")
	];
	var changeScoreImg = function( currentScore )
	{
		var offset = 0;
		for(var i=score.length-1;0<=i;--i)
		{
			var number = null;
			if(i==0){ number = currentScore%10;}
			else{
				var pow = Math.pow(10,i);
				number = Math.floor((currentScore - offset)/pow);
				offset = offset + pow*number;
			}
			score[i][0].src = "img/staffroll/staff_time_num" + number + ".gif"
		}
	}
	var timer = setInterval(
		function(){
			//MEMO setIntervalではこれ以上高速にカウントできないので、
			//大きな値を足して早くカウントしているように見せている
			current_score = current_score + 54321;
			changeScoreImg( current_score );
			if( current_score >= endScore ){
			changeScoreImg( endScore );
			clearInterval(timer);
			}
		}, 1 );
}
