/*:
 * @target MZ
 * @plugindesc Shows a random animated splash text on the Title Screen like Minecraft (v1.1) 🧪✨
 * @author Joy Flowers
 *
 * @param Splash Texts
 * @type string[]
 * @default ["Witches be brewing!", "Certified Potion Maker!", "Now with 99% fewer explosions!", "Double double toil & fun!", "It’s potion time!"]
 * @desc List of splash texts that randomly appear on the title screen.
 *
 * @param X Position
 * @type number
 * @default 300
 * @desc The X coordinate of the splash text.

 * @param Y Position
 * @type number
 * @default 50
 * @desc The Y coordinate of the splash text.
 *
 * @help
 * This plugin displays an animated random splash text (like Minecraft)
 * on the Title Screen each time the game is launched.
 *
 * Customize the messages and position via plugin parameters.
 */

(() => {
  const pluginName = "SplashText";
  const params = PluginManager.parameters(pluginName);

  const splashTexts = JSON.parse(params["Splash Texts"] || "[]").map(t => t.replace(/^"(.*)"$/, "$1"));
  const splashX = Number(params["X Position"] || 300);
  const splashY = Number(params["Y Position"] || 50);

  let _Scene_Title_create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function () {
    _Scene_Title_create.call(this);
    this.createSplashText();
  };

  Scene_Title.prototype.createSplashText = function () {
    if (splashTexts.length === 0) return;

    const randomIndex = Math.floor(Math.random() * splashTexts.length);
    const splash = splashTexts[randomIndex];

    const splashBitmap = new Bitmap(Graphics.width, Graphics.height);
    splashBitmap.fontSize = 24;
    splashBitmap.outlineColor = "#000000";
    splashBitmap.outlineWidth = 4;
    splashBitmap.textColor = "#ffff00";
    splashBitmap.drawText(splash, 0, 0, Graphics.width, 40, "center");

    const splashSprite = new Sprite(splashBitmap);
    splashSprite.x = splashX;
    splashSprite.y = splashY;
    splashSprite.anchor.set(0.5, 0.5); // Center anchor for smooth rotation/scale
    splashSprite.x += splashBitmap.width / 2;
    splashSprite.y += splashBitmap.height / 4;

    this._splashSprite = splashSprite;
    this.addChild(splashSprite);
  };

  let _Scene_Title_update = Scene_Title.prototype.update;
  Scene_Title.prototype.update = function () {
    _Scene_Title_update.call(this);
    this.animateSplashText();
  };

  Scene_Title.prototype.animateSplashText = function () {
    if (this._splashSprite) {
      const time = performance.now() / 1000;
      this._splashSprite.rotation = Math.sin(time * 0.5) * 0.05; // subtle wiggle
      const scale = 1 + Math.sin(time * 3) * 0.03; // slight pulsing
      this._splashSprite.scale.set(scale, scale);
    }
  };
})();
