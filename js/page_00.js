"use strict";

/*-------------------------------------
 暗号入力のデータ
-------------------------------------*/
var numberImg = null; // 番号表示用画像
var keyBtn = null; // 番号ボタン
var displayKeyIcon = null; // 鍵マークアイコン
var displayFrame = null; // 番号表示用ディスプレイの枠

var buttonInputNum = 4; // 入力に必要なボタンの数
var buttonInputData = new Array(buttonInputNum); // 押したボタンを覚えておく配列
buttonInputData = [-1, -1, -1, -1]; // 無効値で初期化
var inputCount = 0; // 何回押されたか覚えておく
var isValidateContents = false; // 隠れコンテンツを有効化するフラグ
var isInputMax = false; // 入力数Max状態
var isLockInput = false; // 全ボタン入力拒否状態

/*-------------------------------------
 ワープページのデータ
-------------------------------------*/
var isWarpMode = false; // ワープゾーンにいくフラグ

/*-------------------------------------
 隠しページのデータ
-------------------------------------*/
var currentSpContentsArg = null; // 現在選択されている隠しページのデータ（開いていない時の値の保証はしない）

// サーバー共通パス
var videoSharedPath = EpubInfo.videoserver + EpubInfo.platform + "/" + EpubInfo.region + "/" + EpubInfo.prodcode + "/" + EpubInfo.lang + "/";
var posterSharedPath = EpubInfo.imgserver + EpubInfo.platform + "/" + EpubInfo.region + "/" + EpubInfo.prodcode + "/" + EpubInfo.lang + "/";

//=======================================================================================================
// フェードアニメ関連
//=======================================================================================================

var sharedFadeObj = {
	onEndFadeOut: null,
};

window.addEventListener(
	'DOMContentLoaded',
	function(e) {
		var _setAnimEndFunc = function(elem) {
			if (!elem) {
				return;
			}

			elem.addEventListener(
				'webkitAnimationEnd',
				function() {
					// MEMO: animation で display:none にしてもクリックイベントを吸収してしまうため、アニメーション終了時に別のクラスに変更する特別対応を入れた
					if (elem.classList.contains('hidden')) {
						elem.classList.remove('hidden');
						elem.classList.add('hidden-end');

						// ロック解除
						changeLockInput(false);
					} else if (elem.classList.contains('shown')) {
						if (sharedFadeObj.onEndFadeOut) {
							sharedFadeObj.onEndFadeOut(elem);
						}
					}
				},
				false
			);
		};

		_setAnimEndFunc(document.getElementById('fade'));
	}
);

var _showScene = function(id) {
	var elem = document.getElementById(id);
	if (!elem) {
		return;
	}

	elem.classList.remove('hidden');
	elem.classList.remove('hidden-end');
	elem.classList.add('shown');
};

var _hideScene = function(id) {
	var elem = document.getElementById(id);
	if (!elem) {
		return;
	}

	elem.classList.remove('shown');
	elem.classList.add('hidden');
};

var changeScene = function(currentSceneId, nextSceneId, onEndFadeOut) {

	// MEMO フェード時にキー操作をすると暗転状態で空間ナビが見えてしまう問題の対処
	changeLockInput(true);

	// 画面を覆うオブジェクトを表示
	_showScene('fade');

	sharedFadeObj.onEndFadeOut = function(elem) {
		// 関数が与えられていたら実行
		if (typeof onEndFadeOut === 'function') {
			onEndFadeOut();
		}
		
		// 背景色をフェード色と合わせることで、画面サイズが変わることによるちらつきを回避
		document.body.style.backgroundColor = "#000";

		// MEMO: 背景色の反映を正確に取得出来ないので、待ち時間を入れている
		setTimeout(
			function() {
				// 背景色を戻す
				document.body.style.backgroundColor = "";

				// 要素を入れ替える
				_hideScene(currentSceneId);
				_showScene(nextSceneId);
				
				// 画面を覆うオブジェクトを消す
				setTimeout(
					function() {
						_hideScene('fade');
					},
					100
				);
			},
			100
		);
	};
};


// 初期化
var init = function() {

	numberImg = $("#form-window > li >img");
	keyBtn = $(".N-default");

	displayKeyIcon = $("#key-img");
	displayFrame = $("#form-window");

	setKeyBtn();
	setClearBtn();
	setCloseBtn();
	setSubLBtn();
};

// 暗号ボタンの設定
var setKeyBtn = function() {
	for (var i = 0; i < keyBtn.length; ++i) {
		keyBtn[i].addEventListener("touchend", function() {
			onUpKeyBtn(this);
		});
		keyBtn[i].addEventListener("touchstart", function() {
			onDownKeyBtn(this);
		});
		keyBtn[i].addEventListener("touchcancel", function() {
			onUpKeyBtn(this);
		});
		keyBtn[i].addEventListener("click", function() {
			this.blur();
			onClickKeyBtn(this);
		});
		keyBtn[i].addEventListener("keyup", function() {
			if (event.keyCode == 13) onClickKeyBtn(this);
		});
	}
};

// Cボタンの設定
var setClearBtn = function() {
	var clear_btn = $("#C");
	clear_btn[0].addEventListener("touchend", function() {
		if (isLockInput) {
			return;
		}
		this.className = "N-btn N-clear-default";
	});
	clear_btn[0].addEventListener("touchstart", function() {
		if (isLockInput) {
			return;
		}
		this.className = "N-btn N-clear-push";
	});
	clear_btn[0].addEventListener("touchcancel", function() {
		if (isLockInput) {
			return;
		}
		this.className = "N-btn N-clear-default";
	});
	clear_btn[0].addEventListener("click", function() {
		this.blur();
		if (isLockInput) {
			return;
		}
		onClickClearButton();
		this.className = "N-btn N-clear-default";
	});
	clear_btn[0].addEventListener("keyup", function() {
		if (isLockInput) {
			return;
		}
		if (event.keyCode == 13) onClickClearButton();
	});
};

// 閉じるボタンの設定
var setCloseBtn = function() {

	var close_btn = $("#close-btn-online, #close-btn-offline");
	var close_btn_numberbox = $("#close-btn-numberbox");

	var close_btn_warp = $("#close-btn-warp");
	var close_btn_warp_contents = $("#close-btn-warp-contents");
	var anchor_btn_warp_contents = $("#anchor-btn-warp-contents");

	for (var i = 0; i < close_btn.length; i++) {
		close_btn[i].addEventListener("touchend", function() {
			if (isLockInput) {
				return;
			}
			this.className = "close-btn close-default";
		});
		close_btn[i].addEventListener("touchstart", function() {
			if (isLockInput) {
				return;
			}
			this.className = "close-btn close-push";
		});
		close_btn[i].addEventListener("touchcancel", function() {
			if (isLockInput) {
				return;
			}
			this.className = "close-btn close-default";
		});
		close_btn[i].addEventListener("click", function() {
			this.blur();
			if (isLockInput) {
				return;
			}
			this.className = "close-btn close-default";
			onClickCloseBtn();
		});
		close_btn[i].addEventListener("keyup", function() {
			if (isLockInput) {
				return;
			}
			if (event.keyCode == 13) {
				onClickCloseBtn();
				this.blur(); /* フェード時にカーソルが見えるのでblurをかける */
			}
		});
	}

	close_btn_numberbox[0].addEventListener("touchend", function() {
		if (isLockInput) {
			return;
		}
		this.className = "close-btn close-default";
	});
	close_btn_numberbox[0].addEventListener("touchstart", function() {
		if (isLockInput) {
			return;
		}
		this.className = "close-btn close-push";
	});
	close_btn_numberbox[0].addEventListener("touchcancel", function() {
		if (isLockInput) {
			return;
		}
		this.className = "close-btn close-default";
	});
	close_btn_numberbox[0].addEventListener("click", function() {
		this.blur();
		if (isLockInput) {
			return;
		}
		this.className = "close-btn close-default";
		onClickNumberBoxCloseBtn(document.getElementById('btn-key'));
	});
	close_btn_numberbox[0].addEventListener("keyup", function() {
		if (isLockInput) {
			return;
		}
		if (event.keyCode == 13) {
			onClickNumberBoxCloseBtn(document.getElementById('btn-key'))
			this.blur(); /* フェード時にカーソルが見えるのでblurをかける */
		}
	});

	close_btn_warp[0].addEventListener("touchend", function() {
		if (isLockInput) {
			return;
		}
		this.className = "close-btn close-default btn-warp";
	});
	close_btn_warp[0].addEventListener("touchstart", function() {
		if (isLockInput) {
			return;
		}
		this.className = "close-btn close-push btn-warp";
	});
	close_btn_warp[0].addEventListener("touchcancel", function() {
		if (isLockInput) {
			return;
		}
		this.className = "close-btn close-default btn-warp";
	});
	close_btn_warp[0].addEventListener("click", function() {
		if (isLockInput) {
			return;
		}
		this.blur();
		this.className = "close-btn close-default btn-warp";
		onClickWarpCloseBtn();
	});
	close_btn_warp[0].addEventListener("keyup", function() {
		if (event.keyCode == 13) {
			onClickWarpCloseBtn();
			this.blur(); /* フェード時にカーソルが見えるのでblurをかける */
		}
	});

	close_btn_warp_contents[0].addEventListener("touchend", function() {
		if (isLockInput) {
			return;
		}
		this.className = "close-btn close-default";
	});
	close_btn_warp_contents[0].addEventListener("touchstart", function() {
		if (isLockInput) {
			return;
		}
		this.className = "close-btn close-push";
	});
	close_btn_warp_contents[0].addEventListener("touchcancel", function() {
		if (isLockInput) {
			return;
		}
		this.className = "close-btn close-default";
	});
	close_btn_warp_contents[0].addEventListener("click", function() {
		if (isLockInput) {
			return;
		}
		this.blur();
		this.className = "close-btn close-default";
		onClickWarpCloseBtn();
	});
	close_btn_warp_contents[0].addEventListener("keyup", function() {
		if (event.keyCode == 13) {
			onClickWarpCloseBtn();
			this.blur(); /* フェード時にカーソルが見えるのでblurをかける */
		}
	});

	anchor_btn_warp_contents[0].addEventListener("touchend", function() {
		this.className = "warp-anchor-btn";
	});
	anchor_btn_warp_contents[0].addEventListener("touchstart", function() {
		this.className = "warp-anchor-btn select";
	});
	anchor_btn_warp_contents[0].addEventListener("touchcancel", function() {
		this.className = "warp-anchor-btn";
	});
	anchor_btn_warp_contents[0].addEventListener("click", function() {
		this.blur();
		this.className = "warp-anchor-btn";
		Cmn.setLocation("#warp-bottom-area");
	});
	anchor_btn_warp_contents[0].addEventListener("keyup", function() {
		if (event.keyCode == 13) {
			Cmn.setLocation("#warp-bottom-area");
		}
	});
};

// 暗号ボタン タッチ時の処理
var onDownKeyBtn = function(targetElement) {
	if (isInputMax) {
		return;
	}
	targetElement.className = "N-btn N-push";
};

// 暗号ボタン タッチオフ時の処理
var onUpKeyBtn = function(targetElement) {
	if (isInputMax) {
		return;
	}
	targetElement.className = "N-btn N-default";
};

// スタッフクレジットのボタン設定
var setSubLBtn = function() {
	var subL_btn = document.getElementById("subL-btn");
	var balloon_cursor = document.getElementById("balloon-cursor");
	balloon_cursor.addEventListener("touchend", function() {
		Cmn.onUpBtn(subL_btn, "subL_btn");
	});
	balloon_cursor.addEventListener("touchstart", function() {
		Cmn.onDownBtn(subL_btn, "subL_btn select");
	});
	balloon_cursor.addEventListener("touchcancel", function() {
		Cmn.onUpBtn(subL_btn, "subL_btn");
	});
	balloon_cursor.addEventListener("click", function() {
		this.blur();
		Cmn.setLocation('page_10.xhtml');
	});
	balloon_cursor.addEventListener("keyup", function() {
		if (event.keyCode == 13) Cmn.setLocation('page_10.xhtml');
	});
};

// 閉じるボタンをクリックしたときの処理
var onClickCloseBtn = function() {
	// フェード中に動画の削除を行う
	// MEMO: 描画処理が落ちた時に描画されてしまうことがあるので、削除しておく
	changeScene('scene03', 'scene02', function() {
		deleteOldVideo(false);
	});

	resetKeyInput();

	// 動画を一時停止（こちらは即時的に働く）
	var video_elem = document.getElementById('specialVideoOnline');
	if (video_elem) {
		video_elem.pause();
	}
};

// 暗号ボタンをクリックしたときの処理
var onClickKeyBtn = function(targetElement) {
	if (isInputMax) {
		return;
	}

	var btn_index = targetElement.id;
	setInputButton(btn_index);
	showSpecialContents();
};

// Cボタンをクリックしたときの処理
var onClickClearButton = function() {
	resetKeyInput();
};

// 番号入力画面の閉じるボタンをクリックしたときの処理
var onClickNumberBoxCloseBtn = function(targetElement) {
	targetElement.classList.remove("select");
	targetElement.classList.remove("active");

	resetKeyInput();
	changeScene('scene02', 'scene01', null);
};

// Keyアイコン 決定時の挙動
var onClickKeyIcon = function() {
	Cmn.notifyPlayReport(23);
	changeScene('scene01', 'scene02', null);
};

// ワープページの閉じるボタン決定時の挙動
var onClickWarpCloseBtn = function() {
	//背景色をもとに戻す
	document.body.classList.remove("warp");
	isWarpMode = false; //ワープゾーンに行くフラグ
	resetKeyInput();
	changeScene('scene04', 'scene02', null);
};

var blurAllKeyBtn = function() {
	for (var i = 0; i < keyBtn.length; ++i) {
		keyBtn[i].blur();
	}
};

// 入力情報をリセット
var resetKeyInput = function() {
	buttonInputData = [-1, -1, -1, -1];
	isValidateContents = false;
	inputCount = 0;
	isInputMax = false;

	//ボタンをもとに戻す
	for (var i = 0; keyBtn.length > i; i++) {
		keyBtn[i].className = "N-btn N-default";
		keyBtn[i].valid = false;

	}

	//閉じるボタン、Cボタンの状態も元に戻す
	var clear_btn = $("#C");
	clear_btn[0].className = "N-btn N-clear-default";

	var close_btn_numberbox = $("#close-btn-numberbox");
	close_btn_numberbox[0].className = "close-btn close-default";

	var close_btn_online = $("#close-btn-online");
	close_btn_online[0].className = "close-btn close-default";

	var close_btn_offline = $("#close-btn-offline");
	close_btn_offline[0].className = "close-btn close-default";

	var close_btn_warp = $("#close-btn-warp");
	close_btn_warp[0].className = "close-btn close-default btn-warp";

	var close_btn_warp_contents = $("#close-btn-warp-contents");
	close_btn_warp_contents[0].className = "close-btn close-default";

	//表示もリセット
	resetNumberImg();
};

// クリックしたボタンを覚える
var setInputButton = function(btn_index) {
	//番号表示を変える
	changeNumberImg(btn_index, inputCount);

	// hyphenのときは-として記憶する
	if (btn_index == "hyphen") {
		btn_index = "-";
	}
	buttonInputData[inputCount] = btn_index;

	if (inputCount >= buttonInputData.length - 1) {
		isInputMax = true;
		inputCount = 0;
		return;
	}
	inputCount++;

};

// 番号の絵を切り替える
var changeNumberImg = function(btn_index, push_count) {
	numberImg[push_count].src = "img/number/img_number_" + btn_index + ".png";
};

// 番号の絵をリセット
var resetNumberImg = function() {
	for (var i = 0; i < buttonInputNum; i++) {
		numberImg[i].src = "img/number/img_number_none.png";
	}
};

// 動画アドレスの取得
var createVideoPath = function(spContentArg) {
	if (!spContentArg) {
		Cmn.log("[createVideoPath] Warning: you should not set null object.");
		return "";
	}

	var is_hi_quality = false;

	// 動画の画質選択状態を判定
	var quality_controller_elem = document.getElementById('specialVideoQualityController');
	if (quality_controller_elem) {
		var hi_quality_btn_elem = quality_controller_elem.getElementsByClassName('quality-h')[0];
		is_hi_quality = hi_quality_btn_elem ? hi_quality_btn_elem.classList.contains('active') : false;
	}

	return videoSharedPath + spContentArg.videoName + (is_hi_quality ? "_hq.mp4" : "_lq.mp4");
};

// 隠れコンテンツを表示
var showSpecialContents = function() {
	if (isInputMax) {
		isValidateContents = true;
		var sp_arg = getArgFromInputData(buttonInputData);
		if (!sp_arg) {
			isValidateContents = false;
			// 失敗時アニメ
			inputFailureAnim(displayKeyIcon, displayFrame, 90, 0, true);
		}
	}

	if (isValidateContents) {
		// 現在開いているコンテンツの情報を保存
		currentSpContentsArg = sp_arg;

		// フェード時にカーソルが見えるので暗号ボタンにはblurをかける
		blurAllKeyBtn();

		// 隠しコンテンツ作成
		createContents(sp_arg);

		// 成功時アニメ
		inputSuccessAnim(displayKeyIcon, displayFrame, 20, 0, true);
	}
};

var showWarpContents = function() {

	$("#warp-middle-area").removeClass("hidden");
	$("#warp-bottom-area").removeClass("hidden");

	// プレイレポート
	if (currentSpContentsArg && currentSpContentsArg.playReportId) {
		Cmn.notifyPlayReport(currentSpContentsArg.playReportId);
	}

	var mario = $("#mario");
	marioWarpAnim(mario, 0, 0, 0, 90, 60, 0, true, true);
};

// 隠しコンテンツの要素を作る
var createContents = function(spContentArg) {
	var is_video = false;
	var is_img = false;
	var is_text = false;
	var is_warp = false;

	if (spContentArg.videoName != null) {
		is_video = true;
	}
	if (spContentArg.imgName != null) {
		is_img = true;
	}
	if (spContentArg.textId != null) {
		is_text = true;
	}
	if (spContentArg.warpContents != null) {
		is_warp = true;
	}


	// パス生成
	var video_path = createVideoPath(spContentArg);
	var poster_path_online = posterSharedPath + spContentArg.posterNameOnline;
	var poster_path_offline = "img/thumb/" + spContentArg.posterNameOffline;
	var img_path = "img/" + spContentArg.imgName;

	// タグ生成
	var new_img_online = document.createElement("img");
	var new_img_offline = document.createElement("img");
	var new_warp_img = document.createElement("img");

	// 既存のタグ
	var specialTextOnline = document.getElementById("specialTextOnline");
	var specialTextOffline = document.getElementById("specialTextOffline");
	var specialImgOnline = document.getElementById("specialImgOnline");
	var specialImgOffline = document.getElementById("specialImgOffline");

	var video_player = document.getElementById('specialVideoPlayer');
	var video_img_elem = document.getElementById('specialVideoImg');

	var warp_img = document.getElementById('warp-middle-img');
	var warp_text = document.getElementById('warp-contents-text');

	var parent = null;

	if (is_video) {
		// サムネイル画像指定（オフライン時）
		new_img_offline.src = poster_path_offline;

		// 静止画を非表示に
		if (specialImgOnline) {
			specialImgOnline.style.display = "none";
		}

		// 元の動画を削除
		// MEMO: 本来はフォーカスOff時の処理に任せたいのだが、動画のソース差し替えの対応が煩雑になるので直接deleteしてしまっている
		deleteOldVideo(true);

		// 新規動画を追加(プレイヤーとのリンクもセットで行われる)
		createNewVideo(video_path, poster_path_online);
	}
	if (is_img) {
		// 静止画指定
		new_img_online.src = img_path;
		new_img_offline.src = img_path;

		// 動画を非表示に
		var special_video = document.getElementById("specialVideoOnline");
		if (special_video) {
			special_video.style.display = "none";
		}

		// 各属性を設定
		new_img_online.id = specialImgOnline.id;
		new_img_online.className = specialImgOnline.className;

		// 新規静止画を追加
		if (isOnLine()) {
			parent = specialImgOnline.parentNode;
			parent.insertBefore(new_img_online, specialImgOnline);
			parent.removeChild(parent.getElementsByTagName("img")[2]);
		}
		if (video_player) {
			video_player.style.display = 'none';
		}
		if (video_img_elem) {
			video_img_elem.style.display = 'none';
		}
	}

	// オフライン時の静止画（動画のサムネイルor静止画）
	if (new_img_offline) {
		new_img_offline.id = specialImgOffline.id;
		new_img_offline.className = specialImgOffline.className;
		new_img_offline.style.display = "inline";
		parent = specialImgOffline.parentNode;
		parent.insertBefore(new_img_offline, specialImgOffline);
		parent.removeChild(parent.getElementsByTagName("img")[1]);
	}

	if (is_text) {
		// pタグのテキストを置換
		var new_text = document.getElementById(spContentArg.textId).innerHTML;
		specialTextOnline.innerHTML = new_text;
		specialTextOffline.innerHTML = new_text;
	}

	if (is_warp) {

		isWarpMode = true;
		var new_warp_text = document.getElementById(spContentArg.warpContents.childContents1.textId).innerHTML;
		warp_text.innerHTML = new_warp_text;

		if (spContentArg.warpContents.childContents1.imgName) {
			// 背景画像を差し替える
			new_warp_img.src = "img/" + spContentArg.warpContents.childContents1.imgName;
			new_warp_img.id = warp_img.id;
			new_warp_img.className = warp_img.className;
			new_warp_img.style.display = "inline";
			parent = warp_img.parentNode;
			parent.insertBefore(new_warp_img, warp_img);
			parent.removeChild(parent.getElementsByTagName("img")[1]);
		}
	}
};

// 入力成功時のアニメ
var inputSuccessAnim = function(keyIconElement, displayElement, endFrame, currentFrame, isLockTouch) {
	if (isLockTouch) {
		changeLockInput(true);
	}

	if (currentFrame == 0) {
		keyIconElement.addClass("win");
		displayElement.addClass("win");
		for (var i = 0; i < buttonInputNum; i++) {
			numberImg[i].style.WebkitAnimationDelay = "" + (0.1 + i * 0.14) + "s";
		}
	}
	// 終了条件を満たしている場合は、目標位置に移動し終了
	if (currentFrame >= endFrame || endFrame == 0) {
		keyIconElement.removeClass("win");
		displayElement.removeClass("win");

		//ワープゾーン表示
		if (isWarpMode) {
			initWarpZone();
			changeScene('scene02', 'scene04', null);
		}
		//隠しコンテンツ表示
		else {
			changeScene('scene02', 'scene03', null);
		}
		return;
	}

	// 16ms後に再実行（疑似60fps）
	setTimeout(function() {
		inputSuccessAnim(keyIconElement, displayElement, endFrame, currentFrame + 1, false);
	}, 16);
};

// 入力失敗時のアニメ
var inputFailureAnim = function(keyIconElement, displayElement, endFrame, currentFrame, isLockTouch) {
	if (isLockTouch) {
		changeLockInput(true);
	}

	if (currentFrame == 0) {
		keyIconElement.addClass("error");
		displayElement.addClass("error");
	}
	// 終了条件を満たしている場合は、目標位置に移動し終了
	if (currentFrame >= endFrame || endFrame == 0) {
		keyIconElement.removeClass("error");
		displayElement.removeClass("error");
		resetKeyInput();
		changeLockInput(false);
		return;
	}

	// 16ms後に再実行（疑似60fps）
	setTimeout(function() {
		inputFailureAnim(keyIconElement, displayElement, endFrame, currentFrame + 1, false);
	}, 16);
};

// ワープゾーン設定初期化
var initWarpZone = function() {

	setTimeout(
		function() {
			// 背景色を黒にする　
			// MEMO フェード終わったタイミングを検知できないので待ち時間をいれておく
			document.body.classList.add("warp");
		}, 1500 );

	$("#warp-middle-area").addClass("hidden");
	$("#warp-bottom-area").addClass("hidden");

	// マリオ位置初期化
	// MEMO removeAttr("style")が何故か効かなかったので以下の方法で処理
	var mario_top = $("#mario")
	mario_top.attr({"style":"display:block"});
	mario_top.attr({"style":""});
	$("#mario-btm").attr({"style":""});

	$("#attention").css({
		"visibility": "visible"
	});

	setBtnMarioAndDokan();
};

// マリオと土管の操作イベントを登録
var setBtnMarioAndDokan = function()
{
	var mario = document.getElementById("mario");
	mario.onkeyup = function(event){
		if(event.keyCode == 13){
			this.blur();
			document.getElementById('close-btn-warp').className = 'close-btn close-default btn-warp';
			showWarpContents();
		}
	};
	mario.onclick= function(event){ this.blur(); showWarpContents(); };
	document.getElementById("dokan-btn").onclick = function(event) {
		showWarpContents();
	};
};

// ワープゾーン マリオアニメ
var marioWarpAnim = function(targetElement, startX, startY, targetX, targetY, endFrame, currentFrame, isLockTouch, isChainScroll) {
	//土管に入るアニメ
	var marioDokanAnim = function(targetElement, startX, startY, targetX, targetY, endFrame, currentFrame, isLockTouch, isChainScroll) {
		if (isLockTouch) {
			// マリオのタッチを無効化
			document.getElementById("mario").onclick = function(event) {
			 	event.preventDefault();
			};
			//土管のタッチを無効化
			document.getElementById("dokan-btn").onclick = function(event) {
				event.preventDefault();
			};
			changeLockInput(true);
		}

		var currentRate = currentFrame / endFrame;
		var nowX = (targetX - startX)*currentRate + startX;
		var nowY = (targetY - startY)*currentRate + startY;

		// 終了条件を満たしている場合は、目標位置に移動し終了
		if (currentFrame >= endFrame || endFrame == 0) {
			targetElement.css({
				"-webkit-transform": "translate(" + nowX + "px, " + nowY + "px)"
			});

			// マリオに空間ナビが当たってしまうので非表示
			$("#mario").attr({"style":"display:none"});

			if(!isChainScroll){
				changeLockInput(false);
				return;
			}
			// ページスクロール
			var start_x, end_x;
			start_x = end_x = $(window).scrollLeft();
			var start_y = $(window).scrollTop();
			var end_y = $("#warp-bottom-area").offset().top;
			dokanScrollAnim(start_x, start_y, end_x, end_y, 150, 0, true);
			return;
		}
		targetElement.css({
			"-webkit-transform": "translate(" + nowX + "px, " + nowY + "px)"
		});

		// 16ms後に再実行（疑似60fps）
		setTimeout(function() {
			marioDokanAnim(targetElement, startX, startY, targetX, targetY, endFrame, currentFrame + 1, false, isChainScroll);
		}, 16);
	};

	// 土管スクロールアニメ
	function dokanScrollAnim(startX, startY, targetX, targetY, endFrame, currentFrame, isLockTouch) {
		var currentRate = currentFrame / endFrame;
		var nowX = (targetX - startX) * currentRate + startX;
		var nowY = (targetY - startY) * currentRate + startY;

		// 終了条件を満たしている場合は、目標位置に移動し終了
		if (currentFrame >= endFrame || endFrame == 0) {
			window.scroll(targetX, targetY);

			// マリオが土管から出てくるアニメ がたつき回避のため実行をウェイトさせる
			Cmn.waitStartFunc( function() {
				marioDokanAnim($("#mario-btm"), 0, 0, 0, 90, 60, 0, true, false)
			}, 0, 20);

			//矢印消す
			$("#attention").css({
				"visibility": "hidden"
			});

			return;
		}
		window.scroll(Math.round(nowX), Math.round(nowY));
		// 16ms後に再実行（疑似60fps）
		setTimeout(function() {
			dokanScrollAnim(startX, startY, targetX, targetY, endFrame, currentFrame + 1, false);
		}, 16);
	};

	marioDokanAnim(targetElement, startX, startY, targetX, targetY, endFrame, currentFrame, isLockTouch, isChainScroll);
}

// Touch入力 キー入力を無効化
var changeLockInput = function(isLock) {
	if (isLock) {
		Cmn.log("lock");
		isLockInput = true;
		document.body.ontouchstart = function(e) {
			e.preventDefault();
		}; // これでスクロールが無効になる
		document.body.ontouchend = function(e) {
			e.preventDefault();
		};
		document.body.ontouchmove = function(e) {
			e.preventDefault();
		};
		window.onkeydown = function(e) {
			e.preventDefault();
		};
	} else {
		Cmn.log("unlock");
		isLockInput = false;
		document.body.ontouchstart = function(e) {}; // 有効化;
		document.body.ontouchend = function(e) {};
		document.body.ontouchmove = function(e) {};
		window.onkeydown = function(e) {};
	}
}
// 入力値から隠しコンテンツのArgを取得
var getArgFromInputData = function(input_data) {
	var inputStr = null;

	for (var i = 0; i < input_data.length; i++) {
		if (i == 0) {
			inputStr = String(input_data[i]);
		} else {
			inputStr = inputStr + String(input_data[i]);
		}
	}
	Cmn.log(inputStr);
	Cmn.log(SpContentsArgArray[inputStr]);
	return SpContentsArgArray[inputStr];
};

//=======================================================================================================
// 動画関連
//=======================================================================================================

window.addEventListener(
	'DOMContentLoaded',
	function(e) {
		// 動画プレイヤーの生成
		Cmn.createVideoPlayer(
			document.getElementById("specialVideoFrame"),
			"specialVideoPlayer",
			"specialVideoOnline",
			// onPlayClicked
			function() {
				playVideo(document.getElementById("specialVideoOnline"));
				return true;
			},
			// onPauseClicked
			function() {
				document.getElementById("specialVideoOnline").pause();
				return true;
			},
			// onTargetOff
			function() {
				var video_elem = document.getElementById("specialVideoOnline");
				var video_source_elem = video_elem.getElementsByTagName("source")[0];
				var poster_path = video_elem ? video_elem.poster : "";
				var video_path = video_source_elem ? video_source_elem.src : "";

				deleteOldVideo(true);
				createNewVideo(video_path, poster_path);

				// 動画切り替え時表示用のサムネイルを非表示
				var transition_thumb_elem = document.getElementById("specialVideoThumb");
				if (transition_thumb_elem) {
					transition_thumb_elem.style.display = 'none';
				}

				// 動画を表示
				video_elem.style.display = 'inline';
			}
		);

		// MEMO: 動画とプレイヤーの連動設定は生成時に行っている
		//Cmn.linkVideoAndPlayer( "specialVideoOnline", "specialVideoPlayer" );

		// 画質切り替えボタンの初期化
		initQualityControllBtn(document.getElementById('specialVideoQualityController'));
	}
);

var deleteOldVideo = function(isResetSeekBar) {
	var video_elem = document.getElementById("specialVideoOnline");
	var player_elem = document.getElementById("specialVideoPlayer");
	if (isResetSeekBar && video_elem && player_elem) {
		Cmn.resetSeekbar(video_elem, player_elem);
	}

	var reserved_video_pos = document.getElementById('reservedVideoPos');
	Cmn.removeVideoElem(reserved_video_pos);
};

var createNewVideo = function(videoPath, posterPath) {
	// MEMO: トップページのみポスターをそのまま表示している
	var reserved_video_pos = document.getElementById('reservedVideoPos');
	Cmn.addVideoElem(
		reserved_video_pos,
		'specialVideoOnline',
		'specialVideoPlayer',
		videoPath,
		posterPath
	);

	// 画質切り替え中にサイズが変わってしまうのを防ぐために、高さを指定しておく
	var video_elem = document.getElementById('specialVideoOnline');
	if (video_elem) {
		video_elem.classList.add('page0-video-height');
	}

	var video_img_elem = document.getElementById('specialVideoImg');
	if (video_img_elem) {
		video_img_elem.style.display = 'inline';
	}

	var video_player = document.getElementById('specialVideoPlayer');
	if (video_player) {
		video_player.style.display = 'block';
	}

	// 動画切り替え時表示用のサムネイルを設定し、非表示にしておく
	var transition_thumb_elem = document.getElementById("specialVideoThumb");
	if (transition_thumb_elem) {
		transition_thumb_elem.style.display = 'none';
		transition_thumb_elem.src = posterPath;
	}
};

// 要求された動画を再生する
var playVideo = function() {
	var img_elem = document.getElementById('specialVideoImg');
	if (!img_elem) {
		return;
	}
	var video_elem = document.getElementById('specialVideoOnline');
	if (!video_elem) {
		return;
	}

	if (Cmn.isTargetedVideo(video_elem)) {
		// 既に動画が有効な場合は、再生するだけ
		video_elem.play();
	} else {
		// 動画を有効化して再生
		Cmn.setVideoTarget(video_elem);
		video_elem.play();
		img_elem.style.display = "none";
		video_elem.style.display = "inline";

		// 動画切り替え時表示用のサムネイルを非表示
		var transition_thumb_elem = document.getElementById("specialVideoThumb");
		if (transition_thumb_elem) {
			transition_thumb_elem.style.display = 'none';
		}

		// プレイレポート
		if (currentSpContentsArg && currentSpContentsArg.playReportId) {
			Cmn.notifyPlayReport(currentSpContentsArg.playReportId);
		}
	}
};

// MEMO: 動画プレイヤー構築後に実行することを求める
var initQualityControllBtn = function(rootElem) {
	var hi_btn_elem = rootElem.getElementsByClassName('quality-h')[0];
	var low_btn_elem = rootElem.getElementsByClassName('quality-l')[0];

	// ローカルストレージを参照して、ボタンの状態を設定
	if (localStorage.getItem('VideoQuality') === 'hi') {
		hi_btn_elem.classList.add('active');
	} else {
		// MEMO: 参照出来なかった場合は、低画質として扱う
		low_btn_elem.classList.add('active');
	}

	var set_event = function(elem, qualityStr) {
		if (!elem) {
			return;
		}
		var player_elem = document.getElementById('specialVideoPlayer');
		if (!player_elem) {
			return;
		}

		var btn_touch_end = function(e) {
			elem.classList.remove('select');
		};

		elem.addEventListener(
			'touchstart',
			function(e) {
				var video_elem = document.getElementById('specialVideoOnline');
				if (!video_elem) {
					return;
				}

				// UIが操作できない状態であれば、何もしない（ターゲットでなくても許可）
				if (!Cmn.canControllVideoPlayerUI(video_elem, true)) {
					return;
				}

				// 選択状態の場合は何もしない
				if (elem.classList.contains('active')) {
					return;
				}

				elem.classList.add('select');
			},
			false
		);
		elem.addEventListener(
			'touchend',
			btn_touch_end,
			false
		);
		elem.addEventListener(
			'touchcancel',
			btn_touch_end,
			false
		);
		elem.onclick = function() {
			var video_elem = document.getElementById('specialVideoOnline');
			if (!video_elem) {
				return;
			}

			// UIが操作できない状態であれば、何もしない（ターゲットでなくても許可）
			if (!Cmn.canControllVideoPlayerUI(video_elem, true)) {
				return;
			}

			// 選択状態の場合は何もしない
			if (elem.classList.contains('active')) {
				return;
			}

			// ボタンの見た目の変更
			if (qualityStr === 'hi') {
				low_btn_elem.classList.remove('active');
			} else {
				hi_btn_elem.classList.remove('active');
			}

			elem.classList.remove('select'); // touchOff でも remove しているが保険で消しておく
			elem.classList.add('active');

			// ローカルストレージに選択したボタンを保存
			localStorage.setItem('VideoQuality', qualityStr);

			// 動画切り替え時表示用のサムネイルを表示
			var transition_thumb_elem = document.getElementById("specialVideoThumb");
			if (transition_thumb_elem) {
				transition_thumb_elem.style.display = 'inline';
			}

			// 動画は非表示
			video_elem.style.display = 'none';

			// 動画を入れ替える
			var video_path = createVideoPath(currentSpContentsArg);
			Cmn.changeVideoSource(
				video_elem,
				player_elem,
				video_path,
				// onEnd
				function() {
					// 動画切り替え時表示用のサムネイルを非表示
					if (transition_thumb_elem) {
						transition_thumb_elem.style.display = 'none';
					}

					// 動画を表示
					video_elem.style.display = 'inline';
				}
			);
		};
	};

	// null 判定は関数内で行う
	set_event(hi_btn_elem, 'hi');
	set_event(low_btn_elem, 'low');
};
