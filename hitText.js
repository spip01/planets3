// ==UserScript==
// @name          hoverTextbox
// @description   rewrites the information you get when you hover over a planet
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// @homepage      https://greasyfork.org/en/users/32642-stephen-piper
// ==/UserScript==

//1 Humanoid - Any starbase that is built around a humanoid planet will have tech 10 hull technology automatically.
//7 Amphibian - Any starbase that is built around a amphibian planet will have tech 10 beam technology automatically.
//8 Ghipsoldal - Any starbase that is built around a ghipsoldal planet will have tech 10 engine technology automatically.
//9 Siliconoid - Any starbase that is built around a siliconoid planet will have tech 10 torpedo technology automatically.


//2 Bovinoid - Bovinoids are very valuable. Every 10000 Bovinoids will produce 1 supply unit per turn.
//3 Reptilian - If there Reptilians living on a planet then your mining rate will be doubled.
//4 Avian - Are quick to forgive you for overtaxing them. They will allow you to slightly overtax them without growing unhappy.
//5 Amorphous - The only bad natives. The Amorphous lifeforms eat 500 colonists (5 clans) per turn.
//6 Insectoid - Insectoids produce twice the normal amount of credits per turn per percentage as other native races.

function wrapper() {
  function hitText() {
  }
  hitText.prototype = {

    nativeTaxAmount : function(c, ntr) {
      var nt = 0;
      if (c.nativeclans > 0) {
	if (c.race == 6 && ntr > 20) { // borg == 6
	  ntr = 20;
	}

	var nt = (c.nativeclans / 100) * (ntr / 10) * (c.nativegovernment / 5);

	nt = c.nativetype == 5 ? 0 : nt; // amorphous == 5
	nt *= c.race == 1 ? 2 : 1; // feds == 1
        nt *= c.nativetype == 6 ? 2 : 1; // insect == 6

	nt = Math.round(nt);
      }
      return nt;
    },
    
    nativesupportedtax : function(c) {
      ns = c.clans;
      ns *= c.race == 1 ? 2 : 1; // feds == 1
      ns *= c.nativetype == 6 ? 2 : 1; // insect == 6
      return ns;
    },
   
    miningRate (p, ground, density) {
	m = vgap.miningRate(p, density);
	m = m > ground ? ground : Math.round(m);
	
	return m;
    },

  };

  var oldHitTextBox = vgapMap.prototype.hitTextBox;
  vgapMap.prototype.hitTextBox = function(c) {
// replace completely, pretty sure i want to do this
// oldHitTextBox.apply(this, arguments);

    var q = "";
    q += "<div class='ItemSelectionBox minCorrection'>";

    if (c.isPlanet) {
      if (c.id < 0) {
	c = vgap.getPlanet(-c.id);
      }

      q += "<table class='CleanTable'>";

      q += "<tr><td colspan='2'>" + c.id + ":" + c.name + "</td>";

      if (c.clans > 0) {
	q += "<td align='right' colspan='2'>&nbsp;" + c.clans + "</td>";
	q += "<td align='right'>&nbsp;" + c.friendlycode + "</td><td align='right'>&nbsp;" + c.temp + "</td>";
      }
      q += "</tr>";

      if (c.nativeclans > 0) {
	q += "<tr><td colspan='2'>" + c.nativeracename + "</td>";
	q += "<td align='right' colspan='2'>&nbsp;" + c.nativeclans + "</td>"
	if (c.ownerid == vgap.player.id) {
	  q += "<td align='right'>&nbsp;" + c.nativehappypoints + "%</td>";
	  q += "<td align='right'>&nbsp;" + c.nativetaxrate + "%</td>";
	}
	q += "</tr>";
      }

      // if (vgap.player.status == 7 && !c) {
      // var e = ["None", "Colonization", "Build Starbase", "Supply
      // Starbase", "Exploration", "Build Special", "Attack", "Defend",
      // "Move Fuel"];
      // return "<tr><td colspan='" + a + "' class='WarnText'>" +
      // e[b.goal] + "-" + b.goaltarget + "</td></tr>"
      // }

      if (c.infoturn != 0 && !vgap.godmode) {
	// q += this.hitText(c, c.isPlanet).replace("&nbsp", "");

	var sp = c.factories;

	var cs = 0;
	var nt = 0;
	var cs20 = 0;
	var nt20 = 0;
	var sps = 0;
	if (c.nativeclans > 0) {
	  if (c.nativetype == 2) { // bovinoid
	    spn = Math.floor(c.nativeclans / 100);
	    sps = c.clans - spn;
	    sp += sps > 0 ? spn : c.clans;
	  }

	  nt = hitText.prototype.nativeTaxAmount(c, c.nativetaxrate);
	  ns = hitText.prototype.nativesupportedtax(c);
	  cs = ns - nt;
	  nt = Math.min( nt , ns);

	  nt20 = hitText.prototype.nativeTaxAmount(c, 20);
	  ns20 = hitText.prototype.nativesupportedtax(c);
	  cs20 = ns20 - nt20;
	  nt20 = Math.min( nt20 , ns20);
	}

	ct = Math.round(c.clans * c.colonisttaxrate / 1000);

	mn = hitText.prototype.miningRate(c, c.groundneutronium, c.densityneutronium);
	md = hitText.prototype.miningRate(c, c.groundduranium, c.densityduranium);
	mm = hitText.prototype.miningRate(c, c.groundmolybdenum, c.densitymolybdenum);
	mt = hitText.prototype.miningRate(c, c.groundtritanium, c.densitytritanium);

	q += "</table><table class='CleanTable'>";

	if (c.groundneutronium > 0) {
	  q += "<tr><td>neu:</td><td align='right'>" + c.neutronium + "/&nbsp;</td><td align='right'>" + c.groundneutronium
	      + "+&nbsp;</td><td align='right'>" + mn + "</td>";
	  q += "<td>&nbsp;sup:</td><td align='right'>" + c.supplies + "+&nbsp;</td><td align='right'>" + sp
	  if (sps < 0)
	    q += "-&nbsp;</td><td  class='WarnText' align='right'>" + (-sps);
	  +"</td></tr>";

	  q += "<tr><td>dur:</td><td align='right'>" + c.duranium + "/&nbsp;</td><td align='right'>" + c.groundduranium
	      + "+&nbsp;</td><td align='right'>" + md + "</td>";
	  q += "<td>&nbsp;mc:</td><td align='right'>" + c.megacredits + "+&nbsp;</td><td align='right'>" + (nt + ct);
	  if (cs < 0)
	    q += "-&nbsp;</td><td  class='WarnText' align='right'>" + (-cs);

	  q += "</td></tr>";

	  q += "<tr><td>tri:</td><td align='right'>" + c.tritanium + "/&nbsp;</td><td align='right'>" + c.groundtritanium
	      + "+&nbsp;</td><td align='right'>" + mt + "</td>";

	  if (c.nativeclans > 0) {
	    q += "<td>&nbsp;20%:</td><td>&nbsp;</td><td align='right'>" + nt20;
	    if (cs20 < 0)
	      q += "-&nbsp;</td><td  class='WarnText' align='right'>" + (-cs20);
	  }
	  q += "</td></tr>";

	  q += "<tr><td>mol:</td><td align='right'>" + c.molybdenum + "/&nbsp;</td><td align='right'>" + c.groundmolybdenum
	      + "+&nbsp;</td><td align='right'>" + mm + "</td>";

	  var n = vgap.getStarbase(c.id);
	  if (n != null && vgap.accountsettings.hoverstarbasestatus
	      && (c.ownerid == vgap.player.id || vgap.fullallied(c.ownerid))) {

	    q += "<td>&nbsp;fgtr:</td><td>" + n.fighters + "</td>";

	    if (n.starbasetype != 2) {
	      q += "</tr><tr><td colspan='3'>H-" + n.hulltechlevel + " E-" + n.enginetechlevel + " B-" + n.beamtechlevel
		  + " T-" + n.torptechlevel + "</td>";
	      if (n.isbuilding) {
		q += "<td colspan='4'>Bld:&nbsp;" + vgap.getHull(n.buildhullid).name + "</td>"
	      }
	    }
	  }
	  q += "</tr>";
	}
	if (c.ownerid != vgap.player.id && c.ownerid != 0) {
	  var k = vgap.getPlayer(c.ownerid);
	  var l = vgap.getRace(k.raceid);
	  q += "<tr><td colspan='4'>" + l.name + " (" + k.username + ")</td></tr>"
	}
	 q += this.hitText(c, c.isPlanet).replace("&nbsp", "")
      }
      q += "</table>";

    } else {
      if (c.id < 0) {
	c = vgap.getShip(-c.id)
      }

      var m = c;
      var e = vgap.getHull(m.hullid);
      var k = vgap.getPlayer(m.ownerid);

      var d = "<span>" + m.id + ": " + e.name + "</span>";

      if (m.ownerid == vgap.player.id || vgap.fullallied(m.ownerid)) {

	d += "<table class='CleanTable'>";

	d += "<tr><td>neu:</td><td>&nbsp;" + gsv(m.neutronium) + "/" + e.fueltank + " </td>";
	d += "<td>&nbsp;fc:&nbsp;&nbsp;" + m.friendlycode + "</td></tr>";


	cl = "";
	if (m.clans != 0)
	  cl = "<td>clns:</td><td>&nbsp;" + gsv(m.clans) + "</td>";
        cs = "<td>sup:</td><td>&nbsp;" + gsv(m.supplies) + "</td>";
	mc = "<td>mc:</td><td>&nbsp;" + gsv(m.megacredits) + "</td>";
      
	if (m.duranium != 0 || m.tritanium != 0 || m.molybdenum != 0) {
	  d += "<tr><td>dur:</td><td>&nbsp;" + gsv(m.duranium) + "</td>"+ cs + "</tr>";
	  d += "<tr><td>tri:</td><td>&nbsp;" + gsv(m.tritanium) + "</td>"+ mc + "</tr>";
	  d += "<tr><td>mol:</td><td>&nbsp;" + gsv(m.molybdenum) + "</td>"+ cl + "</tr>";
	
	} else {

	  if (m.supplies != 0 || m.megacredits != 0)
	    d += "<tr>" + cs + mc + "</tr>";
	  
	  if (m.clans != 0 && cl != "")
	    d += "<tr>" + cl + "</tr>";
	}

	en = "";
	if (m.enemy > 0)
	  en = "<td>" + vgap.getRace(m.enemy).shortname + "</td>";
	
	if (m.bays > 0) {
	  d += "<tr><td>fghtr:</td><td>&nbsp" + gsv(m.ammo) + "</td>" + en + "</tr>";
	}
	  
	if (m.torps > 0) { 
	  d += "<tr><td>torp:</td><td>&nbsp"+ m.torpedoid+"/" + gsv(m.ammo) + "</td>" + en + "</tr>";
	}
	
	if (c.ownerid != vgap.player.id) {
	  if (m.iscloaked) {
	    d += "<tr><td colspan='2' class='GoodText'>Cloaked</td></tr>"
	  }
	} else {
	  d += "<tr>";
	  if (m.ownerid == vgap.player.id) {
	    d += "<td colspan='2'>"
		+ vgap.getShipMissionShortText(m)
		+ ((m.mission == 6 || m.mission == 7 || m.mission == 15 || m.mission == 20) && m.mission1target != 0 ? " "
		    + m.mission1target : "") + "&nbsp;</td>";
	  }
	  if (m.target != undefined) {
		  d += "<td>&nbsp;warp " + m.warp + "</td></tr><tr>";
	  if (m.target.name != undefined) 
	    d += "<td  colspan='2'>" + m.target.name + "</td>";
	  var ly = Math.round(Math.sqrt(Math.pow(m.y - m.targety, 2) + Math.pow(m.x - m.targetx, 2)) * 10) / 10;
	  d += "<td>&nbsp;(" + m.targetx + "," + m.targety + ")</td>";
	  d += "<td>&nbsp;" + ly + "ly</td>";
	  }
	  d += "</tr>";
	  if (m.iscloaked) {
	    d += "<td class='GoodText'>Cloaked</td>"
	  } else {
	    if (m.damage > 0) {
	      d += "<td>dam:</td><td class='BadText'>&nbsp;" + m.damage + "</td>"
	    } else {
	      d += "<td/></td>"
	    }
	  }
	  d += "</tr>"
	}
	if (c.ownerid != vgap.player.id && vgap.accountsettings.hoverallyplayer) {
	  d += "<tr><td colspan='4'>" + l.name + " (" + k.username + ")</td></tr>"
	}

	d += "</table>"
      } else {
	q += "<div>" + vgap.getRace(k.raceid).name + " (" + vgap.getPlayer(c.ownerid).username + ")</div>";

	d += "<table class='CleanTable'>";
	d += "<tr><td>Heading:</td><td>&nbsp;" + gsv(m.heading) + " at Warp: " + gsv(m.warp) + "</td></tr>";
	d += "<tr><td>Mass: </td><td>&nbsp;" + gsv(m.mass) + "</td></tr>";
	if (vgap.player.raceid == 7) {
	  for (var f = 0; f < vgap.messages.length; f++) {
	    var g = vgap.messages[f];
	    if (g.messagetype == 12 && g.target == m.id) {
	      d += "<tr><td class='BadText'>OUT OF FUEL</td></tr>";
	      break
	    }
	  }
	}
	if (m.iscloaked) {
	  d += "<tr><td colspan='2' class='GoodText'>Cloaked</td></tr>"
	}
	d += this.hitText(c, c.isPlanet).replace("&nbsp", "");
	d += "</table>"
      }
      q += d
    }
    q += "</div>";
    return q
  };

  var oldShowInfo = vgapMap.prototype.showInfo;
  vgapMap.prototype.showInfo = function(a, b) {
 // replace completely
// oldShowInfo.apply(this, arguments);

    var h = Math.round(vgap.map.mapX(a));
    var j = Math.round(vgap.map.mapY(b));
    var c = null;
    if (h > 0 && h < 4000 && j > 0 && j < 4000) {
      c = vgap.map.checkForHit(h, j)
    }
    vgap.map.over = c;
    vgap.map.x = h;
    vgap.map.y = j;
    var f = "<span class='coordDisplay titleSelectionBox'> x: " + h + " y: " + j + " </span>";
    if (c) {
      if (c.isPlanet) {
	f += vgap.map.hitTextBox(c)
      }
      var e = vgap.shipsAt(c.x, c.y);
      for (var d = 0; d < e.length; d++) {
	f += vgap.map.hitTextBox(e[d])
      }
    }

    var g = "";
    g += vgap.map.ionText(h, j);
    g += vgap.map.mineText(h, j);
    g += vgap.map.nebText(h, j);
    g += vgap.map.starText(h, j);
    g += vgap.map.debrisText(h, j);
    if (g != "undefined") {
      f += g;
    }
    if (vgap.map.zoom != 1) {
      f += "<div class='ItemSelectionBox minCorrection'>Zoom: " + Math.round(vgap.map.zoom * 100) + "% </div>"
    }
    vgap.map.loc.html("<div class='ItemSelection_border'>" + f + "</div>");
    vgap.map.container.css("cursor", "inherit");
    if (vgap.map.over) {
      if (vgap.map.activePlanet == null && vgap.map.activeShip == null) {
	vgap.map.container.css("cursor", "pointer")
      } else {
	vgap.map.container.css("cursor", "pointer")
      }
    }
  };

};

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
