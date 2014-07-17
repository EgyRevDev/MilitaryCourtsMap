/**
 * 
 */

var world_map;


function getDefaultMapOptions(){

	var initial_center = new MQA.LatLng(0, 0);
	
	/*Valid zoom levels are 2 through 18*/
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

function initializeMap() {

	var mapOptions = getDefaultMapOptions();

	/* create a JavaScript "map" object, passing it the div element named "map-canvas" and the map properties. */
	world_map = new MQA.TileMap(mapOptions);

    /*Controls are a way to encapsulate functionality on a map. Because these controls are not included in the base download of the API,
     * you must first load and initialize the modules using MQA.withModule
     */
    MQA.withModule('largezoom', 'mousewheel', 'dotcomwindowmanager', 'remotecollection', 'kmldeserializer', loadModuleCallback );
    
    /*Add KML feeds into map*/
    /*MQA.withModule('dotcomwindowmanager', 'remotecollection', 'kmldeserializer', loadRemoteKML);*/
    
	/* In case Enter key is pressed, zoom to the selected country (if any)*/
	/*google.maps.event.addDomListener(window, 'keypress',function(e) {
		if (e.keyCode == 13) {
			zoomToCountry();
		}
	});*/
}

function loadModuleCallback(){
	loadMapControls ();
	loadRemoteKML();
}

function loadMapControls () {

    // add the Large Zoom control
    world_map.addControl(
        new MQA.LargeZoom(),
        new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5))
    );

    // enable zooming with your mouse
    world_map.enableMouseWheelZoom();
}

function loadRemoteKML(){
	
	   /*Create a remote collection using kml url and kml deserializer that transforms data into shape */
	   var kmlCollection = new MQA.RemoteCollection(
	     'https://dl.dropboxusercontent.com/u/78944658/EgyptmergedFinalOptimizedSimplified.kml',
	     new MQA.KMLDeserializer());
	 
	   /*Set a custom name for the collection*/
	   kmlCollection.collectionName = 'egypt borders';
	 
	   /* Automatically zoom and center the map using the bestFit method after the collection has loaded */
	   MQA.EventManager.addListener(kmlCollection, 'loaded', function() {
	     world_map.bestFit();
	   });
	 
	   /* Add the shape collection to the map */
	   world_map.addShapeCollection(kmlCollection);
	   
}

function eventRaised(evt) {
	console.log("mouseover kml collection");
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

MQA.EventUtil.observe(window, 'load', initializeMap);