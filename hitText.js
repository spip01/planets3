// ==UserScript==
// @name          hoverTextbox
// @description   rewrites the information you get when you hover over a planet
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// @homepage      https://greasyfork.org/en/users/32642-stephen-piper
// ==/UserScript==

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

				var nt = (c.nativeclans / 100) * (ntr / 10)
						* (c.nativegovernment / 5);

				nt = c.nativetype == 5 ? 0 : nt; 		// amorphous == 5
				nt = c.nativetype == 6 ? 2 * nt : nt; 	// insect == 6
				nt = c.race == 1 ? 2 * nt : nt; 		// feds == 1

				nt = Math.round(nt);
			}
			return nt;
		},
	};

	var oldHitTextBox = vgapMap.prototype.hitTextBox;
	vgapMap.prototype.hitTextBox = function(c) {

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
				q += "<td align='right'>&nbsp;" + c.friendlycode
						+ "</td><td align='right'>&nbsp;" + c.temp + "</td>";
			}
			q += "</tr>";

			if (c.nativeclans > 0) {
				q += "<tr><td colspan='2'>" + c.nativeracename + "</td>";
				q += "<td align='right' colspan='2'>&nbsp;" + c.nativeclans
						+ "</td>"
				if (c.ownerid == vgap.player.id) {
					q += "<td align='right'>&nbsp;" + c.nativehappypoints
							+ "%</td>";
					q += "<td align='right'>&nbsp;" + c.nativetaxrate
							+ "%</td>";
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
				if (c.nativeclans > 0) {
					sp += Math.floor(c.nativetype == 2 ? c.clans / 10 : 0); // bovinoid
					
					
					nt = hitText.prototype.nativeTaxAmount(c, c.nativetaxrate);
					ns = nt;
					ns /= c.race == 1 ? 2 : 1; // feds == 1
					ns /= c.nativetype == 6 ? 2 : 1; // insect == 6
					cs = Math.floor(nt - ns);
//					cs = nc
//					var ns = c.clans * (c.race == 1 ? 2 : 1); // feds == 1
//					ns = c.nativetype == 6 ? 2 * ns : ns; // insect == 6
//					cs = nt - ns;
//					nt = nt > ns ? ns : nt;

					nt20 = hitText.prototype.nativeTaxAmount(c, 20);
					ns20 = nt20;
					ns20 /= c.race == 1 ? 2 : 1; // feds == 1
					ns20 /= c.nativetype == 6 ? 2 : 1; // insect == 6
					cs20 = Math.floor(nt20 - ns20);
//					nt20 = nt20 > ns ? ns : nt20;
				}
				
				ct = Math.round(c.clans * c.colonisttaxrate / 1000);

				mn = vgap.miningRate(c, c.densityneutronium);
				mn = mn > c.groundneutronium ? c.groundneutronium : Math
						.round(mn);

				md = vgap.miningRate(c, c.densityduranium);
				md = md > c.groundduranium ? c.groundduranium : Math.round(md);

				mt = vgap.miningRate(c, c.densitytritanium);
				mt = mt > c.groundtritanium ? c.groundtritanium : Math
						.round(mt);

				mm = vgap.miningRate(c, c.densitymolybdenum);
				mm = mm > c.groundmolybdenum ? c.groundmolybdenum : Math
						.round(mm);

				q += "</table><table class='CleanTable'>";

				if (c.groundneutronium > 0) {
					q += "<tr><td>neu:</td><td align='right'>" + c.neutronium
							+ "/&nbsp;</td><td align='right'>"
							+ c.groundneutronium
							+ "+&nbsp;</td><td align='right'>" + mn + "</td>";
					q += "<td>&nbsp;sup:</td><td align='right'>" + c.supplies
							+ "+&nbsp;</td><td align='right'>" + sp
							+ "</td></tr>";

					q += "<tr><td>dur:</td><td align='right'>" + c.duranium
							+ "/&nbsp;</td><td align='right'>"
							+ c.groundduranium
							+ "+&nbsp;</td><td align='right'>" + md + "</td>";
					q += "<td>&nbsp;mc:</td><td align='right'>" + c.megacredits
							+ "+&nbsp;</td><td align='right'>" + (nt + ct);
							if (cs > 0)
								q += "-&nbsp;</td><td  class='WarnText' align='right'>"
									+ cs;

							q+= "</td></tr>";

					q += "<tr><td>tri:</td><td align='right'>" + c.tritanium
							+ "/&nbsp;</td><td align='right'>"
							+ c.groundtritanium
							+ "+&nbsp;</td><td align='right'>" + mt + "</td>";

					if (c.nativeclans > 0) {
						q += "<td>&nbsp;20%:</td><td align='right'>" + nt20;
						if (cs20 > 0)
						q += "-&nbsp;</td><td  class='WarnText' align='right'>" + cs20
								;
					}
					q += "</td></tr>";

					q += "<tr><td>mol:</td><td align='right'>" + c.molybdenum
							+ "/&nbsp;</td><td align='right'>"
							+ c.groundmolybdenum
							+ "+&nbsp;</td><td align='right'>" + mm + "</td>";

					var n = vgap.getStarbase(c.id);
					if (n != null
							&& vgap.accountsettings.hoverstarbasestatus
							&& (c.ownerid == vgap.player.id || vgap
									.fullallied(c.ownerid))) {

						q += "<td>&nbsp;fgtr:</td><td>" + n.fighters + "</td>";

						if (n.starbasetype != 2) {
							q += "</tr><tr><td colspan='3'>H-"
									+ n.hulltechlevel + " E-"
									+ n.enginetechlevel + " B-"
									+ n.beamtechlevel + " T-" + n.torptechlevel
									+ "</td>";
							if (n.isbuilding) {
								q += "<td colspan='4'>Bld:&nbsp;"
										+ vgap.getHull(n.buildhullid).name
										+ "</td>"
							}
						}
					}
					q += "</tr>";

				}
				if (c.ownerid != vgap.player.id && c.ownerid != 0) {
					var k = vgap.getPlayer(c.ownerid);
					var l = vgap.getRace(k.raceid);
					q += "<tr><td colspan='4'>" + l.name + " (" + k.username
							+ ")</td></tr>"
				}
				// q += this.hitText(c, c.isPlanet).replace("&nbsp", "")
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
			// var o = m.ammo + m.duranium + m.tritanium + m.molybdenum +
			// m.supplies + m.clans;
			if (m.ownerid == vgap.player.id || vgap.fullallied(m.ownerid)) {
				// if ((m.ownerid == vgap.player.id &&
				// vgap.accountsettings.hoverownshiphull) ||
				// (vgap.fullallied(m.ownerid) &&
				// vgap.accountsettings.hoverallyshiphull)) {
				// d = "<div>" + m.id + ": " + e.name + "</div>"
				// }
				d += "<table class='CleanTable'>";
				if (!vgap.accountsettings.hovershortform) {
					if (m.duranium == 0 && m.tritanium == 0
							&& m.molybdenum == 0) {
						d += "<tr><td>neu:</td><td>&nbsp;" + gsv(m.neutronium)
								+ "/" + e.fueltank + " </td>";
						d += "    <td>&nbsp;clns:</td><td>&nbsp;&nbsp;"
								+ gsv(m.clans) + "</td></tr>";
						d += "    <td>sup:</td><td>&nbsp;" + gsv(m.supplies)
								+ "</td>";
						d += "    <td>&nbsp;mc:</td><td>&nbsp;&nbsp;"
								+ gsv(m.megacredits) + "</td></tr>";
					} else {
						d += "<tr><td>neu:</td><td>&nbsp;" + gsv(m.neutronium)
								+ "/" + e.fueltank + " </td>";
						d += "    <td>&nbsp;clns:</td><td>&nbsp;&nbsp;"
								+ gsv(m.clans) + "</td></tr>";
						d += "<tr><td>dur:</td><td>&nbsp;" + gsv(m.duranium)
								+ "</td>";
						d += "    <td>&nbsp;sup:</td><td>&nbsp;&nbsp;"
								+ gsv(m.supplies) + "</td></tr>";
						d += "<tr><td>tri:</td><td>&nbsp;" + gsv(m.tritanium)
								+ "</td>";
						d += "    <td>&nbsp;mc:</td><td>&nbsp;&nbsp;"
								+ gsv(m.megacredits) + "</td></tr>";
						d += "<tr><td>mol:</td><td>&nbsp;" + gsv(m.molybdenum)
								+ "</td>";
					}
					if (m.torps > 0 || m.bays > 0) {
						d += "</tr><td>fc:</td><td>" + m.friendlycode + "</td>";
						var a = "fghtr";
						if (m.torps > 0) {
							a = "torp"
						}
						d += "<td>" + a + ":</td><td>&nbsp;&nbsp;"
								+ gsv(m.ammo) + "</td>";
					} else {
						d += "<td>&nbsp;&nbsp;fc:</td><td>&nbsp;&nbsp;"
								+ m.friendlycode + "</td>";
					}
					d += "</tr>";

					if (vgap.accountsettings.hovershipstatus) {
						if (c.ownerid != vgap.player.id) {
							if (m.iscloaked) {
								d += "<tr><td colspan='2' class='GoodText'>Cloaked</td></tr>"
							}
						} else {
							d += "<tr>";
							// if (m.ownerid == vgap.player.id) {
							// d += "<td colspan='2'>" +
							// vgap.getShipMissionShortText(m) + ((m.mission ==
							// 6 || m.mission == 7 || m.mission == 15 ||
							// m.mission == 20) && m.mission1target != 0 ? " " +
							// m.mission1target : "") + "</td>";
							// }
							var ly = Math.round(Math.sqrt(Math.pow(m.y
									- m.targety, 2)
									+ Math.pow(m.x - m.targetx, 2)) * 10) / 10;
							d += "<td>(" + m.targetx + ", " + m.targety
									+ ")</td><td>&nbsp;" + ly + "&nbsp;ly</td>";
							d += "<td>&nbsp;warp " + m.warp + "</td></tr>";
							if (m.iscloaked) {
								d += "<td class='GoodText'>Cloaked</td>"
							} else {
								if (m.damage > 0) {
									d += "<td>dam:</td><td class='BadText'>&nbsp;"
											+ m.damage + "</td>"
								} else {
									d += "<td/></td>"
								}
							}
							d += "</tr>"
						}
					} else {
						if (m.iscloaked) {
							d += "<tr><td colspan='2' class='GoodText'>Cloaked</td></tr>"
						}
					}
					if (c.ownerid != vgap.player.id
							&& vgap.accountsettings.hoverallyplayer) {
						d += "<tr><td colspan='4'>" + l.name + " ("
								+ k.username + ")</td></tr>"
					}
					d += this.hitText(c, c.isPlanet).replace("&nbsp", "")
				} else {
					d += "<tr><td>Neu:</td><td>&nbsp;" + gsv(m.neutronium)
							+ " / " + e.fueltank
							+ " </td><td>&nbsp;&nbsp;&nbsp;Dur:</td><td>&nbsp;"
							+ gsv(m.duranium)
							+ "</td><td>&nbsp;&nbsp;&nbsp;Tri:</td><td>&nbsp;"
							+ gsv(m.tritanium)
							+ "</td><td>&nbsp;&nbsp;&nbsp;Mol:</td><td>&nbsp;"
							+ gsv(m.molybdenum) + "</td></tr>";
					d += "<tr><td>MC:</td><td>&nbsp;" + gsv(m.megacredits)
							+ "</td><td>&nbsp;&nbsp;&nbsp;Cln:</td><td>&nbsp;"
							+ gsv(m.clans)
							+ "</td><td>&nbsp;&nbsp;&nbsp;Sup:</td><td>&nbsp;"
							+ gsv(m.supplies) + "</td>";
					if (m.torps > 0 || m.bays > 0) {
						var a = "Ftr";
						if (m.torps > 0) {
							a = "Tor"
						}
						d += "<td>&nbsp;&nbsp;&nbsp;" + a + ":</td><td>&nbsp;"
								+ gsv(m.ammo) + "</td>"
					}
					d += "</tr>";
					if (vgap.accountsettings.hovershipstatus) {
						if (c.ownerid != vgap.player.id) {
							if (m.iscloaked) {
								d += "<tr><td colspan='2' class='GoodText'>Cloaked</td></tr>"
							}
						} else {
							d += "<tr>";
							if (m.ownerid == vgap.player.id) {
								d += "<td colspan='2'>"
										+ vgap.getShipMissionShortText(m)
										+ ((m.mission == 6 || m.mission == 7
												|| m.mission == 15 || m.mission == 20)
												&& m.mission1target != 0 ? " "
												+ m.mission1target : "")
										+ "</td>"
							} else {
								d += "<td/><td/>"
							}
							if (m.iscloaked) {
								d += "<td colspan='2' class='GoodText'>&nbsp;&nbsp;&nbsp;Cloaked</td>"
							} else {
								if (m.damage > 0) {
									d += "<td>&nbsp;&nbsp;&nbsp;Dmg:</td><td class='BadText'>&nbsp;"
											+ m.damage + "</td>"
								} else {
									d += "<td/><td/>"
								}
							}
							d += "<td colspan='2'>&nbsp;&nbsp;&nbsp;Warp "
									+ m.warp + "</td>";
							if (m.ownerid == vgap.player.id) {
								d += "<td>&nbsp;&nbsp;&nbsp;FC:</td><td>&nbsp;"
										+ m.friendlycode + "</td>"
							}
							d += "</tr>"
						}
					} else {
						if (m.iscloaked) {
							d += "<tr><td colspan='2' class='GoodText'>Cloaked</td></tr>"
						}
					}
					if (c.ownerid != vgap.player.id
							&& vgap.accountsettings.hoverallyplayer) {
						d += "<tr><td colspan='8'>" + l.name + " ("
								+ k.username + ")</td></tr>"
					}
					d += this.hitText(c, c.isPlanet, 8).replace("&nbsp", "")
				}
				d += "</table>"
			} else {
				q += "<div>" + vgap.getRace(k.raceid).name + " (" + vgap.getPlayer(c.ownerid).username + ")</div>";
				
				d += "<table class='CleanTable'>";
				d += "<tr><td>Heading:</td><td>&nbsp;" + gsv(m.heading)
						+ " at Warp: " + gsv(m.warp) + "</td></tr>";
				d += "<tr><td>Mass: </td><td>&nbsp;" + gsv(m.mass)
						+ "</td></tr>";
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

	var oldShoeInfo = vgapMap.prototype.showInfo;
	vgapMap.prototype.showInfo = function(a, b) {

		var h = Math.round(vgap.map.mapX(a));
		var j = Math.round(vgap.map.mapY(b));
		var c = null;
		if (h > 0 && h < 4000 && j > 0 && j < 4000) {
			c = vgap.map.checkForHit(h, j)
		}
		vgap.map.over = c;
		vgap.map.x = h;
		vgap.map.y = j;
		var f = "<span class='coordDisplay titleSelectionBox'> x: " + h
				+ " y: " + j + " </span>";
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
			f += "<div class='ItemSelectionBox minCorrection'>Zoom: "
					+ Math.round(vgap.map.zoom * 100) + "% </div>"
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
