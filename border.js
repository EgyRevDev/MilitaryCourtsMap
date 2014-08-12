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
			center: initial_center,
			minZoom: 2,
			maxZoom: 7
	};

	return mapOptions;
}

function getTileOptions(){

	var copyright = 'Imagery &copy; <a href="http://mapbox.com">Mapbox</a> , &copy; <a href="www.nomiltrials.com">للا للمحاكمات العسكرية للمدنيين</a>';

	var tileOptions= {
			attribution: copyright,
			minZoom: 2,
			maxZoom: 7
	};

	return tileOptions;
}

function addTileLayer(){
	var map_id='wshowair.xu7bvs4i';
	var tile_url = 'https://{s}.tiles.mapbox.com/v3/' + 
	map_id +
	'/{z}/{x}/{y}.png';

	var tileOptions = getTileOptions();
	var tileLayer = L.tileLayer(tile_url, tileOptions);

	tileLayer.addTo(world_map);
	tileLayer.on('load', 
			function() {
		console.log("all visible tiles have been loaded");
	});
}

function addGeoJsonLayer(){
	
	/* Features in GeoJSON contain a geometry object and additional properties.
	 * Add vector data to map */
	geojsonLayer = L.geoJson(worldborders, {
		style: getBaseStyle,
		onEachFeature: setEvents
	}).addTo(world_map);
}





function getBaseColor(milstatus){
	var geoJsonGeometryColor;

	/*console.log("switch on feature.properties.milstatus");*/
	switch (milstatus) {

	case 'PermittedByConst':
		/*console.log("Case PermittedByConst");*/
		geoJsonGeometryColor = "#ed1c24"; /*red*/
		break;
	case 'PermittedByLaw':
		/*console.log("Case PermittedByLaw");*/
		geoJsonGeometryColor = "#d8d82b"; /*yellow: bdc40a */
		break;
	case 'BannedByLaw':
		/*console.log("Case BannedByLaw");*/
		geoJsonGeometryColor = "#d88c00"; /* orange c68802 or c96d00 or fb8800*/
		break;
	case 'BannedByConst':
		/*console.log("Case BannedByConst");*/
		geoJsonGeometryColor = "#269326"; /* green: 136003 or 519943*/
		break;
	case 'Unkwon':
		/*console.log("Case Unkwon");*/
		geoJsonGeometryColor = "#808080";
		break;
	default:
		/*console.log("Case default");*/
		geoJsonGeometryColor = "#0000A0";
	}
	
	return geoJsonGeometryColor;
}

/* Set base style of GeoJson vector data as a function of current Military Courts to Civilians state.
 * Note that Features in GeoJSON contain a geometry object and additional properties.*/
function getBaseStyle(feature) {

	return {
		color: "#000000", 	/* Stroke color */
		weight: 0.2, 		/* Stroke width in pixels. */
		opacity: 1, 		/* Stroke opacity.*/
		fillOpacity: 0.6,   /* Fill color of geometry. */
		fillColor: getBaseColor(feature.properties.milstatus) /* Fill opacity of geometry. */
	};
}

function getHighlightColor(milstatus){
	var geoJsonGeometryColor;

	/*console.log("switch on feature.properties.milstatus");*/
	switch (milstatus) {

	case 'PermittedByConst':
		/*console.log("Case PermittedByConst");*/
		geoJsonGeometryColor = "#ff0000"; /*red*/
		break;
	case 'PermittedByLaw':
		/*console.log("Case PermittedByLaw");*/
		geoJsonGeometryColor = "#FFFF00"; /*yellow */
		break;
	case 'BannedByLaw':
		/*console.log("Case BannedByLaw");*/
		geoJsonGeometryColor = "#ffa500"; /* orange */
		break;
	case 'BannedByConst':
		/*console.log("Case BannedByConst");*/
		geoJsonGeometryColor = "#00FF00"; /* green */
		break;
	case 'Unkwon':
		/*console.log("Case Unkwon");*/
		geoJsonGeometryColor = "#C0C0C0";
		break;
	default:
		/*console.log("Case default");*/
		geoJsonGeometryColor = "#0000FF";
	}
	
	return geoJsonGeometryColor;
}

/* Set base hover of GeoJson vector data as a function of current Military Courts to Civilians state.
 * Note that Features in GeoJSON contain a geometry object and additional properties.*/
function highlightFeature(e) {

	/*var countryName = e.target.feature.properties.name;
	console.log(countryName);*/
	var layer = e.target;
	layer.setStyle({
		color: '#FFFFFF',
		weight: 1,
		opacity: 1,
		/*dashArray: '3',*/
		fillOpacity: 0.7,
		fillColor: getHighlightColor(e.target.feature.properties.milstatus)
	});
	
	if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

/* A function to reset the colors when a country is not longer 'hovered' */
function resetHighlight(e) {
	geojsonLayer.resetStyle(e.target);
}



/* Tell Leaflet what functions to call when mousing over and out of a country */
function setEvents(feature, layer) {
	layer.on({
		mouseover	: highlightFeature,
		mouseout	: resetHighlight
	});
}


function initialize() {

	var mapOptions = getDefaultMapOptions();

	/* create a JavaScript "map" object, passing it the div element named "map-canvas" and the map properties. */
	world_map = new L.map("map-canvas",mapOptions)
	/*.addControl(L.mapbox.shareControl())*/;

	addTileLayer();

	addGeoJsonLayer();
	
	
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