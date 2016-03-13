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

			this.clearData();

			vgapMap.prototype.spMenuItem("Hyp Circle", "hypCircle", function() {
				vgap.map.putHypCircle = true;
			});

			vgapMap.prototype.spMenuItem("Warp Circle", "warpCircle",
					function() {
						hypTools.putWarpCircle = true;
					});

			vgapMap.prototype.spMenuItem("3 Turn Warp 9", "warpCircle",
					function() {
						hypTools.putMultiTurnCircle = true;
						hypTools.warp = 81;
					});
			// vgapMap.prototype.spMenuItem("3 Turn Warp 5", "warpCircle",
			// function() {
			// hypTools.putMultiTurnCircle = true;
			// hypTools.warp = 25;
			// });

			vgapMap.prototype.spMenuItem("Clear", "_massClear", function() {
				hypTools.prototype.clearData();
			});
		},

		clearData : function() {
			vgap.map.putHypCircle = false;
			vgap.map.hypcircles = new Array();
			hypTools.putWarpCircle = false;
			hypTools.warpcircles = [];
			hypTools.putMultiTurnCircles = false;
			hypTools.multiturncircles = [];
			hypTools.warp = 81;
		},

		pushWarpCircles : function(a, b) {
			hypTools.warpcircles.push({
				x : a,
				y : b
			});
		},

		pushMultiTurnCircles : function(a, b) {
			hypTools.multiturncircles.push({
				x : a,
				y : b
			});
		},
	};

	var oldRenderMapTools = vgapMap.prototype.renderMapTools;
	vgapMap.prototype.renderMapTools = function(ctx) {

		if (this.showconnections) {
			this.renderConnections(ctx);
		}

		for (var d = 0; d < this.hypcircles.length; d++) {
			var c = this.hypcircles[d];
			var b = 350;
			var e = 20;

			// planetary hypcircle
			for (var i = 0; i < vgap.planets.length; ++i) {
				var planet = vgap.planets[i];
				var dist = Math.dist(c.x, c.y, planet.x, planet.y);

				if (dist >= 340 && dist <= 360) {
					this.drawCircle(ctx, this.screenX(planet.x), this
							.screenY(planet.y), 12 * this.zoom, "cyan", 1);
				} else if (dist >= 338 && dist <= 362) {
					this.drawCircle(ctx, this.screenX(planet.x), this
							.screenY(planet.y), 12 * this.zoom, "yellow", 1);
				}
			}

			// large hypcircle
			this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y),
					340 * this.zoom, "cyan", 1);
			this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y),
					360 * this.zoom, "cyan", 1);
		}

		for (var d = 0; d < hypTools.warpcircles.length; d++) {
			var c = hypTools.warpcircles[d];
			this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y),
					81 * this.zoom, "cyan", 1);
		}

		for (var d = 0; d < hypTools.multiturncircles.length; d++) {
			var c = hypTools.multiturncircles[d];
			this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), 1
					* hypTools.warp * this.zoom, "cyan", 1);
			this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), 2
					* hypTools.warp * this.zoom, "cyan", 1);
			this.drawCircle(ctx, this.screenX(c.x), this.screenY(c.y), 3
					* hypTools.warp * this.zoom, "cyan", 1);
		}

		this.drawMeasure(ctx);

		this.renderResource(ctx);
	};

	var oldClick = vgapMap.prototype.Click;
	vgapMap.prototype.click = function(event) {
		var c = event.shiftKey;

		// snap hypcircle to closese ship or planet
		if (hypTools.putWarpCircle) {
			if (this.over) {
				hypTools.prototype.pushWarpCircles(this.over.x, this.over.y);
			} else {
				hypTools.prototype.pushWarpCircles(this.x, this.y);
			}
			hypTools.putWarpCircle = false;
			$("body").css("cursor", "");
			// return
		}

		if (hypTools.putMultiTurnCircle) {
			if (this.over) {
				hypTools.prototype.pushMultiTurnCircles(this.over.x,
						this.over.y);
			} else {
				hypTools.prototype.pushMultiTurnCircles(this.x, this.y);
			}
			hypTools.putMultiTurnCircle = false;
			$("body").css("cursor", "");
			// return
		}

		if (this.putHypCircle) {
			if (this.over) {
				this.hyperjump(this.over.x, this.over.y);
			} else {
				this.hyperjump(this.x, this.y);
			}
			this.putHypCircle = false;
			$("body").css("cursor", "");
			// return
		}
		if (this.measure) {
			this.markMeasure();
			return

		}
		if (this.over && this.activePlanet) {
			if (this.activePlanet.targetx == this.over.x
					&& this.activePlanet.targety == this.over.y) {
				this.loadOver();
				return

			}
		}
		if (this.over && this.activeShip) {
			if (this.activeShip.readystatus == 0) {
				var a = vgap.getDest(this.activeShip);
				if (a.x == this.over.x && a.y == this.over.y) {
					this.loadOver();
					return

				}
			}
		}
		if (this.activePlanet) {
			this.planetSelectorClick();
			return

		}
		if (this.activeShip) {
			this.shipSelectorClick(c);
			return

		}
		if (this.over) {
			this.loadOver()
		}
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
