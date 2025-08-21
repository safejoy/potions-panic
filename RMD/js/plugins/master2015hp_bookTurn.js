//===============================================================================
// master2015hp_bookTurn.js
// by master2015hp
// 2020.05.28
//===============================================================================
/*:
 * @plugindesc (v1.1) add a reading book scene
 * @author master2015hp
 *
 * @param turn time
 * @desc time length of turning page effect
 * @type number
 * @default 15
 * @min 1
 *
 * @param show page number
 * @desc to generate page number or not
 * @type select
 * @default true
 * @option show
 * @value true
 * @option hide
 * @value false
 *
 * @param page number size
 * @desc text size of page number
 * @type number
 * @default 18
 * @min 1
 *
 * @param page number offsetX
 * @desc offsetX for that 'page1/..' text
 * @type string
 *
 * @param page number offsetY
 * @desc offsetY for that 'page1/..' text
 * @type string
 *
 * @help
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░▒░░▒▒▒░░░▒▒░░░░▒▒▒▒░░▒▒▒░░▒░░░░░▒▒░░░░
░▒░▒▒░░░░░▒░▒░░░▒░░▒▒░░░▒▒░▒░░░░░▒░▒░░░
░▒░▒░░░░░▒▒░▒░░░▒░░░▒░░░░▒░▒░░░░▒▒░▒░░░
░▒░▒▒░░░░▒░░░▒░░▒░░▒▒░░░░▒░▒░░░░▒░░░▒░░
░▒░░▒▒░░░▒▒▒▒▒░░▒▒▒▒░░▒▒▒▒░▒░░░░▒▒▒▒▒░░
░▒░░░░▒░▒▒░░░▒░░▒░░▒▒░░░░▒░▒░░░▒▒░░░▒░░
░▒░░░░▒░▒░░░░▒▒░▒░░▒▒░░░░▒░▒░░░▒░░░░▒▒░
░▒░▒▒▒░░▒░░░░░▒░▒▒▒▒░░▒▒▒░░▒▒▒░▒░░░░░▒░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

 * -------------------------------------------------------------------------------
 * REQUIRE
 * ===============================================================================
 * - cover.png and paper.png images in /img/pictures/ folder
 * Those images will be used as cover/ paper background.
 *
 * -------------------------------------------------------------------------------
 * INSTRUCTION
 * ===============================================================================
 * - to open reading book scene, run this script:
 * $gameScreen.bookPrepare(pages, file name, offsetX, offsetY, coverName, paperName);
 * - pages: total number of pages of this book
 * - file name: file name of the image(s) will be used for book's contents.
 *   Assume you want to show book A, and the book has 4 pages, you will need to
 *   have 4 images which named like this in your pictures folder:
 *   bookA1, bookA2, bookA3, bookA4
 * - offsetX: offsetX of the book's contents
 * - coverName: if you want to use another image for book cover, input its name
 * - paperName: ...
 *
 * Example of script usage:
 *  $gameScreen.bookPrepare(6, 'sample1', 100, -50)
 *  $gameScreen.bookPrepare(4, 'sample2')
 *
 * NOTE:
 * - Open reading book scene will automatically ERASE on screen pictures 1-6
 * - Cover & Paper image must have a same size, see cover & paper sample files.
 * - Book contents will be set center as default, to have its position exactly
 *   as you want, it's recommened to edit the content images that its size is
 *   equally to cover size and its position lie within paper's frame.
 *   See sample2 files.
 * -------------------------------------------------------------------------------
 * TERMS OF USE
 * ===============================================================================
 * - You must buy a license before using this plugin for any commercial purposes
 * - License must be obtained BEFORE you start selling your game.
 * - NOTE: Games with micro-transactions and/or advertising incomes are considred
 *   commercial use of this plugin!
 * - Edits are allowed as long as "Terms of Use" is not changed in any way.
 *
 * DO NOT COPY, RESELL, REDISTRIBUTE, REPUBLISH OR CLAIM ANY PIECE OF
 * THIS SOFTWARE AS YOUR OWN!
 * Copyright (c) 2020 Isabella Ava
 * Contact me at gmail: master2015hp
 *
 * -------------------------------------------------------------------------------
 * Version History
 * ===============================================================================
 * 2020/05/30 v1.1.0 - Major modification
 * 2020/05/28 v1.0.0 - Initial release
 *
 */
var master2015hp = master2015hp || {};
master2015hp.bkTurn = master2015hp.bkTurn || {};
master2015hp.bkTurn.parameters = PluginManager.parameters('master2015hp_bookTurn');

master2015hp.bkTurn.turnTime = Number(master2015hp.bkTurn.parameters['turn time']) || 15;
master2015hp.bkTurn.pNSize = Number(master2015hp.bkTurn.parameters['page number size']) || 18;
master2015hp.bkTurn.showPN = JSON.parse(master2015hp.bkTurn.parameters['show page number']) || true;
master2015hp.bkTurn.poX = Number(master2015hp.bkTurn.parameters['page number offsetX']) || 0;
master2015hp.bkTurn.poY = Number(master2015hp.bkTurn.parameters['page number offsetY']) || 0;
 
Sprite_Picture.prototype.updateOrigin = function() {
    var picture = this.picture();
	var origin = picture.origin();
	if (origin instanceof Array) {
		this.anchor.x = origin[0] || 0;
        this.anchor.y = origin[1] || 0;
	} else if (origin === 0) {
        this.anchor.x = 0;
        this.anchor.y = 0;
    } else {
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    }
};

var ms2015_bkTurn_gmscr_update = Game_Screen.prototype.update;
Game_Screen.prototype.update = function() {
	ms2015_bkTurn_gmscr_update.call(this);
	if (this._bookMaxPages) this.updateBookTurn();
};

Game_Screen.prototype.updateBookTurn = function() {
	if (this._bookPhase == 'cleaning') {
		this._bookCount++;
		if (this._bookCount >= 5) {
			this._bookMaxPages = null;
			this._bookPhase = null;
		}
		return;
	}
	if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
		//escape book scene
		for (var i = 1; i <= 6; i++) {
			$gameScreen.erasePicture(i);
		}
		SceneManager._scene.removeChild(this._bookPageWindow);
		this._bookPhase = 'cleaning';
		this._bookCount = 0;
		this._bookTurningPageId = -1;
		return;
	}
	if (this._bookMaxPages <= 2) return;
	if (!this._bookPhase && Input.isTriggered('left') && this._bookCurrentPage > 1) {
		this._bookPhase = 'turning';
		this._bookTurningPageId = 3;
		this._bookCurrentPage -= 2;
		this.redrawPages();
		this.movePicture(3, [1, 0.5], Graphics.width/2, Graphics.height/2, -100, 100, 255, 0, master2015hp.bkTurn.turnTime);
	} else if (!this._bookPhase && (Input.isTriggered('right') || Input.isTriggered('ok')) && (this._bookCurrentPage < (this._bookMaxPages - 1))) {
		this._bookPhase = 'turning';
		this._bookTurningPageId = 4;
		this._bookCurrentPage += 2;
		this.redrawPages();
		this.movePicture(4, [1, 0.5], Graphics.width/2, Graphics.height/2, 100, 100, 255, 0, master2015hp.bkTurn.turnTime);
	}
	if (!this._bookPhase) return;
	this._bookCount++;
	if (this._bookCount > master2015hp.bkTurn.turnTime && this._bookPhase == 'turning') {
		this._bookPhase = 'returning';
		if (this._bookTurningPageId == 3) this.movePicture(3, [1, 0.5], Graphics.width/2, Graphics.height/2, -100, 100, 0, 0, 1);
		else this.movePicture(4, [1, 0.5], Graphics.width/2, Graphics.height/2, 100, 100, 0, 0, 1);
	}
	if (this._bookCount > master2015hp.bkTurn.turnTime + 3) {
		if (this._bookTurningPageId == 3) this.movePicture(3, [1, 0.5], Graphics.width/2, Graphics.height/2, 100, 100, 0, 0, 1);
		else this.movePicture(4, [1, 0.5], Graphics.width/2, Graphics.height/2, -100, 100, 0, 0, 1);
		this.showPicture(5, this._bookPageName + String(this._bookCurrentPage), [1, 0.5], Graphics.width/2 - this._offsetX, Graphics.height/2 + this._offsetY, 100, 100, 0, 0);
		if (this._bookCurrentPage + 1 <= this._bookMaxPages) {
			this.showPicture(6, this._bookPageName + String(this._bookCurrentPage + 1), [0, 0.5], Graphics.width/2 + this._offsetX, Graphics.height/2 + this._offsetY, 100, 100, 0, 0);
		} else {
			this.erasePicture(6);
		}
		this.movePicture(5, [1, 0.5], Graphics.width/2 - this._offsetX, Graphics.height/2 + this._offsetY, 100, 100, 255, 0, Math.floor(master2015hp.bkTurn.turnTime/4));
		this.movePicture(6, [0, 0.5], Graphics.width/2 + this._offsetX, Graphics.height/2 + this._offsetY, 100, 100, 255, 0, Math.floor(master2015hp.bkTurn.turnTime/4));
	}
	if (this._bookCount > master2015hp.bkTurn.turnTime + 5) {
		if (this._bookTurningPageId == 3) {
			this.movePicture(3, [1, 0.5], Graphics.width/2, Graphics.height/2, 100, 100, 255, 0, 1);
		} else {
			this.movePicture(4, [1, 0.5], Graphics.width/2, Graphics.height/2, -100, 100, 255, 0, 1);
		}
		this._bookPhase = null;
		this._bookCount = 0;
		this._bookTurningPageId = -1;
	}
};

Game_Screen.prototype.redrawPages = function() {
	if (!this._bookPageWindow) return;
	this._bookPageWindow.contents.clear();
	this.movePicture(5, [1, 0.5], Graphics.width/2, Graphics.height/2, 100, 100, 0, 0, Math.floor(master2015hp.bkTurn.turnTime/3));
	this.movePicture(6, [0, 0.5], Graphics.width/2, Graphics.height/2, 100, 100, 0, 0, Math.floor(master2015hp.bkTurn.turnTime/3));
	
	AudioManager.playSe({name: 'Book1', volume: 80, pitch: 120, pan: 100});
	//currentPageUp
	SceneManager._scene._spriteset._pictureContainer.children.sort(function(a,b) {
		if (a._pictureId >= 5) return 1;
		if (b._pictureId >= 5) return -1;
		if (a._pictureId == this._bookTurningPageId) return 1;
		if (b._pictureId == this._bookTurningPageId) return -1;
		return 0;
	}.bind(this));
	//pageNumber
	if (!master2015hp.bkTurn.showPN) return;
	this._bookPageWindow.contents.fontSize = master2015hp.bkTurn.pNSize;
	var txt1 = 'page' + String(this._bookCurrentPage) + '/' + String(this._bookMaxPages);
	var txt2 = 'page' + String(this._bookCurrentPage + 1) + '/' + String(this._bookMaxPages);
	var rect = {
		width: this._bookPageWindow.contentsWidth(),
		height: this._bookPageWindow.contentsHeight(),
		pad: this._bookPageWindow.standardPadding()
	}
	this._bookPageWindow.drawText(txt1, rect.pad + master2015hp.bkTurn.poX, rect.height/2 + master2015hp.bkTurn.poY, rect.width/2 - master2015hp.bkTurn.poX, 'center');
	if (this._bookCurrentPage == this._bookMaxPages) {
		if (this._bookMaxPages % 2 == 0) {
			this._bookPageWindow.drawText(txt2, rect.width/2, rect.height/2 + master2015hp.bkTurn.poY, rect.width/2 - master2015hp.bkTurn.poX, 'center');
		}
	} else {
		this._bookPageWindow.drawText(txt2, rect.width/2, rect.height/2 + master2015hp.bkTurn.poY, rect.width/2 - master2015hp.bkTurn.poX, 'center');
	}
	this._bookPageWindow.resetFontSettings();
};

Game_Screen.prototype.bookPrepare = function(num, pageName, oX, oY, coverName, paperName) {
	if (!(SceneManager._scene instanceof Scene_Map)) return;
	if (!pageName) alert('invalid picture');
	if (!num) return;
	this._offsetX = oX || 0;
	this._offsetY = oY || 0;
	this._bookPhase = null;
	this._bookCount = 0;
	this._bookCurrentPage = 1;
	this._bookMaxPages = num;
	this._bookTurningPageId = -1;
	this._bookPageName = pageName;
	var p1 = coverName || 'cover';
	var p2 = paperName || 'paper';
	this._bookPageWindow = new Window_Base(0, Graphics.height/2, Graphics.width, Graphics.height/2);
	SceneManager._scene.addChild(this._bookPageWindow);
	this._bookPageWindow.opacity = 0;
	this.redrawPages();
	this.showPicture(1, p1, [1, 0.5], Graphics.width/2, Graphics.height/2, 100, 100, 255, 0);
	this.showPicture(2, p1, [1, 0.5], Graphics.width/2, Graphics.height/2, -100, 100, 255, 0);
	this.showPicture(3, p2, [1, 0.5], Graphics.width/2, Graphics.height/2, 100, 100, 255, 0);
	this.showPicture(4, p2, [1, 0.5], Graphics.width/2, Graphics.height/2, -100, 100, 255, 0);
	
	this.showPicture(5, this._bookPageName + String(1), [1, 0.5], Graphics.width/2 - this._offsetX, Graphics.height/2 + this._offsetY, 100, 100, 255, 0);
	if (this._bookMaxPages > 1) {
		this.showPicture(6, this._bookPageName + String(2), [0, 0.5], Graphics.width/2 + this._offsetX, Graphics.height/2 + this._offsetY, 100, 100, 255, 0);
	}

};

var ms2015_bkTurn_gmmap_isEventRunning = Game_Map.prototype.isEventRunning;
Game_Map.prototype.isEventRunning = function() {
    return $gameScreen._bookMaxPages || ms2015_bkTurn_gmmap_isEventRunning.call(this);
};