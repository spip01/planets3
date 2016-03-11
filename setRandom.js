// ==UserScript==
// @name          randomize
// @description   randomize names and FCs for planets.nu  
// @description   replaces the builtin random generator to eliminate command codes
// @description   it only replaces FCs in the format 0a0.  ship names get changed
// @description   only if they contain capital letters.
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// @namespace
// ==/UserScript==

function wrapper() {

	function setRandom() {
	}
	setRandom.prototype = {

		loadControls : function() {
			// debugger;

			vgapMap.prototype.spMenuItem("Random FCs", "randomFC", function() {
				setRandom.prototype.setRandomFC();
			});

			vgapMap.prototype.spMenuItem("Random Ship Names", "randomShipName",
					function() {
						setRandom.prototype.setRandomShipNames();
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
