/**
 * 
 */

var world_map;


function getDefaultMapOptions(){

	var initial_center = new L.latLng(0, 0);
	var intial_zoom_level = 3;

	/* Initial Map properties */
	var mapOptions = {
            zoom: intial_zoom_level,
            center: initial_center
	};

	return mapOptions;
}

function getTileOptions(){

	var copyright = 'Imagery &copy; <a href="http://mapbox.com">Mapbox</a> , &copy; <a href="www.nomiltrials.com">للا للمحاكمات العسكرية للمدنيين</a>';
	
	var tileOptions= {
	    attribution: copyright,
	    maxZoom: 18
	};
	
	return tileOptions;
}

function addTile(){
	var map_id='wshowair.j04mg6fm';
	var tile_url = 'https://{s}.tiles.mapbox.com/v3/' + 
					map_id +
					'/{z}/{x}/{y}.png';

	var tileOptions = getTileOptions();
	L.tileLayer(tile_url, tileOptions).addTo(world_map);
}

function getDefaultQuery(){


	return null;
}
function initialize() {

	var mapOptions = getDefaultMapOptions();

	world_map = L.mapbox.map('map-canvas', 'wshowair.j04mg6fm');
	
	/*omnivore will AJAX-request this file behind the scenes and parse it:
	 * Note that there are considerations:
	 * - The file must either be on the same domain as the page that requests it, OR ,
	 * both the server it is requested from and the user's browser must support CORS.*/
	var runLayer = omnivore.kml('https://dl.dropboxusercontent.com/u/78944658/EgyptmergedFinalOptimizedSimplified.kml')
	    .on('ready', function() {
	    	world_map.fitBounds(runLayer.getBounds());
	    	
	    	/*After the 'ready' event fires, the GeoJSON contents are accessible and you can iterate through layers to bind custom popups.*/
	    	        runLayer.eachLayer(function(layer) {
	    	            /*See the `.bindPopup` documentation for full details. 
	    	             * This dataset has a property called `name`: your dataset might not,
	    	             * so inspect it and customize to taste.*/
	    	            layer.bindPopup(layer.feature.properties.description);
	    	        });
	    })
	    .addTo(world_map);
	
	/* I have opened related issue on leaflet-omnivore:
	 * https://github.com/mapbox/leaflet-omnivore/issues/40
	 */
		world_map.on("popupopen", function(evt){
			console.log("popup is opened");
			currentPopup = evt.popup;
			});
	
		world_map.on("popupclose", function(evt){
			console.log("popup is closed");
			currentPopup = null;
			});
	
	/* In case Enter key is pressed, zoom to the selected country (if any)*/
	/*google.maps.event.addDomListener(window, 'keypress',function(e) {
		if (e.keyCode == 13) {
			zoomToCountry();
		}
	});*/
}

/* This function is called once user clicks on Search button. */
function zoomToCountry() {

	console.log("Inside zoomToCountry function");
	var whereClause;
	var countriesDropDownObject = document.getElementById('countriesDropDownListID');
	var selectedCountryName =  countriesDropDownObject.options[countriesDropDownObject.selectedIndex].text;
	console.log("Before replacement: selectedCountryName var is: %s", selectedCountryName);

	selectedCountryName = selectedCountryName.replace(/'/g, "\\'");
	console.log("After replacement: selectedCountryName var is: %s", selectedCountryName);

	/* Handle corner case if user did not enter any country name and hits search button, by simply reseting the map.
	 * Otherwise, geocode required country name. */
	if(selectedCountryName == '--Select Country--'){
		resetMap();
	}else{

		whereClause = "Name = \'"+ selectedCountryName+"\'";
		console.log("whereClause var is: %s", whereClause);
	}
}

/* This function is called once user clicks on reset button. */
function resetMap(){
	var mapOptions = getDefaultMapOptions();

	/* Reset map to initial center , zoom level and colorize all world of countries again.*/
	world_map.setView(mapOptions.center, mapOptions.zoom);

	/* Reset text field if it holds any name of searched country. */
	/*document.getElementById("txtSearchStringID").value = "";*/
	document.getElementById("countriesDropDownListID").value = "--Select Country--";
}

function isEmpty(a_string){
	/* if given string is null, return true*/
	return (0 == a_string.length);
}

initialize();