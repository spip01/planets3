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

        vgapMap.prototype.spMenuItem("Text", "showMinerals", function() {
	  showText = !showText;

	    checkStarbase = false;
	    checkFighters = false;
	    checkShip = false;
	      vgap.map.draw();
        });

        vgapMap.prototype.spMenuItem("Check Starbase", "showMinerals", function() {
	  checkStarbase = !checkStarbase;
          showMinerals.prototype.clearRes();
	    showText = false;
            checkFighters = false;
            checkShip = false;
	      vgap.map.draw();
       });

        vgapMap.prototype.spMenuItem("Check Ship", "showMinerals", function() {
          checkShip = !checkShip;
          showMinerals.prototype.clearRes();
	    showText = false;
	    checkStarbase = false;
            checkFighters = false;
	      vgap.map.draw();

	  });
        
        vgapMap.prototype.spMenuItem("Check Fighters", "showMinerals", function() {
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
	  
	  // 104 neutronic refinery - supplies + minerals to fuel 1+1:1
	  // 105 merlin - supplies to minerals 3:1
	  // 97 aries - minerals to fuel 1:1
	  
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
            if (r.name == "Molybdenum") {
     	      r.target += ship.molybdenum;
            }
	    if (r.name == "Neutronium") {
	      r.target += ship.neutronium;
	    }
	    if (r.name == "Duranium") {
	      r.target += ship.duranium;
	    } 
	    if (r.name == "Tritanium") {
	      r.target += ship.tritanium;
	    } 
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
	      this.drawCircle(ctx, x1, y1, 12 * this.zoom, "crimson", 3);
	    }
	    else if (dur2 >= 120 && tri2 >= 302 && mol2 >= 430 && mc2 >= 900) {
	      this.drawCircle(ctx, x1, y1, 12 * this.zoom, "yellow", 3);
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
	    for (var i = 0; i < vgap.mystarbases.length; ++i) {
	      if (vgap.mystarbases[i].planetid == planet.id) {
		sb = vgap.mystarbases[i];
	      }
	    }
		  
	    x2 = this.screenX(planet.x + 12 * 1.5);
// debugger;
// var cmp = {dur:398, tri:194, mol:457, mc:2837}; // rush
	    
	    var ship = vgap.shipScreen.ship;
	    var hull = vgap.getHull(ship.hullid);
	    
	    var cmp = {dur:hull.duranium, tri:hull.tritanium, mol:hull.molybdenum, mc:hull.cost};
	    
	    if (ship.beams > 0) {
	      var b = vgap.beams[ship.beamid - 1];
	      cmp.dur += b.duranium * ship.beams;
	      cmp.tri += b.tritanium * ship.beams;
	      cmp.mol += b.molybdenum * ship.beams;
	      cmp.mc += b.cost * ship.beams;
	    }
	    
	    if (ship.torps > 0) {
	      b = vgap.torpedos[ship.torpedoid - 1];
	      cmp.dur += b.duranium * ship.torps;
	      cmp.tri += b.tritanium * ship.torps;
	      cmp.mol += b.molybdenum * ship.torps;
	      cmp.mc += b.cost * ship.torps;
	    }
	    
	    b = vgap.engines[ship.engineid - 1];
	    cmp.dur += b.duranium * hull.engines;
	    cmp.tri += b.tritanium * hull.engines;
	    cmp.mol += b.molybdenum * hull.engines;
	    cmp.mc += b.cost * hull.engines;

	    var checkdur = dur - cmp.dur;
	    var checktri = tri - cmp.tri;
	    var checkmol = mol - cmp.mol;
	    var checkmc = mc - cmp.mc;
	    
	    if ( checkdur >= 0 && checktri >= 0 && checkmol >= 0 && checkmc >= 0 || sb.isbuilding) {
	      if (sb.isbuilding)
		this.drawCircle(ctx, x1, y1, 12 * this.zoom, "blue", 2);
	      else {
		var cmp = {dur:cmp.dur * 2, tri:cmp.tri * 2, mol:cmp.mol * 2, mc:cmp.mc * 2};
		this.drawCircle(ctx, x1, y1, 12 * this.zoom, "green", 2);
	      }
	    }
	    else
		this.drawCircle(ctx, x1, y1, 12 * this.zoom, "red", 2);

	    checkdur = dur2 - cmp.dur;
	    checktri = tri2 - cmp.tri;
	    checkmol = mol2 - cmp.mol;
	    checkmc = mc2 - cmp.mc;
	      
	    if ( checkdur >= 0 && checktri >= 0 && checkmol >= 0 && checkmc >= 0) 
	      this.drawCircle(ctx, x1, y1, 16 * this.zoom, "cyan", 2);
	    else 
	      this.drawCircle(ctx, x1, y1, 16 * this.zoom, "orange", 2);
	    
// if (checkdur < 0) {
	      ctx.fillStyle = "cyan";
	      y2 = this.screenY(planet.y - (1 - 2) * 6 * 1.5);
	      ctx.fillText(checkdur, x2, y2);
// }
// if (checktri < 0) {
	      ctx.fillStyle = "orange";
	      y2 = this.screenY(planet.y - (2 - 2) * 6 * 1.5);
	      ctx.fillText(checktri, x2, y2);
// }
// if (checkmol < 0) {
	      ctx.fillStyle = "violet";
	      y2 = this.screenY(planet.y - (3 - 2) * 6 * 1.5);
	      ctx.fillText(checkmol, x2, y2);
// }
// if (checkmc < 0) {
	      ctx.fillStyle = "lightgreen";
	      y2 = this.screenY(planet.y - (4 - 2) * 6 * 1.5);
	      ctx.fillText(checkmc, x2, y2);
// }
	  }
	}  
     }
      else {

	for (var i = 0; i < resources.length; ++i) {
	  if (resources[i].showRes == true) {
	    var color = resources[i].color;
	    var radius;

	    if (showText) {
	      f = resources[i].surface + "+" + (resources[i].mined + resources[i].target);
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
