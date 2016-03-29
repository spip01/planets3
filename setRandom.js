// ==UserScript==
// @name          randomizeFCs
//
// @description   randomize names and FCs for planets.nu and replaces the builtin random generator
// 				  to eliminate command codes it only replaces FCs in the format 0a0.
// 				  ship names get changed only if they contain capital letters.
//
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// @homepage      https://greasyfork.org/en/users/32642-stephen-piper
// ==/UserScript==

function wrapper() {
  var execPlanets = [];

  function setRandom() {
  }
  setRandom.prototype = {

    loadControls : function() {
      // debugger;
      this.clearData();

      if (vgapMap.prototype.spMenuItem != undefined) {
	vgapMap.prototype.spMenuItem("Random FCs", "randomFC", function() {
	  setRandom.prototype.setRandomFC();
	});

	vgapMap.prototype.spMenuItem("Random Ship Names", "randomShipName", function() {
	  setRandom.prototype.setRandomShipNames();
	});

	vgapMap.prototype.spMenuItem("Exec Notes", "execNotes", function() {
	  setRandom.prototype.execNotes();
	});

	vgapMap.prototype.spMenuItem("Clear", "_massClear", function() {
	  setRandom.prototype.clearData();
	});
      }

    },

    clearData : function() {
      execPlanets = [];
    },

    setRandomFC : function() {
      for (var i = 0; i < vgap.myplanets.length; ++i) {
	var planet = vgap.myplanets[i];
	if (vgap.player.id == planet.ownerid && planet.readystatus == 0) {
	  if (planet.friendlycode == /[0-9][a-zA-Z][0-9]/) {
	    planet.friendlycode = vgaPlanets.randomFC();
	    planet.changed = true;
	  }
	}
	;
      }
      for (var i = 0; i < vgap.myships.length; ++i) {
	var ship = vgap.myships[i];
	if (vgap.player.id == ship.ownerid && ship.readystatus == 0) {
	  if (ship.friendlycode == /[0-9][a-zA-Z][0-9]/) {
	    ship.friendlycode = vgaPlanets.randomFC();
	    ship.changed = true;
	  }
	}
	;
      }

      vgap.indicator.text("done");
      vgap.indicateOn();
    },

    setRandomShipNames : function() {
      var url = "http://api.wordnik.com:80/v4/words.json/randomWord";
      var data = {
	"hasDictionaryDef" : "true",
	"includePartOfSpeech" : "verb-intransitive",
	"minLength" : "5",
	"maxLength" : "16",
	"limit" : "1",
	"api_key" : "a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
      };
      var pat = /.*?[A-Z]/;

      for (var i = 0; i < vgap.myships.length; ++i) {
	var ship = vgap.myships[i];
	if (vgap.player.id == ship.ownerid && pat.test(ship.name)) {
	  $.ajax({
	    async : false,
	    type : 'GET',
	    url : url,
	    data : data,
	    success : function(data) {
	      ship.name = data.word;
	      ship.changed = 1;
	    }
	  });
	}
      }

      vgap.indicator.text("done");
      vgap.indicateOn();
    },

    // {
    // default": {
    // "planet": {
    // "fc": {
    // "def20": "nuk",
    // "random": ""
    // },
    // "build": {
    // "factories": "20",
    // "defense": "20",
    // "mines": "20",
    // "factories2": "999", // 2nd build phaze if wanted
    // "defense2": "999",
    // "mines2": "999",
    // "minesminres": "500" // minimum value of groundminerals for max
    // buildmines
    // & buildmines2
    // },
    // "taxes": {
    // "nattaxhappy":"70", // verified by maxtaxvalue > nattaxamount
    // "nattaxhappychange":"3", // max value to change taxhappy
    // "nattax":"12", // nattax verified by taxhappy & maxtaxvalue
    // "nattaxmin":"200" // min(nattaxmin, nattaxamount)
    // },
    // "ready": ""
    // }
    // }
    // }

    // Happychange = (1000 - SQRT(Native Clans) - Native Taxlevel*85 -
    // (factories + mines)/2 - 50*(10-Native Government)) / 100

    // taxrate = (- happychange * 100 + 1000 - sqrt(clans) - (factories + mines)
    // / 2 - 50 * (10 - government))/85

    execNotes : function() {
      for (var f = 0; f < vgap.myplanets.length; f++) {
	var l = vgap.myplanets[f];
	if (vgap.player.id == l.ownerid) {

	  if (l.note != undefined && l.note.body != "") {
	    try {
	      var jn = JSON.parse(l.note.body
	      // , function(h, k) {console.log(h+" "+k)}
	      );
	      execPlanets.push(l.id);
	    } catch (e) {
	      continue;
	    }

	    // commands executed in this order NOT the notes order
	    if (jn.fc != undefined) {
	      if (jn.fc == "random") {
		l.friendlycode = vgap.randomFC();
		console.log("fc " + l.id + " rnd " + l.friendlycode);
	      } else {
		l.friendlycode = jn.fc;
		console.log("fc " + l.id + " " + l.friendlycode);
	      }
	    }

	    if (jn.buildfact != undefined) { // 1st phaze
	      var b = this.buildFactories(l, jn.buildfact);
	      console.log("bldF " + l.id + " " + b + " = " + l.factories);
	    }

	    if (jn.builddef != undefined) { // 1st phaze
	      var b = this.buildDefense(l, jn.builddef);
	      console.log("bldD " + l.id + " " + b + " = " + l.defense);
	      if (l.id.defense >= jn.builddef && jn.defensefc != undefined) {
		l.friendlycode = jn.defensefc;
		console.log("defFC " + l.id + " " + l.friendlycode);
	      }
	    }

	    if (jn.buildmines != undefined) {
	      var b = this.buildMines(l, jn.buildmines);
	      console.log("bldM " + l.id + " " + b + " = " + l.mines);
	    }

	    if (jn.buildfact2 != undefined) { // 2nd phaze
	      var b = this.buildFactories(l, jn.buildfact2);
	      console.log("bldF2 " + l.id + " " + b + " = " + l.factories);
	    }

	    if (jn.builddef2 != undefined) { // 2nd phaze
	      var b = this.buildDefense(l, jn.builddef2);
	      console.log("bldD2 " + l.id + " " + b + " = " + l.defense);
	    }

	    if (jn.buildmines2 != undefined) { // 2nd phaze
	      var b = this.buildMines(l, jn.buildmines2);
	      console.log("bldM2 " + l.id + " " + b + " = " + l.mines);
	    }

	    // has to be last
	    if (jn.ready != undefined) {
	      l.readystatus = 1;
	      console.log("ready " + l.id);
	    }

	    l.changed = true;
	  }
	}
      }

      vgap.indicator.text("done");
      vgap.indicateOn();
    },

    buildFactories : function(d, a) {
      // if (d.id == 342)
      // debugger;

      var c = this.maxBuilding(d, 100);

      a = Math.min(a - d.factories, d.supplies, Math.floor((d.supplies + d.megacredits) / 4), c - d.factories);

      if (a > 0) {
	this.spendSuppliesMC(d, a, a * 3);

	d.builtfactories += a;
	d.factories += a;
	d.changed = true;
      }

      return a;
    },

    spendSuppliesMC : function(d, c, a) {
      if (c + a < d.supplies + d.megacredits && c < d.supplies) {
	if (d.megacredits < a) {
	  var b = a - d.megacredits;
	  d.megacredits += b;
	  d.supplies -= b;
	  d.suppliessold += b;
	}
	d.megacredits -= a;
	d.supplies -= c;
	d.changed = true;
      }
    },

    buildMines : function(d, a) {
      // if(d.id == 342)
      // debugger;
      var c = this.maxBuilding(d, 200);

      a = Math.min(a - d.mines, d.supplies, Math.floor((d.supplies + d.megacredits) / 5), c - d.mines);

      if (a > 0) {
	this.spendSuppliesMC(d, a, a * 4);

	d.builtmines += a;
	d.mines += a;
	d.changed = true;
      }
      return a;
    },

    buildDefense : function(d, a) {
      // if(d.id == 342)
      // debugger;
      var c = this.maxBuilding(d, 50);

      a = Math.min(a - d.defense, d.supplies, Math.floor((d.supplies + d.megacredits) / 11), c - d.defense);

      if (a > 0) {
	this.spendSuppliesMC(d, a, a * 10);

	// if (d.megacredits < (a * 10)) {
	// var b = (a * 10) - d.megacredits;
	// d.megacredits += b;
	// d.supplies -= b;
	// d.suppliessold += b
	// }
	// d.megacredits -= a * 10;
	// d.supplies -= a;
	d.builtdefense += a;
	d.defense += a;
	d.changed = true;
      }
      return a;
    },

    maxBuilding : function(d, a) {
      if (d.clans <= a) {
	return d.clans
      } else {
	return Math.floor(a + Math.sqrt(d.clans - a))
      }
    },

    getNote : function(b, c) {
      for (var a = 0; a < b.notes.length; a++) {
	if (c.notes[a].targetid == b && c.notes[b].targettype == c) {
	  b = c.notes[a]
	}
      }
      return b;
    },

    nativePopGrowth : function(c) {
      var a = 0;
      var b = 0;
      if ((c.nativehappypoints + vgap.nativeTaxChange(c)) >= 70 && c.nativeclans > 0 && c.clans > 0) {
	if (c.nativetype == 9) {
	  b = c.temp * 1000;
	  a = a + Math.round(((c.temp / 100) * (c.nativeclans / 25) * (5 / (c.nativetaxrate + 5))));
	} else {
	  b = Math.round(Math.sin(3.14 * (100 - c.temp) / 100) * 150000);
	  a = a + Math.round(Math.sin(3.14 * ((100 - c.temp) / 100)) * (c.nativeclans / 25) * (5 / (c.nativetaxrate + 5)));
	}
	if (c.nativeclans > 66000) {
	  a = Math.round(a / 2);
	}
	if (c.nativeclans > b) {
	  a = 0;
	}
      }
      return a;
    },

    nativeTaxAmount : function(d, c) {
      if (d.nativetype == 5) {
	return 0;
      }
      var a = d.nativetaxrate;
      var b = vgap.getPlayer(d.ownerid);
      if (b != null) {
	if (b.raceid == 6 && a > 20) {
	  a = 20;
	}
      }
      var e = Math.round(a * d.nativetaxvalue / 100 * d.nativeclans / 1000);
      if (e > d.clans && !c) {
	e = d.clans;
      }
      var d = 1;
      if (vgap.advActive(2)) {
	d = 2;
      }
      e = e * d;
      if (d.nativetype == 6) {
	e = e * 2;
      }
      if (e > 5000) {
	e = 5000;
      }
      return e;
    },

  };

  var oldDrawPlanet = vgapMap.prototype.drawPlanet;
  vgapMap.prototype.drawPlanet = function(planet, ctx, fullrender) {

    var note = planet.note;
    planet.note = "";

    oldDrawPlanet.apply(this, arguments);

    planet.note = note;

    var x = this.screenX(planet.x);
    var y = this.screenY(planet.y);

    // planets with script executed
    if (execPlanets != undefined) {
      for (i = 0; i < execPlanets.length; ++i) {
	if (execPlanets[i] == planet.id) {
	  this.drawCircle(ctx, x, y, 11 * this.zoom, "blue", 2);
	}
      }
    }

    if (planet.note && planet.note.body.length > 0) {
      this.drawCircle(ctx, x, y, 3.5 * this.zoom, "blue", 1);
    }

  };

  // vgaPlanets.prototype.randomFC() can generate commands
  var oldRandomFC = vgaPlanets.prototype.randomFC;
  vgaPlanets.prototype.randomFC = function() {
    var c = "";
    c += Math.floor(Math.random() * 10);

    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    c += b.charAt(Math.floor(Math.random() * b.length))

    c += Math.floor(Math.random() * 10);

    return c
  };

  var oldLoadControls = vgapMap.prototype.loadControls;
  vgapMap.prototype.loadControls = function() {
    oldLoadControls.apply(this, arguments);

    setRandom.prototype.loadControls();
  };
};

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
