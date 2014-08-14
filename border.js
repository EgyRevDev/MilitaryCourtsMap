/**
 * 
 */

var g_worldMap;
var g_geoJsonLayer;
var g_minZoomLevel = 2;
var g_maz_zoomLevel = 7;

function getDefaultMapOptions(){

	var initial_center = new L.latLng(0, 0);
	var intial_zoom_level = 3;

	/* Initial Map properties */
	var mapOptions = {
			zoom	: intial_zoom_level,
			center	: initial_center,
			minZoom	: g_minZoomLevel,
			maxZoom	: g_maz_zoomLevel
	};

	return mapOptions;
}

function getTileOptions(){

	var copyright = 'Imagery &copy; <a href="http://mapbox.com">Mapbox</a> , &copy; <a href="www.nomiltrials.com">للا للمحاكمات العسكرية للمدنيين</a>';

	var tileOptions= {
			attribution: copyright,
			minZoom: g_minZoomLevel,
			maxZoom: g_maz_zoomLevel
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

	tileLayer.addTo(g_worldMap);
	tileLayer.on('load', 
			function() {
		console.log("all visible tiles have been loaded");
	});
}

function addGeoJsonLayer(){

	/* Features in GeoJSON contain a geometry object and additional properties.
	 * Add vector data to map */
	g_geoJsonLayer = L.geoJson(worldborders, {
		style: getBaseStyle,
		onEachFeature: setEvents
	}).addTo(g_worldMap);
}

function onAddLegend() {

	var div = L.DomUtil.create('div', 'legend'),
	militaryCourtsStatus = ['PermittedByConst', 'PermittedByLaw', 'BannedByLaw', 'BannedByConst', "Unkwon", "Default"],
	legendTxt = ["Permitted by Constitution", "Permitted by Law", "Banned by Law", "Banned by Constitution", "Unkown State" , "Non-UN Countries"],
	labels = [],
	state;

	for (var i = 0; i < militaryCourtsStatus.length; i++) {
		state = militaryCourtsStatus[i];

		labels.push(
				'<i style="background:' + getBaseColor(state) + '"></i> ' +
				legendTxt[i] );
	}

	div.innerHTML = labels.join('<br><br>');
	return div;
}

function addLegendControl(){
	
	var legend = L.control({position: 'bottomleft'});

	legend.onAdd = onAddLegend;

	legend.addTo(g_worldMap);
}

function addSearchControl(){

	var options = {
			position: 'topleft',
			
			/* Function to display a feature returned by the search, parameters are the feature and an HTML container */
			showResultFct: resultSearchCallback
	};

	var searchCtrl = L.control.fuseSearch(options);
	searchCtrl.addTo(g_worldMap);

	searchCtrl.indexFeatures(worldborders.features, ['name']);
}

/* Handle the result search at runtime.*/
function resultSearchCallback(feature, container) {
    
	props = feature.properties;

	/* For each country that matches search criterion, display country name as well its status of military courts to civilians. */
    var name = L.DomUtil.create('b', null, container);
    name.innerHTML = props.name;
    container.appendChild(L.DomUtil.create('br', null, container));
    container.appendChild(document.createTextNode('Staus of Military Courts to Civilians: '+props.milstatus));
    
    /* Make each result item as clickable object, so map can be panned and zoomed according to the clicked country in the result list.*/
    L.DomUtil.addClass(container, 'clickable');
    container.onclick = function() {
        
        if (window.matchMedia("(max-width:480px)").matches) {
        	container.hidePanel();
        	g_worldMap.fitBounds(feature.layerPointer.getBounds());
        } else {
        	g_worldMap.fitBounds(feature.layerPointer.getBounds());
        }
    };
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
	g_geoJsonLayer.resetStyle(e.target);
}

/* Zoom to country upon being clicked on any part of its borders. */
function zoomToFeature(e) {
	g_worldMap.fitBounds(e.target.getBounds());
}

/* Tell Leaflet what functions to call when mousing over and out of a country */
function setEvents(feature, layer) {

	/*Never ever name feature.layer = layer otherwise leaflet-fussearch will through
	 * Uncaught TypeError: undefined is not a function */
	feature.layerPointer = layer;

	layer.on({
		mouseover	: highlightFeature,
		mouseout	: resetHighlight,
		click		: zoomToFeature	
	});

}


function initialize() {

	var mapOptions = getDefaultMapOptions();

	/* Create a JavaScript "map" object, passing it the div element named "map-canvas" and the map properties. */
	g_worldMap = new L.map("map-canvas",mapOptions);

	addTileLayer();

	addGeoJsonLayer();

	addLegendControl();

	addSearchControl();

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
	g_worldMap.setView(mapOptions.center, mapOptions.zoom);

	/* Reset text field if it holds any name of searched country. */
	/*document.getElementById("txtSearchStringID").value = "";*/
	document.getElementById("countriesDropDownListID").value = "--Select Country--";
}

function isEmpty(a_string){
	/* if given string is null, return true*/
	return (0 == a_string.length);
}

initialize();