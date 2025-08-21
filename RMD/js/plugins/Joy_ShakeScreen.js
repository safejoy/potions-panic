/*:
 * @target MZ
 * @plugindesc [v1.0] Shake the Game Window with Mouse to Trigger Custom Puzzle Events (Spank the Monkey Style)
 * @author Joy
 *
 * @command StartShakeTrigger
 * @text Start Shake Event
 * @desc Begins a window shaking interaction the player must complete.
 *
 * @arg shakeAmount
 * @type number
 * @default 300
 * @desc Total shake distance (in pixels) needed to trigger the event.
 *
 * @arg triggerType
 * @type select
 * @option Self Switch
 * @option Switch
 * @option Common Event
 * @default Self Switch
 * @desc What to trigger when shaking is successful.
 *
 * @arg switchId
 * @type switch
 * @desc If using Switch, which switch ID to turn ON.

 * @arg selfSwitch
 * @type combo
 * @option A
 * @option B
 * @option C
 * @option D
 * @desc If using Self Switch, which one to activate (A/B/C/D).

 * @arg commonEventId
 * @type common_event
 * @desc If using Common Event, which one to run.
 *
 * @help
 * 🔸 This plugin allows you to create shake-based puzzles or interactions.
 * 🔸 The player must shake the game window rapidly with the mouse.
 * 🔸 Once enough movement is detected, the action is triggered.
 *
 * 🔹 Use the Plugin Command "StartShakeTrigger" to begin a shake puzzle.
 * 🔹 You can select what happens when the shake is completed (common event, switch, self switch).
 *
 * Notes:
 * - This only works on **desktop** builds (due to NW.js usage).
 * - Shake is measured by tracking mouse drag motion on the screen.
 */

(() => {
  let activeShake = false;
  let requiredShake = 300;
  let shakeTotal = 0;
  let lastX = 0;
  let triggerSettings = null;
  let currentEventId = 0;

  PluginManager.registerCommand("ShakeToTrigger", "StartShakeTrigger", args => {
    requiredShake = Number(args.shakeAmount || 300);
    shakeTotal = 0;
    activeShake = true;
    triggerSettings = {
      type: args.triggerType,
      switchId: Number(args.switchId),
      selfSwitch: args.selfSwitch,
      commonEventId: Number(args.commonEventId)
    };
    const scene = SceneManager._scene;
    if (scene && scene._interpreter) {
      currentEventId = scene._interpreter._eventId;
    }
  });

  document.addEventListener("mousedown", e => {
    if (!activeShake) return;
    lastX = e.screenX;
  });

  document.addEventListener("mousemove", e => {
    if (!activeShake) return;
    const dx = Math.abs(e.screenX - lastX);
    shakeTotal += dx;
    lastX = e.screenX;
    if (shakeTotal >= requiredShake) {
      performTrigger();
      activeShake = false;
    }
  });

  function performTrigger() {
    const { type, switchId, selfSwitch, commonEventId } = triggerSettings;

    switch (type) {
      case "Switch":
        if ($gameSwitches) {
          $gameSwitches.setValue(switchId, true);
        }
        break;
      case "Self Switch":
        if (currentEventId > 0 && selfSwitch) {
          const key = [$gameMap.mapId(), currentEventId, selfSwitch];
          $gameSelfSwitches.setValue(key, true);
        }
        break;
      case "Common Event":
        if ($gameTemp) {
          $gameTemp.reserveCommonEvent(commonEventId);
        }
        break;
    }
    triggerSettings = null;
    shakeTotal = 0;
  }
})();
