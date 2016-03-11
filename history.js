// ==UserScript==
// @name          Planets.nu game history
// @description   Show game history
// @include       http://planets.nu/*
// @include       http://*.planets.nu/*
// @homepage      http://planets.nu/discussion/utility-script-game-history
// @version 1.3
// ==/UserScript==

function wrapper() {

  function loadHistory() {}
  loadHistory.prototype = {

    loadControls: function() {
      var history = [{}];
      var turn = 1;

      this.clearData();

      vgapMap.prototype.spMenuItem("Load Turns", "loadAll", function(event) {
        loadHistory.prototype.loadTurns(vgap.player.id, vgap.apikey);
      });

      // this.addTool("Next Turn", "nextTurn", function() {
      //   loadHistory.prototype.nextTurn();
      // });
      //
      // this.addTool("Prev Turn", "prevTurn", function() {
      //   loadHistory.prototype.prevTurn();
      // });
    },

    clearData: function() {
      this.history = [{}];
      this.turn = 0;
    },

    loadTurns: function(player, apikey) {
      if (apikey == null)
        return;

      vgap.indicator.text("loading " + player + " - " + 1 + " " + apikey);
      vgap.indicateOn();

      var a = new dataObject();
      a.add("gameid", vgap.gameId);
      a.add("playerid", player);
      a.add("turn", this.turn);
      a.add("apikey", apikey);

      try {
        vgap.request("/game/loadturn", a, function(b) {
          debugger;
          loadHistory.prototype.cacheFromRST(b);
        });
      } catch (e) {
        debugger;
        vgap.indicator.text("error");
        vgap.indicateOn();
      }
    },


    /*    loadNextTurn: function(turn) {
        var t = turn;
        if (++t > vgap.game.turn) {
          vgap.map.prototype.drawTurn(t);
          return;
        }

        loadTurns(turn);

        if (t != turn)
          vgap.map.prototype.drawTurn(turn);
      },
*/
    cacheFromRST: function(b) {
      var a = b.rst.settings.turn;
      var hist = history[a];

      for (var i = 0; i < b.rst.planets.length; ++i) {
        var p = b.rst.planets[i];
        var h = hist.planets[p.id];
        if (p.ownerid == player || p.infoturn >= h.infoturn) {
          h = p;
        }
      }

      for (var i = 0; i < b.rst.ships.length; ++i) {
        var s = b.rst.ships[i];
        if (!(h = vgap.getArray(history[a].ships, s.id))) {
          h.push(s);
        } else {
          if (s.ownerid == player || s.infoturn > h.infoturn) {
            h = s;
          }
        }
      }

      for (var i = 0; i < b.rst.starbases.length; ++i) {
        var s = b.rst.starbases[i];
        if (!(h = vgap.getArray(history[a].starbases, s.id))) {
          h.push(s);
        } else {
          if (s.ownerid == player || s.infoturn > h.infoturn) {
            h = s;
          }
        }
      }

      for (var i = 0; i < b.rst.minefields.length; ++i) {
        var s = b.rst.minefields[i];
        if (!(h = vgap.getArray(history[a].minefields, s.id))) {
          h.push(s);
        } else {
          if (s.ownerid == player || s.infoturn > h.infoturn) {
            h = s;
          }
        }
      }

      for (var i = 0; i < b.rst.ionstorms.length; ++i) {
        var s = b.rst.ionstorms[i];
        if (!(h = vgap.getArray(history[a].ionstorms, s.id))) {
          h.push(s);
        }
      }

      for (var i = 0; i < b.rst.messages.length; ++i) {
        var message = b.rst.messages[i];
        if (message.messagetype == 10) {
          if (history[a].messageMap[message.x + "," + message.y] === undefined) {
            history[a].messageMap[message.x + "," + message.y] = message;
            history[a].messages.push(message);
          }
        }
      }

      for (var i = 0; i < b.rst.notes.length; ++i) {
        var note = b.rst.notes[i];
        history[a].notes.push(note);
      }
    },
  };
    /*
          drawTurn: function(t) {
            var b = "";
            if (t == 1)
              b += "<div id='rNav'><a disabled='disabled' class='rNavLeft'>back</a>";
            else
              b += "<div id='rNav'><a onclick='vgap.map.drawTurn(" + (t - 1) + ");' class='rNavLeft'>back</a>";
            b += "<span id='rNavState'>Turn " + t + "</span>";
            if (t < vgap.game.turn)
              b += "<a onclick='vgap.map.drawTurn(" + (t + 1) + ");' class='rNavRight'>next</a></div>";
            else
              b += "<a disabled='disabled' class='rNavRight'>next</a></div>";

            $("#rNav").replaceWith(b);


            if (t != vgap.historyDrawn || t == 0) {
              vgap.historyDrawn = t;

              delete vgap.planetMap;
              vgap.planetMap = new Array();
              for (var i = 0; i < vgap.planets.length; ++i) {
                var planet = vgap.planets[i];
                if (vgap.history[t].planets[i] !== undefined) {
                  vgap.planets[i] = vgap.history[t].planets[i];
                  planet = vgap.planets[i];
                } else {
                  planet.infoturn = 0;
                  planet.ownerid = 0;
                }

                x + "," + planet.y]: planet;
            }

            vgap.starbases = vgap.history[t].starbases;
            vgap.ionstorms = vgap.history[t].ionstorms;
            vgap.messages = vgap.history[t].messages;
            vgap.minefields = vgap.history[t].minefields;
            //	        vgap.notes = vgap.history[t].notes;
            vgap.ships = vgap.history[t].ships;

            delete vgap.shipMap;
            vgap.shipMap = new Array();

            for (var i = 0; i < vgap.ships.length; ++i) {
              var ship = vgap.ships[i];
              if (vgap.shipMap[ship.x + "," + ship.y] === undefined) {
                vgap.shipMap[ship.x + "," + ship.y] = new Array();
              }

              vgap.shipMap[ship.x + "," + ship.y].push(ship);
            }

            vgap.map.createAssociativeHitMap();
            vgap.map.canvasRendered = false;
            vgap.map.drawMap();
          }
        },
      };
      */

    var oldLoadControls = vgapMap.prototype.loadControls;
    vgapMap.prototype.loadControls = function() {
      oldLoadControls.apply(this, arguments);

      loadHistory.prototype.loadControls();
    };
  }

  var script = document.createElement("script");
  script.type = "application/javascript";
  script.textContent = "(" + wrapper + ")();";

  document.body.appendChild(script);
