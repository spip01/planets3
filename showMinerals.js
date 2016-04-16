// ==UserScript==
// @name          showMinerals
// @description   shows minerals at planets and ships in several formats.
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// @homepage      https://greasyfork.org/en/users/32642-stephen-piper
// ==/UserScript==

function wrapper() {
  var resources = [ {
    name : "Neutronium",
    color : "red"
  }, {
    name : "Duranium",
    color : "cyan"
  }, {
    name : "Tritanium",
    color : "orange"
  }, {
    name : "Molybdenum",
    color : "violet"
  }, {
    name : "Megacredits",
    color : "lightgreen"
  } ];

  var showText = false;
  var checkStarbase = false;
  var checkFighters = false;
  var checkShip = false;
  
  function showMinerals() {
  }
  showMinerals.prototype = {

    loadControls : function() {
      // debugger;

      this.clearData();

      if (vgapMap.prototype.spMenuItem != undefined) {
        for (var i = 0; i < resources.length; ++i) {
	  // weird declaration fits the color into the existing class
	  vgapMap.prototype.spMenuItem(resources[i].name, "showMinerals\' style=\'color:" + resources[i].color, function() {

	    showMinerals.prototype.toggleRes(event.target.innerHTML);
	  });
        }

        vgapMap.prototype.spMenuItem("Text", "showText", function() {
	  showText = !showText;

	    checkStarbase = false;
	    checkFighters = false;
	    checkShip = false;
	      vgap.map.draw();
        });

        vgapMap.prototype.spMenuItem("Check Starbase", "checkStarbase", function() {
	  checkStarbase = !checkStarbase;
          showMinerals.prototype.clearRes();
	    showText = false;
            checkFighters = false;
            checkShip = false;
	      vgap.map.draw();
       });

        vgapMap.prototype.spMenuItem("Check Ship", "checkShip", function() {
          checkShip = !checkShip;
          showMinerals.prototype.clearRes();
	    showText = false;
	    checkStarbase = false;
            checkFighters = false;
	      vgap.map.draw();

	  });
        
        vgapMap.prototype.spMenuItem("Check Fighters", "checkFighters", function() {
          checkFighters = !checkFighters;
          showMinerals.prototype.clearRes();
	    showText = false;
	    checkStarbase = false;
	    checkShip = false;
	      vgap.map.draw();

	  });

        vgapMap.prototype.spMenuItem("Clear", "_massClear", function() {
	  showMinerals.prototype.clearData();
        });
      }
    },

    // display minerals
    toggleRes : function(name) {
      vgap.map.showresources = true;
      for (var i = 0; i < resources.length; ++i) {
	if (resources[i].name == name) {
	  resources[i].showRes = !resources[i].showRes;
	}
      }
      checkFighters = false;
      checkStarbase = false;
      checkShip = false;
      vgap.map.draw();
    },
    
    clearRes : function() {
      vgap.map.showresources = true;
      	for (var i = 0; i < resources.length; ++i) {
      	  resources[i].showRes = false;
      	}
      	vgap.map.draw();
    },

    clearData : function() {
      vgap.map.showresources = false;
      showText = true;
      checkStarbase = false;
      checkFighters = false;
      checkShip = false;
      for (var i = 0; i < resources.length; ++i) {
	resources[i].showRes = false;
	resources[i].surface = 0;
	resources[i].ground = 0;
      }
    },
    
    nativeTaxAmount : function(c, ntr) {
      var nt = 0;
      if (c.nativeclans > 0) {
	if (c.race == 6 && ntr > 20) { // borg == 6
	  ntr = 20;
	}

	var nt = (c.nativeclans / 100) * (ntr / 10) * (c.nativegovernment / 5);

	nt = c.nativetype == 5 ? 0 : nt; // amorphous == 5
	nt = c.nativetype == 6 ? 2 * nt : nt; // insect == 6
	nt = c.race == 1 ? 2 * nt : nt; // feds == 1

	nt = Math.round(nt);
      }
      return nt;
    },
    
    miningRate (p, ground, density) {
      m = vgap.miningRate(p, density);
      m = m > ground ? ground : Math.round(m);
	
      return m;
    },
    
    nativetaxsupport : function(c) {
      ns = c.clans;
      ns *= c.race == 1 ? 2 : 1; // feds == 1
      ns *= c.nativetype == 6 ? 2 : 1; // insect == 6
      return ns;
    },
  };

  var oldRenderResource = vgapMap.prototype.renderResource;
  vgapMap.prototype.renderResource = function(ctx) {
    // replace completely
    // oldRenderResource.apply(this, arguments);

    for (var d = 0; d < vgap.myplanets.length; d++) {
      var planet = vgap.myplanets[d];

      for (var i = 0; i < resources.length; ++i) {
	resources[i].surface = 0;
	resources[i].supplies = 0;
	resources[i].ground = 0;
	resources[i].target = 0;
	resources[i].mined = 0;
      }

      for (var i = 0; i < resources.length; ++i) {
	r = resources[i];
	if (r.name == "Molybdenum") {
	  r.surface = planet.molybdenum;
	  r.ground = planet.groundmolybdenum;
	  r.mined = showMinerals.prototype.miningRate (planet, planet.groundmolybdenum, planet.densitymolybdenum);
	  // console.log(planet.id+"p "+r.surface);
	}
	if (r.name == "Neutronium") {
	  r.surface = planet.neutronium;
	  r.ground = planet.groundneutronium;
	  r.mined = showMinerals.prototype.miningRate (planet, planet.groundneutronium, planet.densityneutronium);
	}
	if (r.name == "Duranium") {
	  r.surface = planet.duranium;
	  r.ground = planet.groundduranium;
	  r.mined = showMinerals.prototype.miningRate (planet, planet.groundduranium, planet.densityduranium);
	}
	if (r.name == "Tritanium") {
	  r.surface = planet.tritanium;
	  r.ground = planet.groundtritanium;
	  r.mined = showMinerals.prototype.miningRate (planet, planet.groundtritanium, planet.densitytritanium);
	}
	if (r.name == "Megacredits") {
	  r.surface = planet.megacredits + planet.supplies;
	  r.supplies = planet.supplies;
	  r.mined = planet.factories;
	    
	  nt = showMinerals.prototype.nativeTaxAmount(planet, planet.nativetaxrate);
	  ns = showMinerals.prototype.nativetaxsupport(planet);
	  r.mined += Math.min( nt , ns);
	}
      }

      for (var k = 0; k < vgap.myships.length; ++k) {
	var ship = vgap.myships[k];
	t = Math.dist(ship.targetx, ship.targety, planet.x, planet.y) <= 3;
	p = ship.x == planet.x && ship.y == planet.y;
	      
	for (var i = 0; i < resources.length; ++i) {
	  r = resources[i];
	      
	  if (p && t) {
	    if (r.name == "Molybdenum")
	      r.surface += ship.molybdenum;
	    if (r.name == "Neutronium")
	      r.surface += ship.neutronium;
	    if (r.name == "Duranium")
	      r.surface += ship.duranium;
	    if (r.name == "Tritanium")
	      r.surface += ship.tritanium;
	    if (r.name == "Megacredits") {
	      r.surface += ship.megacredits + ship.supplies;
	      r.supplies += ship.supplies;
	    }
	  } 
	  if (!p & t) {
            if (r.name == "Molybdenum")
     	      r.target += ship.molybdenum;
	    if (r.name == "Neutronium")
	      r.target += ship.neutronium;
	    if (r.name == "Duranium")
	      r.target += ship.duranium;
	    if (r.name == "Tritanium")
	      r.target += ship.tritanium;
	    if (r.name == "Megacredits") {
	      r.target += ship.megacredits + ship.supplies;
	    }
	  }
	}
      }
      
      var x1 = this.screenX(planet.x);
      var y1 = this.screenY(planet.y);
      
      if (checkStarbase || checkFighters || checkShip) {
	for (var i = 0; i < resources.length; ++i) {
	  r = resources[i];
	      
	  if (r.name == "Molybdenum") {
	    var mol = r.surface;
	    var molm = r.mined;
	    var mol2 = mol + r.mined + r.target;
          }
	  if (r.name == "Neutronium") {
	    var neu = r.surface;
	    var neym = r.mined;
	    var neu2 = neu + r.mined + r.target;
	  }
	  if (r.name == "Duranium") {
	    var dur = r.surface;
	    var durm = r.mined;
	    var dur2 = dur + r.mined + r.target;
	  }
	  if (r.name == "Tritanium") {
	    var tri = r.surface;
	    var trim = r.mined;
	    var tri2 = tri + r.mined + r.target;
	  }
	  if (r.name == "Megacredits") {
	    var mc = r.surface;
	    var sp = r.supplies;
	    var mcm = r.mined;
	    var mc2 = mc + r.mined + r.target;
	  }
	}

	if (checkStarbase) {
	  if (!planet.isbase) {
	    if (dur >= 120 && tri >= 302 && mol >= 430 && mc >= 900) {
	      this.drawCircle(ctx, x1, y1, 9 * this.zoom, "lightgreen", 2);
	    }
	    else if (dur2 >= 120 && tri2 >= 302 && mol2 >= 430 && mc2 >= 900) {
	      this.drawCircle(ctx, x1, y1, 12 * this.zoom, "yellow", 2);
	    }
	      
	  }
	} else if (checkFighters) {
	  fighters = Math.floor(Math.min(sp/5, tri/3, mol/2));
	  if (fighters > 0) {
	    ctx.fillStyle = "orange";
	    x2 = this.screenX(planet.x + 7.5 * 1.5);
	    y2 = this.screenY(planet.y + 1 * 1.5);
	    ctx.fillText(fighters, x2, y2);
	
	  }	
	} else if (checkShip) {
	  if (planet.isbase) {
	    if (dur >= 398 && tri >= 194 && mol >= 457 && mc >= 2837) {
	      this.drawCircle(ctx, x1, y1, 9 * this.zoom, "lightgreen", 2);
	      
		    if (dur2 >= 796 && tri2 >= 388 && mol2 >= 914 && mc2 >= 5674) {
		      this.drawCircle(ctx, x1, y1, 15 * this.zoom, "orange", 2);
		    }
		    else {
			      if (dur2 < 796) {
				
				f = dur2 - 796;
				ctx.fillStyle = "cyan";
			        x2 = this.screenX(planet.x + 7.5 * 1.5);
			        y2 = this.screenY(planet.y - (1 - 2) * 6 * 1.5);
			        ctx.fillText(f, x2, y2);

			        // this.drawCircle(ctx, x1, y1, 9 * this.zoom, "cyan", 2);
			      }
			      if (tri2 < 388) {
				
				f = tri2 - 388;
				ctx.fillStyle = "orange";
			        x2 = this.screenX(planet.x + 7.5 * 1.5);
			        y2 = this.screenY(planet.y - (2 - 2) * 6 * 1.5);
			        ctx.fillText(f, x2, y2);

			        // this.drawCircle(ctx, x1, y1, 12 * this.zoom, "orange", 2);
			      }
			      if (mol2 < 914) {
				
				f = mol2 - 914;
				ctx.fillStyle = "violet";
			        x2 = this.screenX(planet.x + 7.5 * 1.5);
			        y2 = this.screenY(planet.y - (3 - 2) * 6 * 1.5);
			        ctx.fillText(f, x2, y2);

			        // this.drawCircle(ctx, x1, y1, 15 * this.zoom, "violet", 2);
			      }
			      if (mc2 < 5674) {
				
				f = mc2 - 5674;
				ctx.fillStyle = "lightgreen";
			        x2 = this.screenX(planet.x + 7.5 * 1.5);
			        y2 = this.screenY(planet.y - (4 - 2) * 6 * 1.5);
			        ctx.fillText(f, x2, y2);

			        // this.drawCircle(ctx, x1, y1, 18 * this.zoom, "lightgreen",
				// 2);
			      }
	    }
	    }  
	      
	    
	    else if (dur2 >= 398 && tri2 >= 194 && mol2 >= 457 && mc2 >= 2837) {
	      this.drawCircle(ctx, x1, y1, 12 * this.zoom, "yellow", 2);
	    }
	    else
	      if (dur2 < 398) {
		
		f = dur2 - 398;
		ctx.fillStyle = "cyan";
	        x2 = this.screenX(planet.x + 7.5 * 1.5);
	        y2 = this.screenY(planet.y - (1 - 2) * 6 * 1.5);
	        ctx.fillText(f, x2, y2);

	        // this.drawCircle(ctx, x1, y1, 9 * this.zoom, "cyan", 2);
	      }
	      if (tri2 < 194) {
		
		f = tri2 - 194;
		ctx.fillStyle = "orange";
	        x2 = this.screenX(planet.x + 7.5 * 1.5);
	        y2 = this.screenY(planet.y - (2 - 2) * 6 * 1.5);
	        ctx.fillText(f, x2, y2);

	        // this.drawCircle(ctx, x1, y1, 12 * this.zoom, "orange", 2);
	      }
	      if (mol2 < 457) {
		
		f = mol2 - 457;
		ctx.fillStyle = "violet";
	        x2 = this.screenX(planet.x + 7.5 * 1.5);
	        y2 = this.screenY(planet.y - (3 - 2) * 6 * 1.5);
	        ctx.fillText(f, x2, y2);

	        // this.drawCircle(ctx, x1, y1, 15 * this.zoom, "violet", 2);
	      }
	      if (mc2 < 2837) {
		
		f = mc2 - 2837;
		ctx.fillStyle = "lightgreen";
	        x2 = this.screenX(planet.x + 7.5 * 1.5);
	        y2 = this.screenY(planet.y - (4 - 2) * 6 * 1.5);
	        ctx.fillText(f, x2, y2);

	        // this.drawCircle(ctx, x1, y1, 18 * this.zoom, "lightgreen",
		// 2);
	      }
	  }
	}
      }
      else {

	for (var i = 0; i < resources.length; ++i) {
	  if (resources[i].showRes == true) {
	    var color = resources[i].color;
	    var radius;

	    if (showText) {
	      f = resources[i].surface + "-" + (resources[i].surface + resources[i].mined + resources[i].target);
	      ctx.fillStyle = color;
	      x2 = this.screenX(planet.x + 7.5 * 1.5);
	      y2 = this.screenY(planet.y - (i - 2) * 6 * 1.5);
	      ctx.fillText(f, x2, y2);
	    } else {
	      if (resources[i].ground > 0) {
		radius = Math.sqrt(resources[i].ground) * this.zoom;
		this.drawCircle(ctx, x1, y1, radius, color, 1);
	      }
	      if (resources[i].surface > 0) {
		radius = Math.sqrt(resources[i].surface) * this.zoom;	
		this.drawCircle(ctx, x1, y1, radius, color, 2);
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

    showMinerals.prototype.loadControls();
  };
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
