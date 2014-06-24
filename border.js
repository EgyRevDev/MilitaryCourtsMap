/**
 * 
 */
var map;
	function initialize() {
		/* Initial Map properties */
		var mapOptions = {
			center : new google.maps.LatLng(30.058056, 31.228889),
			zoom : 3,
			mapTypeId: google.maps.MapTypeId.ROADMAP  
		};

		/* create a JavaScript "map" object, passing it the div element named "map-canvas" and the map properties. */
		map = new google.maps.Map(document.getElementById("map-canvas"),
				mapOptions);
		
		/* Note that KMZ file has been obtained from http://www.gadm.org/download*/
		var kmzLayer = new google.maps.KmlLayer('https://dl.dropboxusercontent.com/u/78944658/EGY_adm0.kmz');
		
	    kmzLayer.setMap(map);
	}

	function loadScript() {
		
		var script = document.createElement('script');
		script.type = 'text/javascript';
		
		/* instruct the Maps JavaScript API bootstrap to delay execution of your application code until 
		the Maps JavaScript API code is fully loaded. You may do so using the callback parameter, which 
		takes as an argument the function to execute upon completing loading the API. */
		script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp'
				+ '&callback=initialize'
				+ '&language=ar';
		document.body.appendChild(script);
	}

	/*  load the Maps API JavaScript code after your page has finished loading */
	window.onload = loadScript;