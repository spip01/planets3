// ==UserScript==
// @name          hypCircle
// @description   shows a modified hyperjump ring and warp 9 circles
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// @homepage      https://greasyfork.org/en/users/32642-stephen-piper
// ==/UserScript==

function wrapper() {
  function hypTools() {

  }
  hypTools.prototype = {

    loadControls : function() {
      // debugger;
      this.putWarpCircles = false;
      this.warpcircles = [];
      this.putMultiTurnCircles = false;
      this.multiturncircles = [];
      this.warp = 81;
      this.drawLineStart = false;
      this.drawLineEnd = false;
      this.lines = [];
      this.lineStart = null;

      this.clearData();

      if (vgapMap.prototype.spMenuItem != undefined) {
	vgapMap.prototype.spMenuItem("Hyp Circle", "hypCircle", function() {
	  vgap.map.putHypCircle = true;
	});

	vgapMap.prototype.spMenuItem("Warp Circle", "warpCircle", function() {
	  hypTools.putWarpCircle = true;
	});

	vgapMap.prototype.spMenuItem("3 Turn Warp 9", "warpCircle", function() {
	  hypTools.putMultiTurnCircle = true;
	});

	vgapMap.prototype.spMenuItem("Draw Line", "drawLine", function() {
	  if (hypTools.drawLineEnd) {
	    hypTools.startlinept.pop();
	  }
	  hypTools.drawLineStart = true;
	  hypTools.drawLineEnd = false;
	});

	vgapMap.prototype.spMenuItem("Clear", "_massClear", function() {
	  hypTools.prototype.clearData();
	});
      }
    },

    clearData : function() {
      vgap.map.putHypCircle = false;
      vgap.map.hypcircles = new Array();
      hypTools.putWarpCircle = false;
      hypTools.warpcircles = [];
      hypTools.putMultiTurnCircles = false;
      hypTools.multiturncircles = [];
      hypTools.warp = 81;
      hypTools.drawLineStart = false;
      hypTools.drawLineEnd = false;
      hypTools.lines = [];
      hypTools.lineStart = null;
    },

    addWarpCircle : function(a, b) {
      hypTools.warpcircles.push({
	x : a,
	y : b
      });
    },

    addMultiTurn : function(a, b) {
      hypTools.multiturncircles.push({
	x : a,
	y : b
      });
    },

    addLineStart : function(a, b) {
      hypTools.linestart = {
	x : a,
	y : b
      };
    },

    addLineEnd : function(a, b) {
      hypTools.lines.push({
	sx : hypTools.linestart.x,
	sy : hypTools.linestart.y,
	ex : a,
	ey : b
      });
      hypTools.linestart = null;
    },

  };

  var oldRenderMapTools = vgapMap.prototype.renderMapTools;
  vgapMap.prototype.renderMapTools = function(ctx) {

    h = this.hypcircles;
    this.hypcircles = [];
    
    oldRenderMapTools.apply(this, arguments);
    
    this.hypcircles = h;
    
    for (var d = 0; d < this.hypcircles.length; d++) {
      var c = this.hypcircles[d];

      // planetary hypcircle
      for (var i = 0; i < vgap.planets.length; ++i) {
	var planet = vgap.planets[i];
	var dist = Math.dist(c.x, c.y, planet.x, planet.y);

	if (dist >= 340 && dist <= 360) {
	  this.drawCircle(ctx, this.screenX(planet.x), this.screenY(planet.y), 12 * this.zoom, "cyan", 1);
	} else if (dist >= 338 && dist <= 362) {
	  this.drawCircle(ctx, this.screenX(planet.x), this.screenY(planet.y), 12 * this.zoom, "orange", 1);
	}
      }

      // large hypcircle
      this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), 340 * this.zoom, "cyan", 1);
      this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), 360 * this.zoom, "cyan", 1);
    }

    for (var d = 0; d < hypTools.warpcircles.length; d++) {
      var c = hypTools.warpcircles[d];
      this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), hypTools.warp * this.zoom, "cyan", 1);
    }

    for (var d = 0; d < hypTools.multiturncircles.length; d++) {
      var c = hypTools.multiturncircles[d];
      this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), 1 * hypTools.warp * this.zoom, "cyan", 1);
      this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), 2 * hypTools.warp * this.zoom, "cyan", 1);
      this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), 3 * hypTools.warp * this.zoom, "cyan", 1);
    }

    if (hypTools.linestart != null) {
      var l = hypTools.linestart;
      this.drawCircle(ctx, this.screenX(l.x), this.screenY(l.y), 1 * this.zoom, "orange", 2);
    }

    for (var d = 0; d < hypTools.lines.length; ++d) {
      var l = hypTools.lines[d];
      this.drawLine(ctx, this.screenX(l.sx), this.screenY(l.sy), this.screenX(l.ex), this.screenY(l.ey), "orange", 1);
    }
  };

  var oldClick = vgapMap.prototype.click;
  vgapMap.prototype.click = function(event) {

    if (this.over) {
      a = this.over.x;
      b = this.over.y;
    } else {
      a = this.x;
      b = this.y;
    }

    // snap hypcircle to closese ship or planet
    if (hypTools.putWarpCircle) {
      hypTools.prototype.addWarpCircle(a, b);

      hypTools.putWarpCircle = false;
      $("body").css("cursor", "");
      // return
    }

    if (hypTools.drawLineStart) {
      hypTools.prototype.addLineStart(a, b);

      hypTools.drawLineStart = false;
      hypTools.drawLineEnd = true;
      $("body").css("cursor", "");
      // return
    } else if (hypTools.drawLineEnd) {
      hypTools.prototype.addLineEnd(a, b);

      hypTools.drawLineStart = false;
      hypTools.drawLineEnd = false;
      $("body").css("cursor", "");
      // return
    }

    if (hypTools.putMultiTurnCircle) {
      hypTools.prototype.addMultiTurn(a, b);

      hypTools.putMultiTurnCircle = false;
      $("body").css("cursor", "");
      // return
    }

    if (this.putHypCircle) {
      this.hyperjump(a, b);

      this.putHypCircle = false;
      $("body").css("cursor", "");
      // return
    }

    oldClick.apply(this, arguments);
    
    this.draw();
  };

  var oldLoadControls = vgapMap.prototype.loadControls;
  vgapMap.prototype.loadControls = function() {
    oldLoadControls.apply(this, arguments);

    hypTools.prototype.loadControls();
  };
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
