// ==UserScript==
// @name          checkReady
// @description   draw a ring around planets and ships that are not marked ready 
// 				  can't move ships marked ready
//
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// @homepage      https://greasyfork.org/en/users/32642-stephen-piper
// ==/UserScript==

function wrapper() {
  var showReady = false;

  function checkReady() {
  }
  checkReady.prototype = {

    loadControls : function() {

      this.clearData();

      vgapMap.prototype.spMenuItem("Check Ready", "checkReady", function() {
	showReady = !showReady;
      });

      vgapMap.prototype.spMenuItem("Clear", "_massClear", function() {
	checkReady.prototype.clearData();
      });
    },

    clearData : function() {
      showReady = false;
    },

  };

  var oldDraw = vgapMap.prototype.draw;
  vgapMap.prototype.draw = function(fast, ctx, skipUserContent, secondCanvas) {
    oldDraw.apply(this, arguments);

    if (!ctx)
      ctx = this.ctx;

    // have to redraw ships because normal draw
    // copies the planes over the ships
    // draw ships not ready
    for (var n = 0; n < vgap.ships.length; n++) {
      var E = vgap.ships[n];
      this.drawShip(E, ctx)
    }

  };

  var oldDrawPlanet = vgapMap.prototype.drawPlanet;
  vgapMap.prototype.drawPlanet = function(planet, ctx, fullrender) {
    oldDrawPlanet.apply(this, arguments);

    var x = this.screenX(planet.x);
    var y = this.screenY(planet.y);

    // draw planets not ready
    if (planet.infoturn > 0) {
      if (showReady) {
	if (planet.readystatus == 0 && vgap.player.id == planet.ownerid) {
	  this.drawCircle(ctx, x, y, 11 * this.zoom, "yellow", 2);
	}
      }
    }
  };

  var oldDrawShip = vgapMap.prototype.drawShip;
  vgapMap.prototype.drawShip = function(ship, ctx) {
    oldDrawShip.apply(this, arguments);

    // draw ships not ready had to redraw in draw()
    // because drawplanet() wrote over them
    if (showReady && ship.readystatus == 0 && vgap.player.id == ship.ownerid) {
      this.drawCircle(ctx, this.screenX(ship.x), this.screenY(ship.y), 14 * this.zoom, "orange", 2);
    }
    // if (warnings && ship.ownerid) {
    // if (ship.dist > Math.pow(ship.warp, 2)) {
    // this.drawCircle(ctx, this.screenX(ship.x), this.screenY(ship.y), 14 *
    // this.zoom, "red", 2);
    // }
    // // < required neutronium
    // }
  };

  var oldShipSelectorClick = vgapMap.prototype.shipSelectorClick;
  vgapMap.prototype.shipSelectorClick = function(event) {

    var e = this.activeShip;
    if (e.readystatus > 0) // can't move ships marked ready
      return;

    oldShipSelectorClick.apply(this, arguments);
  };

  var oldLoadControls = vgapMap.prototype.loadControls;
  vgapMap.prototype.loadControls = function() {
    oldLoadControls.apply(this, arguments);

    checkReady.prototype.loadControls();
  };
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
