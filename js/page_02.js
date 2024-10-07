"use strict";

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
		"02-01-video-frame",
		"02-01-video",
		"02-01-video-player",
		"02-01-img",
		_videoPath + "/tips_01_lq.mp4",
		_imgPath + "/tips_01.jpg",
		25
	),
	new VideoArg(
		"02-02-video-frame",
		"02-02-video",
		"02-02-video-player",
		"02-02-img",
		_videoPath + "/tips_02_lq.mp4",
		_imgPath + "/tips_02.jpg",
		26
	),
	new VideoArg(
		"02-03-video-frame",
		"02-03-video",
		"02-03-video-player",
		"02-03-img",
		_videoPath + "/tips_03_lq.mp4",
		_imgPath + "/tips_03.jpg",
		27
	),
	new VideoArg(
		"02-04-video-frame",
		"02-04-video",
		"02-04-video-player",
		"02-04-img",
		_videoPath + "/tips_04_lq.mp4",
		_imgPath + "/tips_04.jpg",
		28
	),
	new VideoArg(
		"02-05-video-frame",
		"02-05-video",
		"02-05-video-player",
		"02-05-img",
		_videoPath + "/tips_05_lq.mp4",
		_imgPath + "/tips_05.jpg",
		29
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
	$('#02-01-img').children("img")[0].src = _imgPath + "/tips_01.jpg";
	$('#02-02-img').children("img")[0].src = _imgPath + "/tips_02.jpg";
	$('#02-03-img').children("img")[0].src = _imgPath + "/tips_03.jpg";
	$('#02-04-img').children("img")[0].src = _imgPath + "/tips_04.jpg";
	$('#02-05-img').children("img")[0].src = _imgPath + "/tips_05.jpg";
};

window.addEventListener(
	'DOMContentLoaded',
	function(e) {
		// オンライン動画のサムネイル設定
		if (isOnLine()) {
			initVideoThumbSrc();
		}

		VideoArgArray.forEach(function(arg) {
			// 動画プレイヤーの生成
			Cmn.createVideoPlayer(
				document.getElementById(arg.VideoFrameId),
				arg.VideoPlayerId,
				arg.VideoId,
				// onPlayBtnClicked
				function() {
					playVideo(arg.VideoId);
					return true;
				},
				// onPauseBtnClicked
				function() {
					document.getElementById(arg.VideoId).pause();
					return true;
				},
				// onTargetOff
				function(video_elem) {
					if (!video_elem) {
						return;
					}

					var i;
					for (i = 0; i < VideoArgArray.length; ++i) {
						var arg = VideoArgArray[i];

						if (video_elem.id === arg.VideoId) {
							// 動画の削除
							var player_elem = document.getElementById(arg.VideoPlayerId);
							if (player_elem) {
								Cmn.resetSeekbar(video_elem, player_elem);
							}
							Cmn.removeVideoElem(video_elem.parentNode);

							var img_elem = document.getElementById(arg.ImgId);
							if (img_elem) {
								img_elem.style.display = "inline";
							}
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

// 要求された動画を再生し、それ以外の動画以外を停止して静止画にする
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
		}
	}

	// ターゲットの更新
	// MEMO: 再生中の動画の削除はここで行う
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

	target_video_elem.classList.add('video-height-page2');
	target_video_elem.play();
	target_img_elem.style.display = "none";
	target_video_elem.style.display = "inline";
};
