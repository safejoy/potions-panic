//=============================================================================
// RPG Maker MZ - Custom Floor Damage
// Joy_CustomFloorDamage.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Let's the developer set the default floor damage.
 * @author Joy Flowers
 *
 * @help Joy_CustomFloorDamage.js
 *
 * @param Damage Amount
 * @desc The floor damage amount to be assessed.
 * @type number
 * @default 1
 * @min 1
 */

// Set up AUT object to hold my code.
var JOY = JOY || {};
JOY.CFD = JOY.CFD || {};
JOY.CFD.pluginName = "Joy_CustomFloorDamage";

// Set up Plugin params
JOY.CFD.floorDamage = Number(
  PluginManager.parameters(JOY.CFD.pluginName)["Damage Amount"]
);

Game_Actor.prototype.basicFloorDamage = function () {
  return JOY.CFD.floorDamage;
};
