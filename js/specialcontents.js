"use strict";

/*-------------------------------------
 隠しページ 暗証番号とコンテンツの配列
-------------------------------------*/

//ワープページから行けるコンテンツページ
var warpChildContents = function(text_id, img_name) {
	this.textId = text_id;
	this.imgName = img_name;
};

// 土管１つのタイプ
var warp1Arg = function(child_contents1) {
	this.childContents1 = child_contents1;
};

var warpArgArray = {
	"0261": new warp1Arg(
		new warpChildContents("text-warp0261", "warp/bg_warpzone_middle01.gif")
	),
	"1406": new warp1Arg(
		new warpChildContents("text-warp1406", "warp/bg_warpzone_middle02.gif")
	),
	"2958": new warp1Arg(
		new warpChildContents("text-warp2958", "warp/bg_warpzone_middle03.gif")
	),
	"8010": new warp1Arg(
		new warpChildContents("text-warp8010", "warp/bg_warpzone_middle04.gif")
	),
	"2234": new warp1Arg(
		new warpChildContents("text-warp2234", "warp/bg_warpzone_middle05.gif")
	)
};

// 隠しコンテンツ
var SpContentsArg = function(play_report_id, video_name, poster_name_online, poster_name_offline, img_name, text_id, warp_contents) {
	this.playReportId = play_report_id; // プレイレポートID
	this.videoName = video_name; // 動画のファイル名
	this.posterNameOnline = poster_name_online; // 動画サムネイルのファイル名（オンライン）
	this.posterNameOffline = poster_name_offline; // 動画サムネイルのファイル名（オフライン）
	this.ImgName = img_name; // 静止画のファイル名
	this.textId = text_id; // テキストのID名
	this.warpContents = warp_contents; // ワープゾーンのコンテンツ
};

// 隠しコンテンツ
var SpContentsArgArray = {
	"01-1": new SpContentsArg(
		33,
		"01_1",
		"01_1.jpg",
		"01_1.jpg",
		null,
		"text01-1",
		null
	),
	"01-2": new SpContentsArg(
		34,
		"01_2",
		"01_2.jpg",
		"01_2.jpg",
		null,
		"text01-2",
		null
	),
	"4008": new SpContentsArg(
		35,
		"4008",
		"4008.jpg",
		"4008.jpg",
		null,
		"text4008",
		null
	),
	"6498": new SpContentsArg(
		36,
		"6498",
		"6498.jpg",
		"6498.jpg",
		null,
		"text6498",
		null
	),
	"0334": new SpContentsArg(
		37,
		"0334",
		"0334.jpg",
		"0334.jpg",
		null,
		"text0334",
		null
	),
	"2091": new SpContentsArg(
		38,
		"2091",
		"2091.jpg",
		"2091.jpg",
		null,
		"text2091",
		null
	),
	"1567": new SpContentsArg(
		39,
		"1567",
		"1567.jpg",
		"1567.jpg",
		null,
		"text1567",
		null
	),
	"4568": new SpContentsArg(
		40,
		"4568",
		"4568.jpg",
		"4568.jpg",
		null,
		"text4568",
		null
	),
	"6134": new SpContentsArg(
		41,
		"6134",
		"6134.jpg",
		"6134.jpg",
		null,
		"text6134",
		null
	),
	"10-1": new SpContentsArg(
		42,
		"10_1",
		"10_1.jpg",
		"10_1.jpg",
		null,
		"text10-1",
		null
	),
	"10-2": new SpContentsArg(
		43,
		"10_2",
		"10_2.jpg",
		"10_2.jpg",
		null,
		"text10-2",
		null
	),
	"10-3": new SpContentsArg(
		44,
		"10_3",
		"10_3.jpg",
		"10_3.jpg",
		null,
		"text10-3",
		null
	),
	"3928": new SpContentsArg(
		45,
		"3928",
		"3928.jpg",
		"3928.jpg",
		null,
		"text3928",
		null
	),
	"3452": new SpContentsArg(
		46,
		"3452",
		"3452.jpg",
		"3452.jpg",
		null,
		"text3452",
		null
	),
	"8889": new SpContentsArg(
		47,
		"8889",
		"8889.jpg",
		"8889.jpg",
		null,
		"text8889",
		null
	),
	"1044": new SpContentsArg(
		48,
		"1044",
		"1044.jpg",
		"1044.jpg",
		null,
		"text1044",
		null
	),
	"2374": new SpContentsArg(
		49,
		"2374",
		"2374.jpg",
		"2374.jpg",
		null,
		"text2374",
		null
	),
	"8237": new SpContentsArg(
		50,
		"8237",
		"8237.jpg",
		"8237.jpg",
		null,
		"text8237",
		null
	),
	"4766": new SpContentsArg(
		51,
		"4766",
		"4766.jpg",
		"4766.jpg",
		null,
		"text4766",
		null
	),
	"1289": new SpContentsArg(
		52,
		"1289",
		"1289.jpg",
		"1289.jpg",
		null,
		"text1289",
		null
	),
	"0658": new SpContentsArg(
		53,
		"0658",
		"0658.jpg",
		"0658.jpg",
		null,
		"text0658",
		null
	),
	"5623": new SpContentsArg(
		54,
		"5623",
		"5623.jpg",
		"5623.jpg",
		null,
		"text5623",
		null
	),
	"21-1": new SpContentsArg(
		55,
		"21_1",
		"21_1.jpg",
		"21_1.jpg",
		null,
		"text21-1",
		null
	),
	"21-2": new SpContentsArg(
		56,
		"21_2",
		"21_2.jpg",
		"21_2.jpg",
		null,
		"text21-2",
		null
	),
	"9189": new SpContentsArg(
		57,
		"9189",
		"9189.jpg",
		"9189.jpg",
		null,
		"text9189",
		null
	),
	"23-1": new SpContentsArg(
		58,
		"23_1",
		"23_1.jpg",
		"23_1.jpg",
		null,
		"text23-1",
		null
	),
	"23-2": new SpContentsArg(
		59,
		"23_2",
		"23_2.jpg",
		"23_2.jpg",
		null,
		"text23-2",
		null
	),
	"6074": new SpContentsArg(
		60,
		"6074",
		"6074.jpg",
		"6074.jpg",
		null,
		"text6074",
		null
	),
	"9373": new SpContentsArg(
		61,
		"9373",
		"9373.jpg",
		"9373.jpg",
		null,
		"text9373",
		null
	),
	"29-1": new SpContentsArg(
		62,
		"29_1",
		"29_1.jpg",
		"29_1.jpg",
		null,
		"text29-1",
		null
	),
	"29-2": new SpContentsArg(
		63,
		"29_2",
		"29_2.jpg",
		"29_2.jpg",
		null,
		"text29-2",
		null
	),
	"30-0": new SpContentsArg(
		64,
		"30_0",
		"30_0.jpg",
		"30_0.jpg",
		null,
		"text30-0",
		null
	),
	"30-1": new SpContentsArg(
		65,
		"30_1",
		"30_1.jpg",
		"30_1.jpg",
		null,
		"text30-1",
		null
	),
	"3891": new SpContentsArg(
		66,
		"3891",
		"3891.jpg",
		"3891.jpg",
		null,
		"text3891",
		null
	),
	"9481": new SpContentsArg(
		67,
		"9481",
		"9481.jpg",
		"9481.jpg",
		null,
		"text9481",
		null
	),
	"5783": new SpContentsArg(
		68,
		"5783",
		"5783.jpg",
		"5783.jpg",
		null,
		"text5783",
		null
	),
	"0087": new SpContentsArg(
		69,
		"0087",
		"0087.jpg",
		"0087.jpg",
		null,
		"text0087",
		null
	),
	"2763": new SpContentsArg(
		70,
		"2763",
		"2763.jpg",
		"2763.jpg",
		null,
		"text2763",
		null
	),
	"1521": new SpContentsArg(
		71,
		"1521",
		"1521.jpg",
		"1521.jpg",
		null,
		"text1521",
		null
	),
	"7065": new SpContentsArg(
		72,
		"7065",
		"7065.jpg",
		"7065.jpg",
		null,
		"text7065",
		null
	),
	"7962": new SpContentsArg(
		73,
		"7962",
		"7962.jpg",
		"7962.jpg",
		null,
		"text7962",
		null
	),
	"9435": new SpContentsArg(
		74,
		"9435",
		"9435.jpg",
		"9435.jpg",
		null,
		"text9435",
		null
	),
	"8743": new SpContentsArg(
		75,
		"8743",
		"8743.jpg",
		"8743.jpg",
		null,
		"text8743",
		null
	),
	"3578": new SpContentsArg(
		76,
		"3578",
		"3578.jpg",
		"3578.jpg",
		null,
		"text3578",
		null
	),
	"1928": new SpContentsArg(
		77,
		"1928",
		"1928.jpg",
		"1928.jpg",
		null,
		"text1928",
		null
	),
	"2453": new SpContentsArg(
		78,
		"2453",
		"2453.jpg",
		"2453.jpg",
		null,
		"text2453",
		null
	),
	"3754": new SpContentsArg(
		79,
		"3754",
		"3754.jpg",
		"3754.jpg",
		null,
		"text3754",
		null
	),
	"4102": new SpContentsArg(
		80,
		"4102",
		"4102.jpg",
		"4102.jpg",
		null,
		"text4102",
		null
	),
	"5011": new SpContentsArg(
		81,
		"5011",
		"5011.jpg",
		"5011.jpg",
		null,
		"text5011",
		null
	),
	"6391": new SpContentsArg(
		82,
		"6391",
		"6391.jpg",
		"6391.jpg",
		null,
		"text6391",
		null
	),
	"7147": new SpContentsArg(
		83,
		"7147",
		"7147.jpg",
		"7147.jpg",
		null,
		"text7147",
		null
	),
	"8129": new SpContentsArg(
		84,
		"8129",
		"8129.jpg",
		"8129.jpg",
		null,
		"text8129",
		null
	),
	"5421": new SpContentsArg(
		85,
		"5421",
		"5421.jpg",
		"5421.jpg",
		null,
		"text5421",
		null
	),
	"6012": new SpContentsArg(
		86,
		"6012",
		"6012.jpg",
		"6012.jpg",
		null,
		"text6012",
		null
	),
	"7842": new SpContentsArg(
		87,
		"7842",
		"7842.jpg",
		"7842.jpg",
		null,
		"text7842",
		null
	),
	"8641": new SpContentsArg(
		88,
		"8641",
		"8641.jpg",
		"8641.jpg",
		null,
		"text8641",
		null
	),
	"6695": new SpContentsArg(
		89,
		"6695",
		"6695.jpg",
		"6695.jpg",
		null,
		"text6695",
		null
	),
	"2116": new SpContentsArg(
		90,
		"2116",
		"2116.jpg",
		"2116.jpg",
		null,
		"text2116",
		null
	),
	"4486": new SpContentsArg(
		91,
		"4486",
		"4486.jpg",
		"4486.jpg",
		null,
		"text4486",
		null
	),
	// ワープゾーン
	"0261": new SpContentsArg(
		97,
		null,
		null,
		null,
		null,
		null,
		warpArgArray["0261"]
	),
	"1406": new SpContentsArg(
		98,
		null,
		null,
		null,
		null,
		null,
		warpArgArray["1406"]
	),
	"2958": new SpContentsArg(
		99,
		null,
		null,
		null,
		null,
		null,
		warpArgArray["2958"]
	),
	"8010": new SpContentsArg(
		100,
		null,
		null,
		null,
		null,
		null,
		warpArgArray["8010"]
	),
	"2234": new SpContentsArg(
		101,
		null,
		null,
		null,
		null,
		null,
		warpArgArray["2234"]
	),
	/* 非連動　完全隠し */
	"0913": new SpContentsArg(
		92,
		"0913",
		"0913.jpg",
		"0913.jpg",
		null,
		"text0913",
		null
	),
	"1309": new SpContentsArg(
		93,
		"1309",
		"1309.jpg",
		"1309.jpg",
		null,
		"text1309",
		null
	)
};
