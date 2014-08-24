/**
 * 
 */

/* Declare map and tile references. */
var g_worldMap;
var g_tileLayer;

/* Declare Layer Groups of different military courts to civilians. */
var g_PermittedByConstLayerGroup;
var g_BannedByConstLayerGroup;
var g_PermittedByLawLayerGroup;
var g_BannedByLawLayerGroup;
var g_UnkwonLayerGroup;

/* Declare GeoJson layers of different countries according to their military courts to civilians. */
var g_PermittedByConstStatesGeoJsonLayer;
var g_BannedByConstStatesGeoJsonLayer;
var g_PermittedByLawStatesGeoJsonLayer;
var g_BannedByLawStatesGeoJsonLayer;
var g_UnkwonStatesGeoJsonLayer;

/* Define common values for tile options as well as map options. */
var g_minZoomLevel = 2;
var g_maz_zoomLevel = 7;

/* Declare last country geojson layer that has been loaded after performing search*/
var g_lastCountryGeoJsonLayer;

function getDefaultMapOptions(){

	var initial_center = new L.latLng(0, 0);
	var intial_zoom_level = 3;

	/* Initial Map properties */
	var mapOptions = {
			zoom	: intial_zoom_level,
			center	: initial_center,
			minZoom	: g_minZoomLevel,
			maxZoom	: g_maz_zoomLevel,
			layers	: [g_tileLayer, 
			      	   g_PermittedByConstLayerGroup , 
			      	   g_BannedByConstLayerGroup , 
			      	   g_PermittedByLawLayerGroup , 
			      	   g_BannedByLawLayerGroup,
			      	   g_UnkwonLayerGroup]
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

function createTileLayer(){
	var map_id='wshowair.nk8uayvi';
	var tile_url = 'https://{s}.tiles.mapbox.com/v3/' + 
	map_id +
	'/{z}/{x}/{y}.png';

	var tileOptions = getTileOptions();
	g_tileLayer = L.tileLayer(tile_url, tileOptions);

	//tileLayer.addTo(g_worldMap);
	g_tileLayer.on('load', 
			function() {
		console.log("all visible tiles have been loaded");
	});
}

function addGeoJsonLayersToLayerGroups(){

	/* Features in GeoJSON contain a geometry object and additional properties. */
	
	/* Add geojson layer to the corresponding layer group. */
	g_PermittedByConstStatesGeoJsonLayer = L.geoJson(countries_pbc, {
		style: getBaseStyle("PermittedByConst"),
		onEachFeature: setEvents
	}).addTo(g_PermittedByConstLayerGroup);
	
	g_BannedByConstStatesGeoJsonLayer = L.geoJson(countries_bbc, {
		style: getBaseStyle("BannedByConst"),
		onEachFeature: setEvents
	}).addTo(g_BannedByConstLayerGroup);
	
	g_PermittedByLawStatesGeoJsonLayer = L.geoJson(countries_pbl, {
		style: getBaseStyle("PermittedByLaw"),
		onEachFeature: setEvents
	}).addTo(g_PermittedByLawLayerGroup);
	
	g_BannedByLawStatesGeoJsonLayer = L.geoJson(countries_bbl, {
		style: getBaseStyle("BannedByLaw"),
		onEachFeature: setEvents
	}).addTo(g_BannedByLawLayerGroup);
	
	g_UnkwonStatesGeoJsonLayer = L.geoJson(countries_unkw, {
		style: getBaseStyle("Unkwon"),
		onEachFeature: setEvents
	}).addTo(g_UnkwonLayerGroup);
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
			maxResultLength: 1,

			/* a decimal value indicating at which point the match algorithm gives up. A threshold of 0.0 requires a perfect match,
			 * a threshold of 1.0 would match anything, default 0.5*/
			threshold: 0, 

			/* Callback to be invoked after the search result is obtained. It is useful to update your HTML in this function. */
			searchResultCallback: resultSearchCallback
	};

	var searchCtrl = L.control.fuseSearch(options);
	searchCtrl.addTo(g_worldMap);

	var worldCountriesMergedFeatures = mergeGeoJsonFeatures();

	searchCtrl.indexFeatures(worldCountriesMergedFeatures, ['name']);
}

function mergeGeoJsonFeatures(){
	
	var mergedArray;
	
	var arr1 = countries_pbc.features;
	var arr2 = countries_pbl.features;
	var arr3 = countries_bbc.features;
	var arr4 = countries_bbl.features;
	var arr5 = countries_unkw.features;
	
	mergedArray = arr1.concat(arr2).concat(arr3).concat(arr4).concat(arr5);
	return mergedArray;
}

function addResetControl (){
	
	var options = {position:'topleft' , title: 'Reset Map'};
	var resetCtrl = L.control(options);

	resetCtrl.onAdd = function (map) {
		var butt = this._resetBtn = L.DomUtil.create('a', 'resetCtrl'); // create a div link with a class "resetCtrl"
		butt.href = '#';
		butt.title = this.options.title;
	    
		butt.onclick = resetMap;
	    return butt;
	};
	
	resetCtrl.addTo(g_worldMap);
}

/* Handle the result search at runtime.*/
function resultSearchCallback(feature, container) {

	//console.log("Inside my defined resultSearchCallback");
	props = feature.properties;

	container.appendChild(L.DomUtil.create('br', null, container));
	
	/* For each country that matches search criterion, display country name as well its status of military courts to civilians. */
	var name = L.DomUtil.create('b', null, container);
	name.innerHTML = props.name;
	container.appendChild(L.DomUtil.create('br', null, container));
	
	var image = L.DomUtil.create('img', 'flag' , container);
	image.id  = "flagImageID";
	
	/* Set image src url after getting flag url from fusion table.*/
	getFlagURL(props.name, container);
	
	image.alt = "flag of " + props.name;
	container.appendChild(L.DomUtil.create('br', null, container));
	container.appendChild(L.DomUtil.create('br', null, container));
	container.appendChild(document.createTextNode('Staus of Military Courts to Civilians: '+getRelatedMilitaryStatus(feature.layerPointer)));

	/* Make each result item as clickable object, so map can be panned and zoomed according to the clicked country in the result list.*/
	/*L.DomUtil.addClass(container, 'clickable');
    container.onclick = function() {

        if (window.matchMedia("(max-width:480px)").matches) {
        	container.hidePanel();
        	g_worldMap.fitBounds(feature.layerPointer.getBounds());
        } else {
        	g_worldMap.fitBounds(feature.layerPointer.getBounds());
        }
    };*/
	
	/* Reset colors of all countries by removing GeoJson layer */
	removeLayerGroups();
	
	/* Reset color of the last country that highlighted as search result item*/
	hideLayer(g_lastCountryGeoJsonLayer);
	
	/* Update last country layer so that it could be removed in the next search for another country.*/
	g_lastCountryGeoJsonLayer = feature.layerPointer;
	
	/* Finally add the chosen country to the map*/
	g_worldMap.addLayer(g_lastCountryGeoJsonLayer);
}

function getFlagURL(countryName, container){
	//https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20flag%20FROM%201jAwn5xjU3wgnI_-_bJ5JPl_qSGqWdU82LnmLgoQG%20WHERE%20name%20=%20%27Algeria%27&key=AIzaSyBb2ywtpvLm6YO5YnrYvjk6u83FRN-YKkU
	
	/*Fusion Table information*/
	var fusionTableID = '1RTjBTSNLORaqdqCoCXf51JxpsUUh_NGffnrPRqP_' ;
	var fusionTablePublicKey = 'AIzaSyBb2ywtpvLm6YO5YnrYvjk6u83FRN-YKkU';
	
	var script = document.createElement('script');
    var url = ['https://www.googleapis.com/fusiontables/v1/query?'];
    url.push('sql=');
    var query = 'SELECT flag FROM ' +
    			fusionTableID +
    			" WHERE name='"+ countryName +"'";
    var encodedQuery = encodeURIComponent(query);
    url.push(encodedQuery);
    url.push('&callback=sqlQueryCallback');
    url.push('&key='+ fusionTablePublicKey);
    script.src = url.join('');
    
    container.appendChild(script);
}

function sqlQueryCallback(dataResponse){
	var rows = dataResponse['rows'];
	var flagURL = rows[0][0];
	document.getElementById("flagImageID").src = flagURL;
}

function hideLayer(layer){
	if(g_worldMap.hasLayer(layer)){
		g_worldMap.removeLayer(layer);
	}
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
function getBaseStyle(milstatus) {

	return {
		color: "#000000", 	/* Stroke color */
		weight: 0.2, 		/* Stroke width in pixels. */
		opacity: 1, 		/* Stroke opacity.*/
		fillOpacity: 0.6,   /* Fill color of geometry. */
		fillColor: getBaseColor(milstatus) /* Fill opacity of geometry. */
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

	var militaryStatus = getRelatedMilitaryStatus(layer);
	
	layer.setStyle({
		color: '#FFFFFF',
		weight: 1,
		opacity: 1,
		/*dashArray: '3',*/
		fillOpacity: 0.7,
		fillColor: getHighlightColor(militaryStatus)
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
}

/* A function to reset the colors when a country is not longer 'hovered' */
function resetHighlight(e) {

	var geoJsonLayer = getRelatedGeoJsonLayer(e.target);
	geoJsonLayer.resetStyle(e.target);
}

function getRelatedMilitaryStatus(layer){
	
	var militaryStatus;
	
	if (g_PermittedByConstStatesGeoJsonLayer.hasLayer(layer))
		militaryStatus = "PermittedByConst";
	else if  (g_BannedByConstStatesGeoJsonLayer.hasLayer(layer))
		militaryStatus = "BannedByConst";
	else if  (g_PermittedByLawStatesGeoJsonLayer.hasLayer(layer))
		militaryStatus = "PermittedByLaw";
	else if  (g_BannedByLawStatesGeoJsonLayer.hasLayer(layer))
		militaryStatus = "BannedByLaw";
	else if  (g_UnkwonStatesGeoJsonLayer.hasLayer(layer))
		militaryStatus = "Unkwon";
	
	return militaryStatus;	
}

function getRelatedGeoJsonLayer(layer){
	var geoJsonLayer;
	
	if (g_PermittedByConstStatesGeoJsonLayer.hasLayer(layer))
		geoJsonLayer = g_PermittedByConstStatesGeoJsonLayer;
	else if  (g_BannedByConstStatesGeoJsonLayer.hasLayer(layer))
		geoJsonLayer = g_BannedByConstStatesGeoJsonLayer;
	else if  (g_PermittedByLawStatesGeoJsonLayer.hasLayer(layer))
		geoJsonLayer = g_PermittedByLawStatesGeoJsonLayer;
	else if  (g_BannedByLawStatesGeoJsonLayer.hasLayer(layer))
		geoJsonLayer = g_BannedByLawStatesGeoJsonLayer;
	else if  (g_UnkwonStatesGeoJsonLayer.hasLayer(layer))
		geoJsonLayer = g_UnkwonStatesGeoJsonLayer;
	
	return geoJsonLayer;
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
	
	createTileLayer();
	
	createLayerGroups();

	createMap();
	
	addLegendControl();

	addResetControl();
	
	addSearchControl();
}

function createMap(){

	var mapOptions = getDefaultMapOptions();

	/* Create a JavaScript "map" object, passing it the div element named "map-canvas" and the map properties. */
	g_worldMap = new L.map("map-canvas",mapOptions);

	var overlays = {
			"Permitted By Const": g_PermittedByConstLayerGroup,
			"Banned By Const"	: g_BannedByConstLayerGroup,
			"Permitted By Law"	: g_PermittedByLawLayerGroup,
			"Banned By Law"		: g_BannedByLawLayerGroup,
			"Unkwon"			: g_UnkwonLayerGroup
	};

	L.control.layers(null, overlays).addTo(g_worldMap);
}

function createLayerGroups(){
	
	g_PermittedByConstLayerGroup 	=  	new L.LayerGroup();
	g_BannedByConstLayerGroup		=  	new L.LayerGroup();
	g_PermittedByLawLayerGroup		=  	new L.LayerGroup();
	g_BannedByLawLayerGroup			=  	new L.LayerGroup();
	g_UnkwonLayerGroup				=	new L.LayerGroup();
	
	addGeoJsonLayersToLayerGroups();
}

function addLayerGroups(){
	
	g_PermittedByConstLayerGroup.addTo(g_worldMap);
	g_BannedByConstLayerGroup.addTo(g_worldMap);
	g_PermittedByLawLayerGroup.addTo(g_worldMap);
	g_BannedByLawLayerGroup.addTo(g_worldMap);
	g_UnkwonLayerGroup.addTo(g_worldMap);
}

function removeLayerGroups(){
	
	g_worldMap.removeLayer(g_PermittedByConstLayerGroup);
	g_worldMap.removeLayer(g_BannedByConstLayerGroup);
	g_worldMap.removeLayer(g_PermittedByLawLayerGroup);
	g_worldMap.removeLayer(g_BannedByLawLayerGroup);
	g_worldMap.removeLayer(g_UnkwonLayerGroup);
	
}

/* This function is called once user clicks on reset button. */
function resetMap(){
	var mapOptions = getDefaultMapOptions();

	/* Reset map to initial center , zoom level and colorize all world of countries again.*/
	g_worldMap.setView(mapOptions.center, mapOptions.zoom);
	
	/* In case user removes any layer group, it must be reloaded upon reset is clicked. */
	addLayerGroups();

	/* Reset text field if it holds any name of searched country. */
	document.getElementById("countriesDropDownListID").value = "--Select Country--";
	
	/* Clear the last search result*/
	clearSearchResult();
	//$(".result-item").remove();
}

function clearSearchResult(){
	removeElementById("resultItemID");
}

function removeElementById(id){
	var elem=document.getElementById(id);
	elem !== null?  elem.parentNode.removeChild(elem): null;
}

function isEmpty(a_string){
	/* if given string is null, return true*/
	return (0 == a_string.length);
}

initialize();