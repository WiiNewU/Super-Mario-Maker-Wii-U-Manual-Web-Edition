"use strict";

var EpubInfo = function() {};

EpubInfo.platform = "WUP";
EpubInfo.region = "JPN";
EpubInfo.lang = "ja-JP";
EpubInfo.prodcode = "AMAJ";
EpubInfo.videoserver = "http://jpn-video.m1.nintendo.net/epub_contents/";
EpubInfo.imgserver = "http://img.m1.nintendo.net/epub_contents/";

// Wii U 独自オブジェクトなので未定義と判断されれば無視
if (typeof wiiuEpub != "undefined") {
	EpubInfo.platform = wiiuEpub.platform;
	EpubInfo.region = wiiuEpub.region;
	EpubInfo.lang = wiiuEpub.language;

	// プロダクトコードを設定
	switch (EpubInfo.region) {
		case "JPN":
			EpubInfo.prodcode = "AMAJ";
			EpubInfo.videoserver = "http://jpn-video.m1.nintendo.net/epub_contents/";
			EpubInfo.imgserver = "http://img.m1.nintendo.net/epub_contents/";
			break;

		case "EUR":
			EpubInfo.prodcode = "AMAP";
			EpubInfo.videoserver = "http://eur-video.m1.nintendo.net/epub_contents/";
			EpubInfo.imgserver = "http://img.m1.nintendo.net/epub_contents/";
			break;

		case "USA":
			EpubInfo.prodcode = "AMAE";
			EpubInfo.videoserver = "http://usa-video.m1.nintendo.net/epub_contents/";
			EpubInfo.imgserver = "http://img.m1.nintendo.net/epub_contents/";
			break;
	}
}
