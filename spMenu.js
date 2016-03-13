// ==UserScript==
// @name          spiperMenu
// @description   planets.nu menu for plugins this handles all of the menu controls.
//			      The only thing child scripts need to call is 
//				  vgapMap.prototype.addTool(text, class, function)
// 				  if you want to hook to the global clear function use "_massClear" 
// 				  as your class name when you call addTool
//
// @example		  vgapMap.prototype.addTool(menuText, class, function);
// @example		  vgapMap.prototype.addTool(ignored, "_massClear", clearFunction);
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version       3.0.0
// @homepage      https://greasyfork.org/en/users/32642-stephen-piper
// ==/UserScript==

function wrapper() {
	var showReady = false;
	var showMenu = false;
	var clearList=[];

	function spTools() {}
	spTools.prototype = {

		// this handles all of the menu controls. The only thing child scripts
		// need to call is vgapMap.prototype.addTool(text, class, function)
			
		loadControls : function() {
			// debugger;
			var a = "<div id='spControls'><div id='spToolsMenu'>sp Tools</div><ul id='spTools'></ul></div>";
			$(a).appendTo("#PlanetsContainer");

			var s = {
				"top" : "0px",
				"display" : "block",
				"position" : "absolute",
				"right" : "260px",
				"color" : "rgb(255,255,255)",
				"z-index" : "0",
				"width" : "90px",
				"background-color" : "rgb(51,51,51)",
				"border-bottom-left-radius" : "10px",
				"border-bottom-right-radius" : "10px",
				"text-align" : "center",
			};
			$("#spControls").css(s);

			s = {
				"display" : "block",
				"width" : "80px",
				"text-align" : "center",
				"font-size" : "11px",
				"list-style" : "none",
				"line-height" : "20px",
				"padding" : "0",
				"margin" : "5px",
				"cursor" : "default",
			};
			$("#spTools").css(s);

			s = {
				"display" : "block",
				"padding" : "0",
				"line-height" : " 38px",
				"width" : "70px",
				"background-color" : "rgb(51,51,51)",
				"cursor" : "default",
			};
			$("#spToolsMenu").css(s);

			s = {
				"border-bottom-style" : "groove",
				"line-height" : "24px",
			};
			$("#spTools li").css(s);

			this.clearControls();

			$("#spControls").mouseenter(function() {
				$("#spControls").css("cursor:pointer");
			});

			$("#spControls").mouseleave(function() {
				$("#spControls").css("cursor:default");
			});

			// text, class, function
			vgapMap.prototype = {
				spMenuItem : function(c, a, b) {
					spTools.prototype.addTool(c, a, b);
				}
			};

			this.addTool("Clear All", "clearAll", function() {
				for (i = 0; i < clearList.length; ++i)
					clearList[i]();
				spTools.prototype.clearData();
			});
		},

		addTool : function(c, a, b) {
			if (a == "_massClear") {
				clearList.push(b);
			} else {

				var html = $("<li class='" + a + "'>" + c + "</li>").tclick(b)
						.appendTo("#spTools");

				html.mouseenter(function() {
					var border = {
						"border-style" : "inset",
					}
					html.css(border);
				});

				html.mouseleave(function() {
					var border = {
						"border-style" : "none",
					}
					html.css(border);
				});
			}
		},

		// show hide menu when top is clicked
		toggleMenu : function() {
			if (showMenu) {
				showMenu = false;
				$("#spTools").hide();
				$("#spToolsMenu").mousedown(function() {
					$("#spTools").show();
				});
			} else {
				showMenu = true;
				$("#spTools").show();
				$("#spToolsMenu").mousedown(function() {
					$("#spTools").hide();
				});
			}
		},

		clearControls : function() {
			showMenu = false;
			$("#spTools").hide();
			$("#spToolsMenu").mousedown(function() {
				$("#spTools").show();
			});

			this.clearData();
		},

		clearData : function() {
			showReady = false;
			showMenu = false;
		},

	};

	// easy to hook in child setup here
	var oldLoadControls = vgapMap.prototype.loadControls;
	vgapMap.prototype.loadControls = function() {
		oldLoadControls.apply(this, arguments);

		spTools.prototype.loadControls();
	};

	var oldShowMap = vgaPlanets.prototype.showMap;
	vgaPlanets.prototype.showMap = function() {
		oldShowMap.apply(this, arguments);
		$("#MapTip").remove();

		$("#spControls").show();
		showMenu = false;
		$("#spToolsMenu").mousedown(function() {
			spTools.prototype.toggleMenu();
		});
	};
};

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
