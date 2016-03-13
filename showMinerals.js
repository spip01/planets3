// ==UserScript==
// @name          showMinerals
// @description   shows minerals at planets and ships in several formats.
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// ==/UserScript==

function wrapper() {
	var resources = [ {
		name : "Neutronium",
		showRes : false,
		color : "red",
		surface : 0,
		ground : 0
	}, {
		name : "Duranium",
		showRes : false,
		color : "cyan",
		surface : 0,
		ground : 0
	}, {
		name : "Tritanium",
		showRes : false,
		color : "orange",
		surface : 0,
		ground : 0
	}, {
		name : "Molybdenum",
		showRes : false,
		color : "violet",
		surface : 0,
		ground : 0
	}, {
		name : "Megacredits",
		showRes : false,
		color : "lightgreen",
		surface : 0,
		ground : 0
	} ];
	var showBars = false;
	var showText = false;
	var buildStarbase = false;

	function mineralTools() {
	}
	mineralTools.prototype = {

		loadControls : function() {
			// debugger;

			this.clearData();

			for (var i = 0; i < resources.length; ++i) {
				// weird declaration fits the color into the existing class
				vgapMap.prototype.spMenuItem(resources[i].name,
						"showMinerals\' style=\'color:" + resources[i].color,
						function() {

							mineralTools.prototype
									.toggleRes(event.target.innerHTML);
						});
			}

			vgapMap.prototype.spMenuItem("Bar Graph", "showBarGraph",
					function() {
						showBars = !showBars;
						if (showBars) {
							showText = false;
							buildStarbase = false;
						}
					});

			vgapMap.prototype.spMenuItem("Text", "showText", function() {
				showText = !showText;
				if (showText) {
					showBars = false;
					buildStarbase = false;
				}
			});

			vgapMap.prototype.spMenuItem("Build Starbase", "buildStarbase",
					function() {
						buildStarbase = !buildStarbase;
						if (buildStarbase) {
							showBars = false;
							showText = false;
						}
					});

			vgapMap.prototype.spMenuItem("Clear", "_massClear", function() {
				mineralTools.prototype.clearData();
			});
		},

		// display minerals
		toggleRes : function(name) {
			vgap.map.showresources = name;
			for (var i = 0; i < resources.length; ++i) {
				if (resources[i].name == name) {
					var v = !resources[i].showRes;
					resources[i].showRes = v;
				}
			}
		},

		clearData : function() {
			vgap.map.showresources = false;
			showBars = false;
			showText = false;
			buildStarbase = false;
			for (var i = 0; i < resources.length; ++i) {
				resources[i].showRes = false;
				resources[i].surface = 0;
				resources[i].ground = 0;
			}
		},

	};

	var oldRenderResource = vgapMap.prototype.renderResource;
	vgapMap.prototype.renderResource = function(ctx) {

		for (var d = 0; d < vgap.planets.length; d++) {
			var planet = vgap.planets[d];

			for (var i = 0; i < resources.length; ++i) {
				resources[i].surface = 0;
				resources[i].ground = 0;
			}

			if (planet.groundneutronium > 0) {
				for (var i = 0; i < resources.length; ++i) {
					r = resources[i];
					if (r.name == "Molybdenum") {
						r.surface += planet.molybdenum;
						r.ground += planet.groundmolybdenum;
						// console.log(planet.id+"p "+r.surface);
					}
					if (r.name == "Neutronium") {
						r.surface += planet.neutronium;
						r.ground += planet.groundneutronium;
					}
					if (r.name == "Duranium") {
						r.surface += planet.duranium;
						r.ground += planet.groundduranium;
					}
					if (r.name == "Tritanium") {
						r.surface += planet.tritanium;
						r.ground += planet.groundtritanium;
					}
					if (r.name == "Megacredits") {
						r.surface += planet.megacredits + planet.supplies;
					}
				}

				for (var k = 0; k < vgap.ships.length; ++k) {
					var ship = vgap.ships[k];
					if (ship.x == planet.x && ship.y == planet.y) {
						for (var i = 0; i < resources.length; ++i) {
							r = resources[i];
							if (r.name == "Molybdenum")
								r.surface += ship.molybdenum;
							if (r.name == "Neutronium")
								r.surface += ship.neutronium;
							if (r.name == "Duranium")
								r.surface += ship.duranium;
							if (r.name == "Tritanium")
								r.surface += ship.tritanium;
							if (r.name == "Megacredits")
								r.surface += ship.megacredits + ship.supplies;
						}

					}
				}

				var x1 = this.screenX(planet.x);
				var y1 = this.screenY(planet.y);

				if (buildStarbase) {
					for (var j = 0; j < resources.length; ++j) {
						r = resources[j];
						if (r.name == "Molybdenum")
							mol = r.surface;
						if (r.name == "Duranium")
							dur = r.surface;
						if (r.name == "Tritanium")
							tri = r.surface;
						if (r.name == "Megacredits")
							mc = r.surface;
					}

					if (!vgap.getStarbase(planet.id)) {
						if (dur >= 120 && tri >= 302 && mol >= 430 && mc >= 900) {
							radius = Math.sqrt(81) * this.zoom;
							this.drawCircle(ctx, x1, y1, radius, "red", 4);
						}
					} else if (dur >= 398 && tri >= 194 && mol >= 357
							&& mc >= 2837) {
						radius = Math.sqrt(81) * this.zoom;
						this.drawCircle(ctx, x1, y1, radius, "orange", 4);
					}

				} else {

					for (var i = 0; i < resources.length; ++i) {
						if (resources[i].showRes == true) {
							var color = resources[i].color;

							if (showBars) {
								x1 = this.screenX(planet.x + (4 + i * 4)
										* this.zoom);
								y1 = this.screenY(planet.y);
								// var x2 = this.screenX(planet.x + (6 + i) *
								// this.zoom);
								var y2 = this.screenY(planet.y
										+ Math.sqrt(resources[i].surface)
										* this.zoom);

								this.drawLine(ctx, x1, y1, x1, y2, color, 4);
								this.drawCircle(ctx, x1, y1, 0, color, 1); // why
							} else if (showText) {
								var radius;
								if (resources[i].surface > 0) {
									f = resources[i].surface;
									ctx.fillStyle = color;
									x2 = this.screenX(planet.x + 6 * this.zoom);
									y2 = this.screenY(planet.y - (i - 2) * 5
											* this.zoom);
									ctx.fillText(f, x2, y2)
								}
							} else {
								if (resources[i].ground > 0) {
									radius = Math.sqrt(resources[i].ground)
											* this.zoom;
									this.drawCircle(ctx, x1, y1, radius, color,
											1);
								}
								if (resources[i].surface > 0) {
									radius = Math.sqrt(resources[i].surface)
											* this.zoom;
									this.drawCircle(ctx, x1, y1, radius, color,
											2);
								}
							}
						}
					}
				}
			}
		}
	};

	var oldLoadControls = vgapMap.prototype.loadControls;
	vgapMap.prototype.loadControls = function() {
		oldLoadControls.apply(this, arguments);

		mineralTools.prototype.loadControls();
	};
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
