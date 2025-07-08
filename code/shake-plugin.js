/*:
 * @plugindesc Custom Battle System - Shake Window to Attack (like Spank the Monkey) - v1.0
 * @author Joy
 *
 * @help
 * During battle, player shakes the window (click and drag quickly) to charge an attack.
 * Once released, it hits the enemy. This replaces standard attack.
 */

(function() {
  let shaking = false;
  let lastX = 0;
  let totalShake = 0;
  let startTime = 0;
  let attackTriggered = false;

  // Override Scene_Battle to hook into update loop
  const _Scene_Battle_update = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function() {
    _Scene_Battle_update.call(this);
    if (this._shakeMode) updateShakeBattle();
  };

  // Start shake mode when player's turn
  const _Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
  Scene_Battle.prototype.startActorCommandSelection = function() {
    _Scene_Battle_startActorCommandSelection.call(this);
    this._shakeMode = true;
    totalShake = 0;
    startTime = Date.now();
    attackTriggered = false;
  };

  // End shake mode after action
  const _Scene_Battle_endCommandSelection = Scene_Battle.prototype.endCommandSelection;
  Scene_Battle.prototype.endCommandSelection = function() {
    _Scene_Battle_endCommandSelection.call(this);
    this._shakeMode = false;
  };

  function updateShakeBattle() {
    if (!require('nw.gui')) return;
    const gui = require('nw.gui');
    const win = gui.Window.get();
    const now = Date.now();

    // On mouse drag events
    window.onmousemove = function(e) {
      if (!shaking) return;
      const deltaX = Math.abs(e.screenX - lastX);
      totalShake += deltaX;
      lastX = e.screenX;
    };

    window.onmousedown = function(e) {
      shaking = true;
      lastX = e.screenX;
    };

    window.onmouseup = function(e) {
      shaking = false;

      if (!attackTriggered) {
        let power = Math.min(999, Math.floor(totalShake));
        if (power < 50) power = 0;

        if (power > 0) {
          SceneManager._scene._shakeMode = false;
          triggerShakeAttack(power);
        }
        attackTriggered = true;
      }
    };
  }

  function triggerShakeAttack(power) {
    const actor = BattleManager.actor();
    const action = new Game_Action(actor);
    action.setAttack();
    action.setDamage(Math.floor(power)); // Replace damage with shake power
    actor.clearActions();
    actor.setAction(0, action);
    BattleManager.inputtingAction = null;
    BattleManager.actor().setLastBattleSkill(action);
    BattleManager.selectNextCommand(); // End input phase
    BattleManager.startActorInput();   // Force the action to execute
  }

})();
