"use strict";

//名前空間
var Cmn = function() {};

/* ----------------------------------------------------------------------------
 デバッグ用ログ出力
---------------------------------------------------------------------------- */
Cmn.log = function() {
	// コンソールログが必要な時に有効化してください
	/*console.log( arguments );*/

	// HTML上にログを吐き出す時に有効化してください
	/*var str = "";
	var i;
	for( i = 0; i < arguments.length; ++i ) {
		if( i > 0 ) { str += ", "; }
		str += arguments[i];
	}

	document.getElementById( 'log' ).innerHTML += str + "<br />";*/
};

/* ----------------------------------------------------------------------------
 プレイレポート通知（値をインクリメントする）
---------------------------------------------------------------------------- */
Cmn.notifyPlayReport = function(id) {
	if (typeof wiiuEpub !== 'undefined') {
		wiiuEpub.notifyPlayReport(id);
	} else {
		// デバッグ用出力
		Cmn.log("NotifyPlayReport:" + id);
	}
};

/* ----------------------------------------------------------------------------
 ましこタッチを通知
---------------------------------------------------------------------------- */
Cmn.notifyMashikoTouchReport = function() {
	Cmn.notifyPlayReport(24);
};

/* ----------------------------------------------------------------------------
 普通のボタン class指定で要素をボタン化（各ページのpage_XX.jsで呼び出す場合）
---------------------------------------------------------------------------- */
Cmn.normalBtn = {
	init: function(btnDefaultClassName, btnDownClassName, btnUpClassName) {
		var btn = document.getElementsByClassName(btnDefaultClassName);
		for (var i = 0; i < btn.length; i++) {
			btn[i].ontouchstart = function() {
				onDownBtn(this, btnDownClassName);
			};
			btn[i].ontouchend = function() {
				onUpBtn(this, btnUpClassName);
			};
			btn[i].ontouchcancel = function() {
				onUpBtn(this, btnUpClassName);
			};
		}
	}
};

// マウスダウン時の処理（イベントリスナーを手動で登録する場合）
Cmn.onDownBtn = function(targetElement, className) {
	targetElement.className = className;
};

// マウスアップ時の処理（イベントリスナーを手動で登録する場合）
Cmn.onUpBtn = function(targetElement, className) {
	targetElement.className = className;
};

// マウスアウト時の処理（イベントリスナーを手動で登録する場合）
Cmn.onOutBtn = function(targetElement, className) {
	targetElement.className = className;
};

/* ----------------------------------------------------------------------------
「もっと」ボタン class指定で要素をボタン化（各ページのpage_XX.jsで呼び出す場合）
---------------------------------------------------------------------------- */

Cmn.moreBtn = {
	init: function(btnDefaultClassName, btnClickClassName) {
		var btn = $("." + btnDefaultClassName);
		for (var i = 0; i < btn.length; i++) {
			btn[i].onclick = function() {
				onClickMoreButton(this, btnClickClassName);
			};
		}
	}
};

//「もっと」ボタンのクリック時（イベントリスナーを手動で登録する場合）
Cmn.onClickMoreButton = function(targetElement, className) {
	targetElement.className = className;
	// 「もっと」ボタンを非表示にする
	targetElement.style.display = "none";
	// MEMO 要素が隣接している場合しか動かない
	$(targetElement).next("div").show();
};

// ロケーションの指定
Cmn.setLocation = function(url) {
	location.href = url;
};

/* ----------------------------------------------------------------------------
 tab class指定で要素をタブ化（各ページのpage_XX.jsで呼び出す場合）
---------------------------------------------------------------------------- */
Cmn.tab = function(tabs, pages, tabName) {

	// 各タブのクラスを覚えておくデータ
	var touchstart = new Array(tabs.length);
	var touchend = new Array(tabs.length);
	var touchcancel = new Array(tabs.length);
	var active = new Array(tabs.length);

	var isShowing = false;

	this.setBtnClass = function(touchstart_class, touchend_class, active_class, tab_id, onClick) {
		_setBtnClass(touchstart_class, touchend_class, active_class, tab_id, onClick);
	};
	this.init = function( firstActiveIndex ) {

		if(firstActiveIndex){
			if( firstActiveIndex >= tabs.length || firstActiveIndex === undefined ){ return; }
			for (var i = 0; i < tabs.length; i++) {
			 // validプロパティ（入力を無効化するフラグ）をfalseにしておく
			 // true: 有効 false:無効
			 if (i == firstActiveIndex) {
				 tabs[i].valid = true;
			 	tabs[i].className = active[i];
			 } else {
				 tabs[i].valid = false;
				 pages[i].hide();
			 }
		 }
		}
		else{
		 for (var i = 0; i < tabs.length; i++) {
			 // validプロパティ（入力を無効化するフラグ）をfalseにしておく
			 // true: 有効 false:無効
			 if (i == 0) {
				 tabs[i].valid = true;
			 	tabs[i].className = active[i];
			 } else {
				 tabs[i].valid = false;
				 pages[i].hide();
			 }
		 }
  }
	};

	this.showPage = function(obj) {
		_showPage(obj);
	};

	var _showPage = function(obj) {
		var num = null;
		for (num = 0; num < tabs.length; num++) {
			if (tabs[num] === obj) break;
		}

		for (var i = 0; i < pages.length; i++) {
			if (i == num) {
				_showElementAnimSlide(pages[num], 0.8, 30, 1);
			} else {
				tabs[i].valid = false;
				tabs[i].className = touchend[i];
				pages[i].hide();
			}
		}
	};

	var _setBtnClass = function(touchstart_class, touchend_class, active_class, tab_id, onClick) {
		tabs[tab_id].addEventListener("touchstart",
			function() {
				if (isShowing) {
					return;
				}
				if (!this.valid) {
					this.className = touchstart_class;
				}
			});
		tabs[tab_id].addEventListener("touchend",
			function() {

				if (isShowing) {
					return;
				}
				if (!this.valid) {
					this.className = touchend_class;
				}
			});
		tabs[tab_id].addEventListener("touchcancel",
			function() {
				if (isShowing) {
					return;
				}
				if (!this.valid) {
					this.className = touchend_class;
				}
			});
		tabs[tab_id].addEventListener("click",
			function() {
				// タッチ時に表示される空間ナビのカーソルを消す
				if (this.tagName == "div") {
					this.blur();
				}

				if (isShowing) {
					return;
				}
				if (this.valid) {
					return;
				}
				if( tabName ){
				 localStorage.setItem(tabName, String(tab_id));
			 }
				this.className = active_class;
				this.valid = true;
				_showPage(this);

				if (typeof onClick === 'function') {
					onClick();
				}

			});
		tabs[tab_id].addEventListener("keyup",
			function() {
				if (event.keyCode == 13) {
					if (isShowing) {
						return;
					}
					if (this.valid) {
						return;
					}
					if( tabName ){
					 localStorage.setItem(tabName, String(tab_id));
				 }
					this.className = active_class;
					this.valid = true;
					_showPage(this);

					if (typeof onClick === 'function') {
						onClick();
					}
				}
			});

		touchstart[tab_id] = touchstart_class;
		touchend[tab_id] = touchend_class;
		touchcancel[tab_id] = touchend_class;
		active[tab_id] = active_class;
	};

	this.showElementAnimSlide = function(targetElement, startOpacity, endFrame, currentFrame) {
		_showElementAnimSlide(targetElement, startOpacity, endFrame, currentFrame);
	};

	// ページ表示時のアニメ
	var _showElementAnimSlide = function(targetElement, startOpacity, endFrame, currentFrame) {
		isShowing = true;
		targetElement.show();

		// 終了条件を満たしている場合は、目標位置に移動し終了
		if (currentFrame >= endFrame || endFrame == 0) {
			targetElement.css({
				"opacity": 1
			});
			isShowing = false;
			return;
		}

		targetElement.css({
			"opacity": (currentFrame / endFrame)
		});

		// 16ms後に再実行（疑似60fps）
		setTimeout(function() {
			_showElementAnimSlide(targetElement, startOpacity, endFrame, currentFrame + 1);
		}, 16);
	};

	var setFirstActiveBtn = function( index )
	{
		if (localStorage.getItem('activeTab') === index) {
			hi_btn_elem.classList.add('active');
		}
	};
};

/* ----------------------------------------------------------------------------
 動画プレイヤー用のパラメータ
---------------------------------------------------------------------------- */

Cmn.VideoPlayerConstParam = {
	timerInterval: 100,
	standedCntThreshold: 4,
	moveLengthThreshold: 10,
	slidebarXOffset: -11, // css の初期値に合わせる
	slidebarBoundingOffset: -2, // css の初期値に合わせる

	loadingIconDelayCnt: 7,
	loadingTimeDifThreshold: 0.06, // スムーズに再生されていれば 0.2～0.3 程度
	loadingIconFadeInSpeed: 0.15,
	loadingIconFadeOutSpeed: 0.3,
	loadingIconMaxAlpha: 1.0,
	loadingIconMinFadeInCnt: 7, // 最低表示時間を保障

};

/* ----------------------------------------------------------------------------
 動画プレイヤーの共用データ保存領域
---------------------------------------------------------------------------- */

Cmn.VideoPlayerDataArray = new Array();

Cmn.VideoPlayerData = function(id) {
	this.id = id;

	this.videoLivingCheck = {
		timerFunc: null,
		isOnceBuffered: false,

		reset: function() {
			this.isOnceBuffered = false;

			if (this.timerFunc) {
				clearInterval(this.timerFunc);
			}
			this.timerFunc = null;
		},
	};

	this.eventFunc = {
		onTargetOn: null,
		onTargetOff: null,

		reset: function() {
			this.onTargetOn = null;
			this.onTargetOff = null;
		},
	};

	this.loadingIcon = {
		loadingCnt: 0,
		isPrevFadedIn: false,
		forceFadeInCnt: 0,
		iconOpacity: 0,
		prevTime: 0,
		timerFunc: null,
		targetVideo: null,

		reset: function() {
			this.loadingCnt = 0;
			this.isPrevFadedIn = false;
			this.forceFadeInCnt = 0;
			this.iconOpacity = 0;
			this.prevTime = 0;
			this.targetVideo = null;

			if (this.timerFunc) {
				clearInterval(this.timerFunc);
			}
			this.timerFunc = null;
		},
	};

	this.seekbar = {
		sumOfMoveLength: 0,
		standedCnt: 0,
		prevTouchX: 0,
		requestedSeekTime: 0,
		checkStandingTimerFunc: null,
		targetVideo: null,

		reset: function() {
			this.sumOfMoveLength = 0;
			this.standedCnt = 0;
			this.prevTouchX = 0;
			this.requestedSeekTime = 0;
			this.targetVideo = null;

			if (this.checkStandingTimerFunc) {
				clearInterval(this.checkStandingTimerFunc);
			}
			this.checkStandingTimerFunc = null;
		},
	};

	this.sourceChange = {
		isChanging: false,
		onEnd: null,
		nextStartCurrentTime: -1,

		reset: function() {
			this.isChanging = false;
			this.onEnd = null;
			this.nextStartCurrentTime = -1;
		},
	};

	this.reset = function() {
		this.videoLivingCheck.reset();
		this.eventFunc.reset();
		this.loadingIcon.reset();
		this.seekbar.reset();
		this.sourceChange.reset();
	};
};

/* ----------------------------------------------------------------------------
 動画の再生位置を設定する（例外処理付き）
---------------------------------------------------------------------------- */
Cmn.setVideoCurrentTime = function(videoElem, time) {
	if (!videoElem) {
		return;
	}

	// タイミングによっては例外がスローされることがあるので、例外処理をしておく
	try {
		videoElem.currentTime = time;
	} catch (err) {
		Cmn.log("could not set video.currentTime", err);
	}
};

/* ----------------------------------------------------------------------------
 動画プレイヤー内部実装用関数
---------------------------------------------------------------------------- */

Cmn._videoPlayerSeekImpl = function(seekbarData) {
	if (!seekbarData.targetVideo) {
		return;
	}

	Cmn.setVideoCurrentTime(seekbarData.targetVideo, seekbarData.requestedSeekTime);
};

Cmn._videoPlayerUpdateStanding = function(seekbarData) {
	if (seekbarData.standedCnt === 0) {
		// カウンタが0の時に発火
		Cmn._videoPlayerSeekImpl(seekbarData);
		seekbarData.standedCnt = -1;
		seekbarData.sumOfMoveLength = 0;
	} else if (seekbarData.standedCnt > 0) {
		--seekbarData.standedCnt;
	}

	//Cmn.log( "standedCnt:", seekbar_data.standedCnt );
};

Cmn._videoPlayerUpdateLoadingIcon = function(loadingIconData) {
	var const_param = Cmn.VideoPlayerConstParam;
	var target_video = loadingIconData.targetVideo;
	if (!target_video) {
		return;
	}

	if (loadingIconData.loadingCnt >= const_param.loadingIconDelayCnt ||
		loadingIconData.forceFadeInCnt > 0 // ちらつき防止のため、一度表示を始めたら最大になるまではアルファを上げる
	) {
		// 最低表示時間を保証ための処理
		loadingIconData.forceFadeInCnt = loadingIconData.isPrevFadedIn ? loadingIconData.forceFadeInCnt - 1 : const_param.loadingIconMinFadeInCnt;

		// アルファを上げる
		loadingIconData.iconOpacity = Math.min(const_param.loadingIconMaxAlpha, loadingIconData.iconOpacity + const_param.loadingIconFadeInSpeed);

		loadingIconData.isPrevFadedIn = true;
	} else {
		// アルファを下げる
		loadingIconData.iconOpacity = Math.max(0.0, loadingIconData.iconOpacity - const_param.loadingIconFadeOutSpeed);

		loadingIconData.isPrevFadedIn = false;
	}

	// element にアルファを反映する
	if (target_video.parentNode) {
		var loading_icon = target_video.parentNode.getElementsByClassName('loading-icon')[0];
		if (loading_icon) {
			loading_icon.style.opacity = loadingIconData.iconOpacity;
		}
	}

	// カウントアップ（timeupdate でリセットされる）
	++loadingIconData.loadingCnt;

	//Cmn.log( "loadingCnt:", loading_icon_data.loadingCnt, "forceFadeInCnt:", loading_icon_data.forceFadeInCnt );
};

Cmn._videoPlayerOnTimeUpdate = function(loadingIconData) {
	var target_video = loadingIconData.targetVideo;
	if (!target_video) {
		return;
	}

	var current_time = target_video.currentTime || 0;
	if ((current_time - loadingIconData.prevTime) > Cmn.VideoPlayerConstParam.loadingTimeDifThreshold) {
		// 時間が進んでいたら、ロードが終わって再生できていると判断する（シーク時の巻き戻しに対応するために、負の場合は再生出来て「いない」と判断する）
		loadingIconData.loadingCnt = 0;

		//Cmn.log( "Change currentTime", loading_icon_data.prevTime, target_video.currentTime );
	} else {
		//Cmn.log( "Not change currentTime", loading_icon_data.prevTime, target_video.currentTime );
	}

	loadingIconData.prevTime = current_time;
};

Cmn._videoPlayerGetSliderPositionRate = function(touchEvent, player) {
	var seekbar = player.getElementsByClassName('video-player-seekbar-base')[0];
	if (!seekbar) {
		return 0;
	}

	var touch = touchEvent.changedTouches[0];
	var seekbar_bounds = seekbar.getBoundingClientRect();

	// MEMO: 小数点付きの幅を正確に取得する方法が存在しないので、borderなどを含むboundingから固定値を引くことで求めている
	var fixed_width = seekbar_bounds.width + Cmn.VideoPlayerConstParam.slidebarBoundingOffset;

	// スライダーの位置から目標位置を計算
	var seek_rate = (touch.pageX - document.body.scrollLeft - seekbar_bounds.left + Cmn.VideoPlayerConstParam.slidebarBoundingOffset) / fixed_width;
	seek_rate = Math.max(Math.min(seek_rate, 1.0), 0.0);

	return seek_rate;
};

Cmn._videoPlayerGetSliderRoundedPositionX = function(touchEvent, player) {
	var seekbar = player.getElementsByClassName('video-player-seekbar-base')[0];
	if (!seekbar) {
		return 0;
	}

	var touch = touchEvent.changedTouches[0];
	var seekbar_bounds = seekbar.getBoundingClientRect();
	var fixed_width = seekbar_bounds.width + Cmn.VideoPlayerConstParam.slidebarBoundingOffset;

	return Math.max(Math.min(touch.pageX - document.body.scrollLeft - seekbar_bounds.left + Cmn.VideoPlayerConstParam.slidebarBoundingOffset, fixed_width), 0);
};

// MEMO: end を呼び出す前に実行可能
Cmn._startVideoLivingCheck = function(videoId) {
	var player_data = Cmn.VideoPlayerDataArray[videoId];
	if (!player_data) {
		return;
	}
	var living_check = player_data.videoLivingCheck;
	if (!living_check) {
		return;
	}

	// データ領域をリセット（タイマー関数の解放も行われる）
	living_check.reset();

	// タイマー実行される関数の登録
	living_check.timerFunc = setInterval(function() {
			var video_elem = document.getElementById(videoId);

			// MEMO: 何らかの理由で動画がターゲットでなくなっていたらタイマー実行を終了する
			if (!Cmn.isTargetedVideo(video_elem)) {
				living_check.reset();
				Cmn.log("Warning: video is already target off.");
				return;
			}

			if (living_check.isOnceBuffered) {
				if (video_elem.buffered.length === 0) {
					// 動画のターゲットを外すことでイベントを発火させる
					Cmn.setVideoTarget(null);
					Cmn.log("Force video target off");
				}
			} else {
				if (video_elem.buffered.length >= 1) {
					living_check.isOnceBuffered = true;
				}
			}
		},
		Cmn.VideoPlayerConstParam.timerInterval);
};

Cmn._endVideoLivingCheck = function(videoId) {
	var player_data = Cmn.VideoPlayerDataArray[videoId];
	if (!player_data) {
		return;
	}
	var living_check = player_data.videoLivingCheck;
	if (!living_check) {
		return;
	}

	living_check.reset();
};

/* ----------------------------------------------------------------------------
 動画プレイヤーの追加

 param[in]  onPlayBtnClick		再生ボタンクリック時に呼び出される関数、処理成功時に true を返すことを求める
 param[in]  onPauseBtnClick		停止ボタンクリック時に呼び出される関数、処理成功時に true を返すことを求める
 param[in]  onVideoTargetOff	動画が意図しないタイミングで破棄された際に呼び出される関数、処理成功時に true を返すことを求める
---------------------------------------------------------------------------- */
Cmn.createVideoPlayer = function(element, playerId, videoId, onPlayBtnClick, onPauseBtnClick, onVideoTargetOff) {
	if (!Cmn.VideoPlayerDataArray[videoId]) {
		Cmn.VideoPlayerDataArray[videoId] = new Cmn.VideoPlayerData(videoId);
	} else {
		Cmn.VideoPlayerDataArray[videoId].reset();
	}
	var player_data = Cmn.VideoPlayerDataArray[videoId];

	//--------------------------------------------------------------------------------------------------------
	player_data.eventFunc.onTargetOn = function() {
		// 生存チェックを開始（HOMEボタン復帰対応のために必要）
		Cmn._startVideoLivingCheck(videoId);
	};

	player_data.eventFunc.onTargetOff = function() {
		var living_check = player_data.videoLivingCheck;
		var video_elem = document.getElementById(videoId);

		// 生存チェックを終了する
		Cmn._endVideoLivingCheck(videoId);

		if (onVideoTargetOff) {
			onVideoTargetOff(video_elem);
		}
	}

	//--------------------------------------------------------------------------------------------------------
	// プレイヤーのルート
	var player_elem = document.createElement('div');
	player_elem.classList.add('video-player');
	player_elem.id = playerId;

	//--------------------------------------------------------------------------------------------------------
	// 再生・一時停止ボタン
	var play_btn_elem = document.createElement('div');
	play_btn_elem.classList.add('video-player-play');

	var play_touch_end = function(e) {
		play_btn_elem.classList.remove('select');
	};

	play_btn_elem.addEventListener(
		'touchstart',
		function(e) {
			// MEMO: 画質切り替え中のHOMEボタン戻りがハンドリング出来ないので、再生ボタンだけは常に操作できる様にしておく
			/*var video_elem = document.getElementById( videoId );

			// 再生ボタンだけは、要素が無い場合は無条件で操作可能
			if( video_elem ) {
				// UIが操作できない状態であれば、何もしない（ターゲットでないことは許可する）
				if( !Cmn.canControllVideoPlayerUI( video_elem, true ) ) { return; }
			}*/

			play_btn_elem.classList.add('select');
		},
		false
	);
	play_btn_elem.addEventListener(
		'touchend',
		play_touch_end,
		false
	);
	play_btn_elem.addEventListener(
		'touchcancel',
		play_touch_end,
		false
	);
	play_btn_elem.onclick = function() {
		// MEMO: 画質切り替え中のHOMEボタン戻りがハンドリング出来ないので、再生ボタンだけは常に操作できる様にしておく
		/*var video_elem = document.getElementById( videoId );

		// 再生ボタンだけは、要素が無い場合は無条件で操作可能
		if( video_elem ) {
			// UIが操作できない状態であれば、何もしない（ターゲットでないことは許可する）
			if( !Cmn.canControllVideoPlayerUI( video_elem, true ) ) { return; }
		}*/

		var play_btn = document.getElementById(playerId).getElementsByClassName('video-player-play')[0];

		if (play_btn) {
			if (onPlayBtnClick()) {
				play_btn_elem.classList.remove('video-player-play');
				play_btn_elem.classList.add('video-player-pause');
			}
		} else {
			if (onPauseBtnClick()) {
				play_btn_elem.classList.remove('video-player-pause');
				play_btn_elem.classList.add('video-player-play');
			}
		}
	};

	//--------------------------------------------------------------------------------------------------------
	// シークバー一式
	var seekbar_buffered_elem = document.createElement('div');
	seekbar_buffered_elem.classList.add('video-player-seekbar-buffered');

	var seekbar_played_elem = document.createElement('div');
	seekbar_played_elem.classList.add('video-player-seekbar-played');

	var slider_elem = document.createElement('div');
	slider_elem.classList.add('video-player-seekbar-slider');

	var seekbar_base_elem = document.createElement('div');
	seekbar_base_elem.classList.add('video-player-seekbar-base');

	var seekbar_base_touch_end = function(e) {
		var video_elem = document.getElementById(videoId);
		if (!video_elem) {
			return;
		}
		var player = document.getElementById(playerId);
		if (!player) {
			return;
		}

		// UIが操作できない状態であれば、何もしない
		if (!Cmn.canControllVideoPlayerUI(video_elem, false)) {
			return;
		}


		// タッチスクロールを抑制する
		e.preventDefault();

		// 必要なデータを抜出
		var seekbar_data = player_data.seekbar;

		// 共用データをクリア
		seekbar_data.reset();


		// 再生中だった場合は再生する（一時停止ボタンになっている場合）
		var pause_btn = document.getElementById(playerId).getElementsByClassName('video-player-pause')[0];
		if (pause_btn) {
			if (video_elem.currentTime >= video_elem.duration) {
				// ただし、再生時間最大で指定された場合は一時停止したままにしておく
				play_btn_elem.classList.remove('video-player-pause');
				play_btn_elem.classList.add('video-player-play');
			} else {
				video_elem.play();
			}
		}

		// シーク位置を適用
		var seek_rate = Cmn._videoPlayerGetSliderPositionRate(e, player);
		Cmn.setVideoCurrentTime(video_elem, seek_rate * (video_elem.duration || 0));

		// スライダーの見た目を更新
		Cmn.updateSeekbar(video_elem, player, seek_rate);

		// 手動シーク中を示すカスタムデータ属性を削除
		if (player.hasAttribute('data-seeking')) {
			player.removeAttribute('data-seeking');
		}
	};

	seekbar_base_elem.addEventListener(
		'touchstart',
		function(e) {
			var video_elem = document.getElementById(videoId);
			if (!video_elem) {
				return;
			}
			var player = document.getElementById(playerId);
			if (!player) {
				return;
			}

			// UIが操作できない状態であれば、何もしない
			if (!Cmn.canControllVideoPlayerUI(video_elem, false)) {
				return;
			}


			// タッチスクロールを抑制する
			e.preventDefault();

			// 手動シーク中である事をカスタムデータ属性に記録する
			player.dataset.seeking = true;

			// 動画を停止
			video_elem.pause();

			// タッチ位置を０～１に変換
			var seek_rate = Cmn._videoPlayerGetSliderPositionRate(e, player);

			// 共用データに必要な情報を書き込む
			var seekbar_data = player_data.seekbar;
			seekbar_data.reset();
			seekbar_data.standedCnt = Cmn.VideoPlayerConstParam.standedCntThreshold;
			seekbar_data.targetVideo = video_elem;

			// 共用データに最新情報を書き込み
			seekbar_data.prevTouchX = Cmn._videoPlayerGetSliderRoundedPositionX(e, player);
			seekbar_data.requestedSeekTime = seek_rate * (video_elem.duration || 0);

			// スライダーの見た目を更新
			Cmn.updateSeekbar(video_elem, player, seek_rate);

			// タイマーイベント実行開始
			if (seekbar_data.checkStandingTimerFunc) {
				clearInterval(seekbar_data.checkStandingTimerFunc);
			}
			seekbar_data.checkStandingTimerFunc = setInterval(function() {
				Cmn._videoPlayerUpdateStanding(player_data.seekbar);
			}, Cmn.VideoPlayerConstParam.timerInterval);
		},
		false
	);
	seekbar_base_elem.addEventListener(
		'touchmove',
		function(e) {
			var video_elem = document.getElementById(videoId);
			if (!video_elem) {
				return;
			}
			var player = document.getElementById(playerId);
			if (!player) {
				return;
			}

			// UIが操作できない状態であれば、何もしない
			if (!Cmn.canControllVideoPlayerUI(video_elem, false)) {
				return;
			}


			// タッチスクロールを抑制する
			e.preventDefault();

			// タッチ位置を０～１に変換
			var seek_rate = Cmn._videoPlayerGetSliderPositionRate(e, player);

			// 共用データに最新情報を書き込み
			var seekbar_data = player_data.seekbar;
			seekbar_data.requestedSeekTime = seek_rate * (video_elem.duration || 0);

			// 移動距離更新
			var touch_x = Cmn._videoPlayerGetSliderRoundedPositionX(e, player);
			seekbar_data.sumOfMoveLength += Math.abs(touch_x - seekbar_data.prevTouchX);
			seekbar_data.prevTouchX = touch_x;
			//Cmn.log( "sumOfMoveLength:", seekbar_data.sumOfMoveLength );

			// 移動距離が一定以上溜まった場合は、静止カウンタをリセット(0になったら発火する)
			if (seekbar_data.sumOfMoveLength > Cmn.VideoPlayerConstParam.moveLengthThreshold) {
				seekbar_data.standedCnt = Cmn.VideoPlayerConstParam.standedCntThreshold;
				seekbar_data.sumOfMoveLength = 0;
			}

			// スライダーの見た目を更新
			Cmn.updateSeekbar(video_elem, player, seek_rate);
		},
		false
	);
	seekbar_base_elem.addEventListener(
		'touchend',
		seekbar_base_touch_end,
		false
	);
	seekbar_base_elem.addEventListener(
		'touchcancel',
		seekbar_base_touch_end,
		false
	);

	//--------------------------------------------------------------------------------------------------------
	// フルスクリーンボタン
	var full_screen_elem = document.createElement('div');
	full_screen_elem.classList.add('video-player-fullscreen');

	var full_screen_touch_end = function(e) {
		full_screen_elem.classList.remove('select');
	};

	full_screen_elem.addEventListener(
		'touchstart',
		function(e) {
			var video_elem = document.getElementById(videoId);
			if (!video_elem) {
				return;
			}

			// UIが操作できない状態であれば、何もしない
			if (!Cmn.canControllVideoPlayerUI(video_elem, false)) {
				return;
			}

			full_screen_elem.classList.add('select');
		},
		false
	);
	full_screen_elem.addEventListener(
		'touchend',
		full_screen_touch_end,
		false
	);
	full_screen_elem.addEventListener(
		'touchcancel',
		full_screen_touch_end,
		false
	);
	full_screen_elem.onclick = function() {
		var video_elem = document.getElementById(videoId);
		if (!video_elem) {
			return;
		}

		// UIが操作できない状態であれば、何もしない
		if (!Cmn.canControllVideoPlayerUI(video_elem, false)) {
			return;
		}

		video_elem.webkitRequestFullscreen();
	};

	//--------------------------------------------------------------------------------------------------------
	// エレメントの親子階層を構築
	seekbar_base_elem.appendChild(seekbar_buffered_elem);
	seekbar_base_elem.appendChild(seekbar_played_elem);
	seekbar_base_elem.appendChild(slider_elem);
	player_elem.appendChild(play_btn_elem);
	player_elem.appendChild(seekbar_base_elem);
	player_elem.appendChild(full_screen_elem);
	element.appendChild(player_elem);
};

/* ----------------------------------------------------------------------------
 動画にプレイヤーとの連動機能を追加
---------------------------------------------------------------------------- */
Cmn.linkVideoAndPlayer = function(videoId, playerId) {
	var player_data = Cmn.VideoPlayerDataArray[videoId];

	var update_seekbar = function(eventName) {
		var video_elem = document.getElementById(videoId);
		if (!video_elem) {
			return;
		}
		var player = document.getElementById(playerId);
		if (!player) {
			return;
		}

		if (!Cmn.isTargetedVideo(video_elem)) {
			return;
		} // 動画がターゲットでなければ無視

		// 手動シーク中でなければシークバーの位置を更新
		if (!player.dataset.seeking) {
			Cmn.updateSeekbar(video_elem, player, null);
		}

		//Cmn.log( eventName );
	};

	var change_loading_icon_visibility = function(isReqToShown) {
		var video_elem = document.getElementById(videoId);
		if (!video_elem) {
			return;
		}

		var loading_icon_base = video_elem.parentNode.getElementsByClassName('loading-icon-base')[0];
		if (!loading_icon_base) {
			return;
		}

		var loading_icon = video_elem.parentNode.getElementsByClassName('loading-icon')[0];
		if (!loading_icon) {
			return;
		}

		if (isReqToShown) {
			loading_icon_base.classList.remove('hidden');
			loading_icon_base.classList.add('shown');
		} else {
			loading_icon_base.classList.remove('shown');
			loading_icon_base.classList.add('hidden');
		}
	};

	// 動画とプレイヤーの連動設定
	var video_elem = document.getElementById(videoId);

	// 再生開始（一時停止からの再生も含む）時の一連の処理
	video_elem.addEventListener(
		'play',
		function() {
			var player_elem = document.getElementById(playerId);
			if (!player_elem) {
				return;
			}
			if (player_elem.dataset.seeking) {
				return;
			} // 手動シーク中は無視

			var play_btn = player_elem.getElementsByClassName('video-player-play')[0];
			if (play_btn) {
				play_btn.classList.remove('video-player-play');
				play_btn.classList.add('video-player-pause');
			}

			// ローディングアイコンの初期値設定
			var loading_icon_base = video_elem.parentNode.getElementsByClassName('loading-icon-base')[0];
			if (loading_icon_base) {
				loading_icon_base.classList.remove('hidden');
				loading_icon_base.classList.add('shown');
			}
			var loading_icon = video_elem.parentNode.getElementsByClassName('loading-icon')[0];
			if (loading_icon) {
				loading_icon.style.opacity = 0;
			}

			// 共有領域に必要なデータを書き込む
			var loading_icon_data = player_data.loadingIcon;
			loading_icon_data.reset();
			loading_icon_data.targetVideo = video_elem;
			loading_icon_data.prevTime = video_elem.currentTime || 0;
			loading_icon_data.loadingCnt = 0;

			// タイマー開始
			if (loading_icon_data.timerFunc) {
				clearInterval(loading_icon_data.timerFunc);
			}
			loading_icon_data.timerFunc = setInterval(function() {
				Cmn._videoPlayerUpdateLoadingIcon(player_data.loadingIcon)
			}, Cmn.VideoPlayerConstParam.timerInterval);

			//Cmn.log( 'play' );
		},
		false
	);
	// 一時停止時（破棄も含む）の一連の処理
	video_elem.addEventListener(
		'pause',
		function() {
			var loading_icon_data = player_data.loadingIcon;

			// 既に対象が移っていた場合は何もしない
			if (loading_icon_data.targetVideo !== video_elem) {
				return;
			}

			// タイマー停止
			if (loading_icon_data.timerFunc) {
				clearInterval(loading_icon_data.timerFunc);
			}
			loading_icon_data.reset();

			var player_elem = document.getElementById(playerId);
			if (!player_elem) {
				return;
			}
			if (player_elem.dataset.seeking) {
				return;
			} // 手動シーク中は無視

			var pause_btn = player_elem.getElementsByClassName('video-player-pause')[0];
			if (pause_btn) {
				pause_btn.classList.remove('video-player-pause');
				pause_btn.classList.add('video-player-play');
			}

			// ローディングアイコンの設定
			if (video_elem.parentNode) {
				var loading_icon_base = video_elem.parentNode.getElementsByClassName('loading-icon-base')[0];
				if (loading_icon_base) {
					loading_icon_base.classList.remove('shown');
					loading_icon_base.classList.add('hidden');
				}
			}

			//Cmn.log( 'pause' );
		},
		false
	);
	// シークバー更新、ローディングアイコン表示管理用
	video_elem.addEventListener(
		'timeupdate',
		function() {
			update_seekbar('timeupdate');
			Cmn._videoPlayerOnTimeUpdate(player_data.loadingIcon);
		},
		false
	);
	// シークバー更新用 (一時停止中に timeupdate が発行されないため)
	video_elem.addEventListener(
		'progress',
		function() {
			update_seekbar('progress');
		},
		false
	);
	// 動画切り替え処理の終了監視用
	video_elem.addEventListener(
		'loadedmetadata',
		function() {
			var source_change_data = player_data.sourceChange;
			if (typeof source_change_data.onEnd === 'function') {
				source_change_data.onEnd();
			}
		},
		false
	);
};

/* ----------------------------------------------------------------------------
 シークバーの位置を更新
---------------------------------------------------------------------------- */
Cmn.updateSeekbar = function(videoElem, playerElem, forcePlayedTime) {
	var seekbar_base = playerElem.getElementsByClassName('video-player-seekbar-base')[0];
	if (!seekbar_base) {
		return;
	}

	var player_data = Cmn.VideoPlayerDataArray[videoElem.id];
	if (player_data) {
		// 動画切り替え中は何もしない
		if (player_data.sourceChange.isChanging) {
			return;
		}
	}

	var bounds = seekbar_base.getBoundingClientRect();
	var fixed_width = bounds.width + Cmn.VideoPlayerConstParam.slidebarBoundingOffset;

	// 再生済を示すバー
	var played_rate = 0;
	if (forcePlayedTime !== null) {
		played_rate = forcePlayedTime;
	} else {
		played_rate = videoElem.duration ? (videoElem.currentTime / videoElem.duration) : 0;
	}
	var seekbar_played = playerElem.getElementsByClassName('video-player-seekbar-played')[0];
	if (seekbar_played) {
		seekbar_played.style.width = (played_rate * fixed_width) + "px";
	}

	// スライダー
	var slider = playerElem.getElementsByClassName('video-player-seekbar-slider')[0];
	if (slider) {
		slider.style.left = (played_rate * fixed_width + Cmn.VideoPlayerConstParam.slidebarXOffset) + "px";
	}

	// バッファ済を示すバー
	var buffered_rate = ((videoElem.buffered.length > 0) && videoElem.duration) ?
		(videoElem.buffered.end(0) / videoElem.duration) :
		0;
	var seekbar_buffered = playerElem.getElementsByClassName('video-player-seekbar-buffered')[0];
	if (seekbar_buffered) {
		seekbar_buffered.style.width = (buffered_rate * fixed_width) + "px";
	}
};

/* ----------------------------------------------------------------------------
 シークバーの位置をリセット
---------------------------------------------------------------------------- */
Cmn.resetSeekbar = function(videoElem, playerElem) {
	var seekbar_base = playerElem.getElementsByClassName('video-player-seekbar-base')[0];
	if (!seekbar_base) {
		return;
	}

	// 再生済を示すバー
	var seekbar_played = playerElem.getElementsByClassName('video-player-seekbar-played')[0];
	if (seekbar_played) {
		seekbar_played.style.width = "0px";
	}

	// スライダー
	var slider = playerElem.getElementsByClassName('video-player-seekbar-slider')[0];
	if (slider) {
		slider.style.left = Cmn.VideoPlayerConstParam.slidebarXOffset + "px";
	}

	// バッファ済を示すバー
	var seekbar_buffered = playerElem.getElementsByClassName('video-player-seekbar-buffered')[0];
	if (seekbar_buffered) {
		seekbar_buffered.style.width = "0px";
	}

	//Cmn.log( "resetSeekbar" );
};

/* ----------------------------------------------------------------------------
 動画ターゲットのセット
 @brief			この関数経由で操作する限り、target が付与された video エレメントは1つ以下であることが保障される。
 @param[in]		null を指定すると全ての video エレメントから target を除外する
---------------------------------------------------------------------------- */
Cmn.setVideoTarget = function(videoElem) {
	var video_array = document.getElementsByTagName('video');
	var i;
	var current_video = null;

	for (i = 0; i < video_array.length; ++i) {
		current_video = video_array[i];

		// ターゲットを解除
		if (current_video.hasAttribute('data-target')) {
			current_video.removeAttribute('data-target');

			// ターゲット解除にフックされた関数を実行
			var on_target_off_func = Cmn.VideoPlayerDataArray[current_video.id].eventFunc.onTargetOff;
			if (on_target_off_func) {
				on_target_off_func();
			}
		}
	}

	// 最後に指定された要素をターゲットにする
	if (videoElem) {
		videoElem.dataset.target = true;

		// ターゲット設定にフックされた関数を実行
		var on_target_on_func = Cmn.VideoPlayerDataArray[videoElem.id].eventFunc.onTargetOn;
		if (on_target_on_func) {
			on_target_on_func();
		}
	}
};

/* ----------------------------------------------------------------------------
 動画のソースを切り替える
---------------------------------------------------------------------------- */
Cmn.changeVideoSource = function(videoElem, playerElem, nextVideoPath, onEnd) {
	if (!videoElem) {
		return;
	}
	if (!playerElem) {
		return;
	}

	var source_change_data = Cmn.VideoPlayerDataArray[videoElem.id].sourceChange;
	if (source_change_data.isChanging) {
		Cmn.log("Warning: You must wait video changing.");
		return;
	}

	var video_source_elem = videoElem.getElementsByTagName('source')[0];
	if (!video_source_elem) {
		return;
	}

	// 必要事項を個別データ領域に書き込み
	source_change_data.reset();
	source_change_data.isChanging = true;

	// MEMO: 切り替え中の見た目が悪いので再生時間の復旧は行わない
	// source_change_data.nextStartCurrentTime = videoElem.currentTime || 0;

	// 切り替え終了時に呼び出される関数（メタ情報は既に読み込み終わっている）
	source_change_data.onEnd = function() {

		// 設定されていれば、currentTime を設定
		if (source_change_data.nextStartCurrentTime >= 0) {
			Cmn.setVideoCurrentTime(videoElem, source_change_data.nextStartCurrentTime);
		}

		if (videoElem.currentTime >= videoElem.duration) {
			// 再生時間最大で指定された場合は一時停止したままにしておく
			play_btn_elem.classList.remove('video-player-pause');
			play_btn_elem.classList.add('video-player-play');
		} else {
			// それ以外の場合は、動画をリンクさせるために少なくとも一旦再生状態におく( viewer の仕様)
			videoElem.play();

			var play_btn = playerElem.getElementsByClassName('video-player-play')[0];
			if (play_btn) {
				// 一時停止中だった場合は停止する
				videoElem.pause();
			}
		}

		if (typeof onEnd === 'function') {
			onEnd(); // 渡されたコールバック関数を実行
		}

		// 動画切り替え用のデータをリセット
		source_change_data.reset();
	};

	// シークバーのリセット
	Cmn.resetSeekbar(videoElem, playerElem);

	// 動画切り替え処理
	video_source_elem.src = nextVideoPath;
	videoElem.load();

	if (Cmn.isTargetedVideo(videoElem)) {
		// ターゲットになっていたら、生存チェック処理を再実行
		Cmn._startVideoLivingCheck(videoElem.id);
	}
};

/* ----------------------------------------------------------------------------
 動画がターゲットされているか判定する
---------------------------------------------------------------------------- */
Cmn.isTargetedVideo = function(videoElem) {
	return videoElem && videoElem.dataset.target;
};

/* ----------------------------------------------------------------------------
 動画プレイヤーのUIが操作可能か判定する
---------------------------------------------------------------------------- */
Cmn.canControllVideoPlayerUI = function(videoElem, isIgnoreTarget) {
	if (!videoElem) {
		Cmn.log("Warning: You shold not check null object in this function.");
		return false;
	}

	var player_data = Cmn.VideoPlayerDataArray[videoElem.id];
	if (!player_data) {
		Cmn.log("Warning: PlayerData is not found. video.id:" + video.id);
		return false;
	}

	return (isIgnoreTarget || Cmn.isTargetedVideo(videoElem)) && // 動画がターゲットである（引数でスキップ可能）
	!player_data.sourceChange.isChanging; // 動画切り替え中でない
};

/* ----------------------------------------------------------------------------
 video element を生成し、子要素に追加する
---------------------------------------------------------------------------- */
Cmn.addVideoElem = function(targetElement, videoId, playerId, videoPath, posterPath) {
	if (!targetElement) {
		return;
	}

	var video = document.createElement('video');
	video.id = videoId;
	video.classList.add('video-contents');
	video.poster = posterPath;

	var source = document.createElement('source');
	source.src = videoPath;

	var loading_icon_base = document.createElement('div');
	loading_icon_base.classList.add('loading-icon-base');
	loading_icon_base.classList.add('hidden');

	var loading_icon = document.createElement('div');
	loading_icon.classList.add('loading-icon');

	var loading_icon_rotate = document.createElement('div');
	loading_icon_rotate.classList.add('loading-icon-rotate');

	// element の関係性を設定
	video.appendChild(source);
	targetElement.appendChild(video);
	loading_icon.appendChild(loading_icon_rotate);
	loading_icon_base.appendChild(loading_icon);
	targetElement.appendChild(loading_icon_base);

	// 動画とプレイヤーの連動設定
	Cmn.linkVideoAndPlayer(videoId, playerId);

	// シークバーのリセット
	Cmn.resetSeekbar(video, document.getElementById(playerId));

	return video;
};

/* ----------------------------------------------------------------------------
 video element を子要素から削除する
---------------------------------------------------------------------------- */
Cmn.removeVideoElem = function(targetElement) {
	var video = targetElement.getElementsByTagName('video')[0];
	if (video) {
		targetElement.removeChild(video);
	}

	var loading_icon_base = targetElement.getElementsByClassName('loading-icon-base')[0];
	if (loading_icon_base) {
		targetElement.removeChild(loading_icon_base);
	}
};

/* ----------------------------------------------------------------------------
 スクロール可能表示アイコンの追加
---------------------------------------------------------------------------- */
Cmn.addScrollIcon = function(targetElement) {
	var base = document.createElement('div');
	base.classList.add('scroll-icon-base');

	var scroll_icon = document.createElement('div');
	scroll_icon.classList.add('scroll-icon');
	scroll_icon.classList.add('shown');
	scroll_icon.addEventListener(
		'webkitAnimationEnd',
		function() {
			// MEMO: animation で display:none にしてもクリックイベントを吸収してしまうため、アニメーション終了時に別のクラスに変更する特別対応を入れた
			if (scroll_icon.classList.contains('hidden')) {
				scroll_icon.classList.remove('hidden');
				scroll_icon.classList.add('hidden-end');
			}
		},
		false
	);

	var touch_pen = document.createElement('div');
	touch_pen.classList.add('scroll-icon-touchpen');

	var touch_trace = document.createElement('div');
	touch_trace.classList.add('scroll-icon-touchtrace');

	// element の関係性を設定
	base.appendChild(scroll_icon);
	scroll_icon.appendChild(touch_trace);
	scroll_icon.appendChild(touch_pen);
	targetElement.appendChild(base);

	var timer_func = null;
	var hide_scroll_icon = function() {
		if (timer_func) {
			clearInterval(timer_func);
		}
		timer_func = null;

		scroll_icon.classList.remove('shown');
		scroll_icon.classList.add('hidden');
	};

	// 画面拡大率を取得するためのタイマーを起動
	// MEMO: 早すぎると画面拡大率が正しく取得出来ないので、タイマーでチェックしている
	timer_func = setInterval(
		function() {
			//Cmn.log( window.innerWidth );
			// 一定以上拡大表示した場合は非表示にする
			if (window.innerWidth < 410) {
				hide_scroll_icon();
			}
		},
		Cmn.VideoPlayerConstParam.timerInterval
	);

	// イベントリスナ登録
	window.addEventListener(
		'scroll',
		function() {
			hide_scroll_icon();
		},
		false
	);
};

/* ----------------------------------------------------------------------------
 タッチして絵を変える
---------------------------------------------------------------------------- */
Cmn.changeImgOnTouch = function(targetElement, startImg, endImg, endFrame, currentFrame) {
	if (currentFrame == 0) {
		targetElement.src = startImg;
	}
	if (currentFrame >= endFrame || endFrame == 0) {
		targetElement.src = endImg;
		return;
	}

	// 16ms後に再実行（疑似60fps）
	setTimeout(function() {
		Cmn.changeImgOnTouch(targetElement, startImg, endImg, endFrame, currentFrame + 1);
	}, 16);
};

/* ----------------------------------------------------------------------------
 指定したフレーム後に関数を実行
---------------------------------------------------------------------------- */
Cmn.waitStartFunc = function( func, currentFrame, endFrame )
{
				if(currentFrame > endFrame){
					if (typeof func === 'function') {
						func();
					}
					return;
				}
				setTimeout( function(){ Cmn.waitStartFunc(func, currentFrame + 1, endFrame)}, 16);
}
