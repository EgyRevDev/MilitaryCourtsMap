/**
 * 
 */

var world_map;

var fusionTableLayer;

/* I have obtained world countries borders and merged it into my own
 * Military Country Map Fusion Table. This is the ID of my table. */
var fusionTableID = "1Ghp2CN2txWCxVMNEBr9Q-mufpstJ68dNRGG_qLGR";

/* Name of the column in Military Country Map Fusion Table. This column
 * contains KML polygons of all world countries. Note that for performance 
 * issues, most countries' borders are not precise. */
var borderColumnName = "Border";

/* Geocoding is the process of converting addresses (like "1600 Amphitheatre Parkway, Mountain View, CA") into geographic coordinates (like latitude 37.423021 and longitude -122.083739),
 * which you can use to place markers or position the map.
 * It will convert given country name into geographic coordinate so that map can be centered at appropriately.
 */
var geocoder;

function initialize() {

	/* All countries whose military status are permitted by constitution are colored by red*/
	var colorOfMilTrialsPermByConst = '#FF0000';
	/* All countries whose military status are banned by constitution are colored by green*/
	var colorOfMilTrialsBanByConst = '#00FF00';
	/* All countries whose military status are permitted by law are colored by yellow*/
	var colorOfMilTrialsPermByLaw = '#FFFF00';
	/* All countries whose military status are banned by law are colored by orange*/
	var colorOfMilTrialsBanByLaw = '#FF9900';
	/* All countries whose military status are banned by constitution are colored by grey*/
	var colorOfMilTrialsUnknown = '#999999';

	var initial_center = new google.maps.LatLng(0, 0);
	var intial_zoom_level = 2;

	/* Initial Map properties */
	var mapOptions = {
			center 	 : initial_center,
			zoom 	 : intial_zoom_level,
			mapTypeId: google.maps.MapTypeId.ROADMAP  
	};

	/* create a JavaScript "map" object, passing it the div element named "map-canvas" and the map properties. */
	world_map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);

	/* For all world countries, get their borders from the fusion table through fusion table query.
	 * Styling all world countries accordingly.*/
	fusionTableLayer = new google.maps.FusionTablesLayer({
		query: {
			/* Make sure to represent given string of different query fields with the same symbol either double quotation "" or single quotation ''.*/
			select: borderColumnName,
			from: fusionTableID
		},
		styles: [{
			polygonOptions: {
				/* By default consider any country military court state as unknown. Otherwise it will meet any of the following conditions. */
				fillColor: colorOfMilTrialsUnknown,
				fillOpacity: 0.5
			}
		}, {
			where: 'Military_Courts_State = \'PermittedByConst\'',
			polygonOptions: {
				fillColor: colorOfMilTrialsPermByConst,
				fillOpacity: 0.3
			}
		},{
			where: 'Military_Courts_State = \'BannedByConst\'',
			polygonOptions: {
				fillColor: colorOfMilTrialsBanByConst,
				fillOpacity: 0.3
			}
		},{
			where: 'Military_Courts_State = \'PermittedByLaw\'',
			polygonOptions: {
				fillColor: colorOfMilTrialsPermByLaw
			}
		},{
			where: 'Military_Courts_State = \'BannedByLaw\'',
			polygonOptions: {
				fillColor: colorOfMilTrialsBanByLaw
			}
		}]
	});

	/* Draw fusion table layer over given map. */
	fusionTableLayer.setMap(world_map);
	
	/* Initialize geocoder object */
	geocoder = new google.maps.Geocoder();
}

function showSelectedCountry() {

	console.log("Inside highlightCountry function");
	var whereClause;
	var selectedCountryName = document.getElementById('search-string_0').value.replace(/'/g, "\\'");
	console.log("selectedCountryName var is: %s", selectedCountryName);

	if (selectedCountryName != '--Select--') {
		whereClause = "Name CONTAINS IGNORING CASE \'"+ selectedCountryName+"\'";
		console.log("whereClause var is: %s", whereClause);
	}

	fusionTableLayer.setOptions({
		query: {
			/* Make sure to represent given string of different query fields with the same symbol either double quotation "" or single quotation ''.
			   Here double quotation is used since there is whereClause variable is to be formed at runtime .*/
			select: borderColumnName,
			from  : fusionTableID,
			where : whereClause
		}

	});

	/* Accessing the Geocoding service is asynchronous, since the Google Maps API needs to make a call to an external server.
	 * For that reason, you need to pass a call-back method to execute upon completion of the request. 
	 * This call-back method processes the result(s).
	 */
	geocoder.geocode( {'address' : selectedCountryName}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {

			/* Google centers a map but it does not zoom it. 
			 * To zoom in appropriately, you should use map.fitBounds() method using LatLngBounds object returned by the geocoder.*/

			/* geometry.location represents the geocoded latitude,longitude value. Note that this is LatLng object*/
			/* Adjust center of the map as well as the zoom level. */
			world_map.setCenter(results[0].geometry.location);
			world_map.fitBounds(results[0].geometry.bounds);
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

google.maps.event.addDomListener(window, 'load', initialize);