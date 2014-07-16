/**
 * 
 */

var world_map;


function getDefaultMapOptions(){

	var initial_center = new MQA.LatLng(0, 0);
	var intial_zoom_level = 2;

	/* Initial Map properties */
	var mapOptions = {
			
			elt: document.getElementById('map-canvas'),     // ID of map element on page
            zoom: intial_zoom_level,                        // initial zoom level of the map
            latLng: initial_center,    						// center of map in latitude/longitude
            mtype: 'map',                                    // map type (map, sat, hyb); defaults to 'map'
            zoomOnDoubleClick: true                          // enable map to be zoomed in when double-clicking on map 
	};

	return mapOptions;
}

function getDefaultQuery(){


	return null;
}
function initialize() {

	var mapOptions = getDefaultMapOptions();

	/* create a JavaScript "map" object, passing it the div element named "map-canvas" and the map properties. */
	world_map = new MQA.TileMap(mapOptions);

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
	world_map.setCenter(mapOptions.latLng, mapOptions.zoom);

	/* Reset text field if it holds any name of searched country. */
	/*document.getElementById("txtSearchStringID").value = "";*/
	document.getElementById("countriesDropDownListID").value = "--Select Country--";
}

function isEmpty(a_string){
	/* if given string is null, return true*/
	return (0 == a_string.length);
}

MQA.EventUtil.observe(window, 'load', initialize);