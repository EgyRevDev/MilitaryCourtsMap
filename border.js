/**
 * 
 */
var map;
function initialize() {

	/* I have obtained world countries borders and merged it into my own
	 * Military Country Map Fusion Table. This is the ID of my table. */
	var fusionTableID = '1Ghp2CN2txWCxVMNEBr9Q-mufpstJ68dNRGG_qLGR';

	/* Name of the column in Military Country Map Fusion Table. This column
	 * contains KML polygons of all world countries. Note that for performance 
	 * issues, most countries' borders are not precise. */
	var borderColumnName = 'Border';

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
	
	/* Initial Map properties */
	var mapOptions = {
			center : new google.maps.LatLng(30.058056, 31.228889),
			zoom : 3,
			mapTypeId: google.maps.MapTypeId.ROADMAP  
	};

	/* create a JavaScript "map" object, passing it the div element named "map-canvas" and the map properties. */
	map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);

	/* For all world countries, get their borders from the fusion table through fusion table query.
	 * Styling all world countries accordingly.*/
	var fusionTableLayer = new google.maps.FusionTablesLayer({
		query: {
			select: borderColumnName,
			from: fusionTableID
		},
		styles: [{
			polygonOptions: {
				fillColor: colorOfMilTrialsUnknown,
				fillOpacity: 0.5
			}
		}, /*{
			where: 'Military_Courts_State = \'Unknown\'',
			polygonOptions: {
				fillColor: colorOfMilTrialsUnknown
			}
		},*/{
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
	fusionTableLayer.setMap(map);
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