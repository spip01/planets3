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
  var showBldg = false;
  var showChunnel = false;
  var showHull = null;
  var showShips = false;
  
  function checkReady() {
  }
  checkReady.prototype = {

    loadControls : function() {

      this.clearData();

      if (vgapMap.prototype.spMenuItem != undefined) {
	vgapMap.prototype.spMenuItem("Check Ready", "checkReady", function() {
	  showReady = !showReady;
	  vgap.map.draw();
	});

	vgapMap.prototype.spMenuItem("Show Buildings", "checkReady", function() {
	  showBldg = !showBldg;
	  vgap.map.draw();
	});

	vgapMap.prototype.spMenuItem("Show Falcons", "checkReady", function() {
	  showHull = showHull != 87 ? 87 : null;
	  vgap.map.draw();
	});

	vgapMap.prototype.spMenuItem("Show Rush", "checkReady", function() {
	  showHull = showHull != 94 ? 94 : null;
	  vgap.map.draw();
	});

	vgapMap.prototype.spMenuItem("Show Ships", "checkReady", function() {
	  showShips = !showShips;
	  vgap.map.draw();
	});

	vgapMap.prototype.spMenuItem("Show Chunnel", "checkReady", function() {
	  showChunnel = !showChunnel;
	  vgap.map.draw();
	});

	vgapMap.prototype.spMenuItem("Clear", "_massClear", function() {
	  checkReady.prototype.clearData();
	});
      }
    },

    clearData : function() {
      showReady = false;
      showBldg = false;
      showHull = null;
      showChunnel = false;
      showShips = false;
    },

    // 1054 B41b Explorer - chunnel target
    // 1055 B222b Destroyer - chunnel to B200 or other target
    // 56   Firecloud - chunnel between 2 Fireclouds
    // 51   B200 Probe
    isChunnelling: function(a) {
      if ( a.ownerid == vgap.player.id && vgap.canInitiateChunnel(a)) {
	var b = vgap.getChunnelTarget(a);
	if (b != null  && vgap.isValidChunnelTarget(a, b)) {
	  return b
	}
      }
      return null;
    },
 };
  


  var oldDraw = vgapMap.prototype.draw;
  vgapMap.prototype.draw = function(fast, ctx, skipUserContent, secondCanvas) {
    oldDraw.apply(this, arguments);

    if (!ctx)
      ctx = this.ctx;

    // have to redraw ships because normal draw
    // copies the planets over the ships
    // draw ships not ready
    for (var n = 0; n < vgap.myships.length; n++) {
      var E = vgap.myships[n];
      this.drawShip(E, ctx)
    }

  };

  var oldDrawPlanet = vgapMap.prototype.drawPlanet;
  vgapMap.prototype.drawPlanet = function(planet, ctx, fullrender) {
    oldDrawPlanet.apply(this, arguments);

    var x = this.screenX(planet.x);
    var y = this.screenY(planet.y);

    // draw planets not ready
    if (planet.infoturn > 0 && vgap.player.id == planet.ownerid) {
      if (showBldg) {
	ctx.fillStyle = "orange";
	x2 = this.screenX(planet.x + 7.5 * 1.5);
	y2 = this.screenY(planet.y);
	    
	ctx.fillText("m:"+planet.mines + " f:"+ planet.factories + " d:"+ planet.defense, x2, y2);
      }
      else if (showReady) {
	if (planet.readystatus == 0) {
	  this.drawCircle(ctx, x, y, 13 * this.zoom, "orange", 2);
	}
	if (planet.isbase) {
	  for (var i = 0; i < vgap.mystarbases.length; ++i) {
	    if (vgap.mystarbases[i].planetid == planet.id && vgap.mystarbases[i].readystatus == 0) {
	      this.drawCircle(ctx, x, y, 11 * this.zoom, "red", 2);
	      break;
	    }
	  }
	}
      }
    }
    
    if (showShips) {
      line = 0;
      for (var k = 0; k < vgap.ships.length; ++k) {
	var ship = vgap.ships[k];
	t = Math.dist(ship.x, ship.y, planet.x, planet.y);
	
	if (t <= 3) {
	  if (vgap.player.id == ship.ownerid) 
	    ctx.fillStyle = "yellow";
	  else
	    ctx.fillStyle = "red";
	  ++line;
	  x2 = this.screenX(planet.x + 8 * 1.5);
	  y2 = this.screenY(planet.y - (line - 2) * 6 * 1.5);
	  ctx.fillText(ship.id+":"+vgap.getHull(ship.hullid).name, x2, y2);
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
      this.drawCircle(ctx, this.screenX(ship.x), this.screenY(ship.y), 16 * this.zoom, "yellow", 2);
    }
    
    if (showHull != null && showHull == ship.hullid) 
      this.drawCircle(ctx, this.screenX(ship.x), this.screenY(ship.y), 13 * this.zoom, "lightgreen", 2);
    
    if (showChunnel) {
      if ((d = checkReady.prototype.isChunnelling(ship)) != null) {
      	ctx.strokeStyle="cyan";
	ctx.beginPath(this.screenX(ship.x), this.screenY(ship.y));
	ctx.lineto(this.screenX(d.x), this.screenY(d.y));
	ctx.stroke();
      }
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
