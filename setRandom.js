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

      vgapMap.prototype.spMenuItem("Random FCs", "randomFC", function() {
	setRandom.prototype.setRandomFC();
      });

      vgapMap.prototype.spMenuItem("Random Ship Names", "randomShipName", function() {
	setRandom.prototype.setRandomShipNames();
      });

      vgapMap.prototype.spMenuItem("Exec Notes", "execNotes", function() {
	setRandom.prototype.execNotes();
      });

    },

    setRandomFC : function() {
      for (var i = 0; i < vgap.planets.length; ++i) {
	var planet = vgap.planets[i];
	if (vgap.player.id == planet.ownerid && planet.readystatus == 0) {
	  if (planet.friendlycode == /[0-9][a-zA-Z][0-9]/) {
	    planet.friendlycode = vgaPlanets.randomFC();
	    planet.changed = true;
	  }
	}
	;
      }
      for (var i = 0; i < vgap.ships.length; ++i) {
	var ship = vgap.ships[i];
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

      for (var i = 0; i < vgap.ships.length; ++i) {
	var ship = vgap.ships[i];
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
    // "factories": "100"
    // },
    // "taxes": {
    // "native": "happy"
    // },
    // "ready": ""
    // }
    // }
    // }

    execNotes : function() {
      for (var f = 0; f < vgap.planets.length; f++) {
	var l = vgap.planets[f];
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

	    if (jn.fc != undefined) {
	      if (jn.fc == "random") {
		l.friendlycode = vgap.randomFC();
		l.changed = true;
		console.log("rnd " + l.id + " " + l.friendlycode);
	      }
	    }

	    // if (jn.builddef != undefined) {
	    // if (jn.builddef == "max") {
	    //								
	    // }
	    // }
	    //
	    // if (jn.buildfact != undefined) {
	    // if (jn.buildfact == "max") {
	    //								
	    // }
	    // }
	    //
	    // if (jn.buildmines != undefined) {
	    // if (jn.buildmines == "max") {
	    //								
	    // }
	    // }

	    // has to be last
	    if (jn.ready != undefined) {
	      console.log("ready " + l.id);
	      l.readystatus = 1;
	      l.changed = true;
	      continue;
	    }
	  }
	}
      }

      vgap.indicator.text("done");
      vgap.indicateOn();
    },

  };

  var oldDrawPlanet = vgapMap.prototype.drawPlanet;
  vgapMap.prototype.drawPlanet = function(planet, ctx, fullrender) {
    oldDrawPlanet.apply(this, arguments);

    var x = this.screenX(planet.x);
    var y = this.screenY(planet.y);

    // draw planets not ready
    if (planet.infoturn > 0) {
      if (execPlanets != undefined) {
	for (i = 0; i < execPlanets.length; ++i) {
	  if (execPlanets[i] == planet.id) {
	    this.drawCircle(ctx, x, y, 11 * this.zoom, "green", 3);
	  }
	}
      }
    }
  };

  var oldRandomFC = vgaPlanets.prototype.randomFC;
  vgaPlanets.prototype.randomFC = function() {
    var c = "";
    c += Math.floor(Math.random() * 9);

    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    c += b.charAt(Math.floor(Math.random() * b.length)) // vgap generator
    // can generate
    // commands

    c += Math.floor(Math.random() * 9);

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
