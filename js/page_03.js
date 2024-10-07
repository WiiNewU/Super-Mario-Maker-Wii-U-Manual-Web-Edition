"use strict";

window.addEventListener("DOMContentLoaded", function() {

	/* ---------------------------------
     ソフト毎のタブ　上部
    --------------------------------- */
	var tabs1 = $("#tab-up-soft > li > div");
	var pages1 = [
		$('#page-up-soft-smb'),
		$('#page-up-soft-smb3'),
		$('#page-up-soft-smw'),
		$('#page-up-soft-smbU')
	];
	var tabs1_name = "tabs1";
	var tab_up_soft = new Cmn.tab(tabs1, pages1, tabs1_name);

	// ソフトのタブをクリックした時のイベントをフック
	var onTabUpClick = function() {
		// コントローラタブをアニメさせる
		$("#ctrllist-space01").hide();
		tab_up_soft.showElementAnimSlide($("#ctrllist-space01"), 0.8, 30, 1);
	};

	tab_up_soft.setBtnClass("btn-soft-select", "btn-soft", "btn-soft-active", 0, onTabUpClick);
	tab_up_soft.setBtnClass("btn-soft-select", "btn-soft", "btn-soft-active", 1, onTabUpClick);
	tab_up_soft.setBtnClass("btn-soft-select", "btn-soft", "btn-soft-active", 2, onTabUpClick);
	tab_up_soft.setBtnClass("btn-soft-select", "btn-soft", "btn-soft-active", 3, onTabUpClick);
	tab_up_soft.init(localStorage.getItem(tabs1_name));

	/* ---------------------------------
     コントローラ毎のタブ　上部 smb
    --------------------------------- */
	var tabs2 = $("#tab-up-ctrl > li > div");
	var pages2 = [
		$('#controller01-smb-up,#controller01-smb3-up,#controller01-smw-up,#controller01-smbU-up,#controller01-smbU-yoshi-up'),
		$('#controller02-smb-up,#controller02-smb3-up,#controller02-smw-up,#controller02-smbU-up,#controller02-smbU-yoshi-up'),
	];
	var tabs2_name = "tabs2";
	var tab_up_controller = new Cmn.tab(tabs2, pages2, tabs2_name);
	tab_up_controller.setBtnClass("btn-control01-select", "btn-control01", "btn-control01-active", 0);
	tab_up_controller.setBtnClass("btn-control02-select", "btn-control02", "btn-control02-active", 1);
	tab_up_controller.init(localStorage.getItem(tabs2_name));

	/* ---------------------------------
     ソフト毎のタブ　下部
    --------------------------------- */
	var tabs3 = $("#tab-down-soft > li > div");
	var pages3 = [
		$('#page-down-soft-smb'),
		$('#page-down-soft-smb3'),
		$('#page-down-soft-smw'),
		$('#page-down-soft-smbU')
	];
	var tabs3_name = "tabs3";
	var tab_down_soft = new Cmn.tab(tabs3, pages3, tabs3_name);

	// ソフトのタブをクリックした時のイベントをフック
	var onTabDownClick = function() {
		// ターゲットの更新
		// MEMO: 動画の削除はイベントにフックした処理で行われる

		// 全ての動画を停止して静止画にする
		Cmn.setVideoTarget(null);

		// コントローラタブをアニメさせる
		$("#ctrllist-space02").hide();
		tab_down_soft.showElementAnimSlide($("#ctrllist-space02"), 0.8, 30, 1);
	};

	var onTabDownClick2 = function() {
		// 全ての動画を停止して静止画にする
		Cmn.setVideoTarget(null);

		// smbタブが押されたときは時はコントローラタブを表示しない
		$("#ctrllist-space02").hide();
	};
	tab_down_soft.setBtnClass("btn-soft-select", "btn-soft", "btn-soft-active", 0, onTabDownClick2);
	tab_down_soft.setBtnClass("btn-soft-select", "btn-soft", "btn-soft-active", 1, onTabDownClick);
	tab_down_soft.setBtnClass("btn-soft-select", "btn-soft", "btn-soft-active", 2, onTabDownClick);
	tab_down_soft.setBtnClass("btn-soft-select", "btn-soft", "btn-soft-active", 3, onTabDownClick);
	tab_down_soft.init(localStorage.getItem(tabs3_name));

	/* ---------------------------------
     コントローラ毎のタブ　下部 smb3
    --------------------------------- */
	// 下のコントローラタブ　
	// タブ状態を保存していないとき または 最初のタブが保存されているときは非表示に
	if( !localStorage.getItem(tabs3_name) || localStorage.getItem(tabs3_name) == "0" ){
		$("#ctrllist-space02").hide();
	}

	var tabs4 = $("#tab-down-ctrl > li > div");
	var pages4 = [
		$('#controller01-smb3-down,#controller01-smw-down,#controller01-smbU-down'),
		$('#controller02-smb3-down,#controller02-smw-down,#controller02-smbU-down'),
	];
	var tabs4_name = "tabs4";
	var tab_down_controller = new Cmn.tab(tabs4, pages4, tabs4_name);
	tab_down_controller.setBtnClass("btn-control01-select", "btn-control01", "btn-control01-active", 0);
	tab_down_controller.setBtnClass("btn-control02-select", "btn-control02", "btn-control02-active", 1);
	tab_down_controller.init(localStorage.getItem(tabs4_name));

});

//=======================================================================================================
// 動画関連
//=======================================================================================================

var VideoArg = function(videoFrameId, videoId, videoPlayerId, imgId, videoPath, posterPath, playReportId) {
	this.VideoFrameId = videoFrameId;
	this.VideoId = videoId;
	this.VideoPlayerId = videoPlayerId;
	this.ImgId = imgId;
	this.VideoPath = videoPath;
	this.PosterPath = posterPath;
	this.PlayReportId = playReportId;
};

var _videoPath = EpubInfo.videoserver + EpubInfo.platform + "/" + EpubInfo.region + "/" + EpubInfo.prodcode + "/" + EpubInfo.lang;
var _imgPath = EpubInfo.imgserver + EpubInfo.platform + "/" + EpubInfo.region + "/" + EpubInfo.prodcode + "/" + EpubInfo.lang;

// 対応するvideoタグとimgタグのidを指定する
var VideoArgArray = [
	new VideoArg(
		"03-01-video-frame",
		"03-01-video",
		"03-01-video-player",
		"03-01-img",
		//MEMO 言語ごとに動画出し分け（ハイフンはアンダーバーに）
		_videoPath + "/" + EpubInfo.lang.replace("-","_") + "_action_01_lq.mp4",
		_imgPath + "/action_01.jpg",
		30
	),
	new VideoArg(
		"03-02-video-frame",
		"03-02-video",
		"03-02-video-player",
		"03-02-img",
		//MEMO 言語ごとに動画出し分け（ハイフンはアンダーバーに）
		_videoPath + "/" + EpubInfo.lang.replace("-","_") + "_action_02_lq.mp4",
		_imgPath + "/action_02.jpg",
		31
	),
	new VideoArg(
		"03-03-video-frame",
		"03-03-video",
		"03-03-video-player",
		"03-03-img",
		//MEMO 言語ごとに動画出し分け（ハイフンはアンダーバーに）
		_videoPath + "/" + EpubInfo.lang.replace("-","_") + "_action_03_lq.mp4",
		_imgPath + "/action_03.jpg",
		32
	),
];


var imgElem2VideoId = function(imgElem) {
	if (!imgElem) {
		return "";
	}

	for (var i = 0; i < VideoArgArray.length; ++i) {
		var arg = VideoArgArray[i];
		if (imgElem.id === arg.ImgId) {
			return arg.VideoId;
		}
	}

	return "";
};

var initVideoThumbSrc = function() {
	$('#03-01-img').children("img")[0].src = _imgPath + "/action_01.jpg";
	$('#03-02-img').children("img")[0].src = _imgPath + "/action_02.jpg";
	$('#03-03-img').children("img")[0].src = _imgPath + "/action_03.jpg";
};

window.addEventListener(
	'DOMContentLoaded',
	function(e) {
		VideoArgArray.forEach(function(arg) {

			// オンライン動画のサムネイル設定
			if (isOnLine()) {
				initVideoThumbSrc();
			}

			// 動画プレイヤーの生成
			Cmn.createVideoPlayer(
				document.getElementById(arg.VideoFrameId),
				arg.VideoPlayerId,
				arg.VideoId,
				// onPlayClicked
				function() {
					playVideo(arg.VideoId);
					return true;
				},
				// onPauseClicked
				function() {
					document.getElementById(arg.VideoId).pause();
					return true;
				},
				// onTargetOff
				function() {
					for (var i = 0; i < VideoArgArray.length; ++i) {
						var video_elem = document.getElementById(VideoArgArray[i].VideoId);
						var player_elem = document.getElementById(VideoArgArray[i].VideoPlayerId);

						if (video_elem) {
							// 動画の削除
							if (player_elem) {
								Cmn.resetSeekbar(video_elem, player_elem);
							}
							Cmn.removeVideoElem(video_elem.parentNode);
						}

						var img_elem = document.getElementById(VideoArgArray[i].ImgId);
						if (img_elem) {
							img_elem.style.display = "inline";
						}
					}
					return true;
				}
			);

			// MEMO: 動画とプレイヤーの連動設定は、video element 生成時に行う
			//Cmn.linkVideoAndPlayer( arg.VideoId, arg.VideoPlayerId );
		});
	}
);

// 要求された動画を再生する
var playVideo = function(videoId) {
	if (!videoId) {
		return;
	}

	var play_img_elem = null;
	var play_video_elem = null;

	var target_img_elem = null;
	var target_video_elem = document.getElementById(videoId);

	// 指定された動画が既にターゲットになっている場合は、再生だけ発行して終了
	if (target_video_elem && Cmn.isTargetedVideo(target_video_elem)) {
		target_video_elem.play();
		return;
	}

	for (var i = 0; i < VideoArgArray.length; ++i) {
		var arg = VideoArgArray[i];
		var img_elem = document.getElementById(arg.ImgId);
		var video_elem = document.getElementById(arg.VideoId);
		var player_elem = document.getElementById(arg.VideoPlayerId);
		if (!img_elem) {
			continue;
		}
		if (!player_elem) {
			continue;
		}

		if (videoId === arg.VideoId) {
			// 指定された動画の場合、video element を必要に応じて生成する
			target_img_elem = img_elem;
			if (video_elem) {
				target_video_elem = video_elem;
			} else {
				Cmn.notifyPlayReport(arg.PlayReportId);
				target_video_elem = Cmn.addVideoElem(
					img_elem.parentNode.getElementsByClassName('reserved-video-pos')[0],
					arg.VideoId,
					arg.VideoPlayerId,
					arg.VideoPath,
					arg.PosterPath
				);
			}
			// 動画が見つかった or 生成されたら、そこで探索終了
			break;
		}
	}

	// ターゲットの更新
	Cmn.setVideoTarget(target_video_elem);

	if (!target_img_elem) {
		return;
	}
	if (!target_video_elem) {
		return;
	}

	// 指定された動画を再生
	var target_video_init_time = (target_video_elem.initialTime || 0);
	if (target_video_elem.currentTime && target_video_elem.currentTime !== target_video_init_time) {
		target_video_elem.currentTime = target_video_init_time;
	}

	target_video_elem.classList.add('video-height-page3');
	target_video_elem.play();
	target_img_elem.style.display = "none";
	target_video_elem.style.display = "inline";
};
