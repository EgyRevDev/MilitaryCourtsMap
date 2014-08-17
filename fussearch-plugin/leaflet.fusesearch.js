
// From http://www.tutorialspoint.com/javascript/array_map.htm
if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        res[i] = fun.call(thisp, this[i], i, this);
    }

    return res;
  };
}

L.Control.FuseSearch = L.Control.extend({
    
    includes: L.Mixin.Events,
    
    options: {
        position: 'topright',
        title: 'Search',
        placeholder: 'Search',
        caseSensitive: false,
        threshold: 0.5,
        maxResultLength: null,
        showResultFct: null,
        showInvisibleFeatures: true,
        searchResultCallback: null
    },
    
    initialize: function(options) {
        L.setOptions(this, options);
        this._panelOnLeftSide = (this.options.position.indexOf("left") !== -1);
    },
    
    onAdd: function(map) {
        
        var ctrl = this._createControl();
        this._createPanel(map);
        this._setEventListeners();
        map.invalidateSize();
        
        return ctrl;
    },
    
    onRemove: function(map) {
        
        this.hidePanel(map);
        this._clearEventListeners();
        this._clearPanel(map);
        this._clearControl();
        
        return this;
    },
    
    _createControl: function() {

        var className = 'leaflet-fusesearch-control',
            container = L.DomUtil.create('div', className);

        // Control to open the search panel
        var butt = this._openButton = L.DomUtil.create('a', 'button', container);
        butt.href = '#';
        butt.title = this.options.title;
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent.on(butt, 'click', stop)
                  .on(butt, 'mousedown', stop)
                  .on(butt, 'touchstart', stop)
                  .on(butt, 'mousewheel', stop)
                  .on(butt, 'MozMousePixelScroll', stop);
        L.DomEvent.on(butt, 'click', L.DomEvent.preventDefault);
        L.DomEvent.on(butt, 'click', this.showPanel, this);

        return container;
    },
    
    _clearControl: function() {
        // Unregister events to prevent memory leak
        var butt = this._openButton;
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent.off(butt, 'click', stop)
                  .off(butt, 'mousedown', stop)
                  .off(butt, 'touchstart', stop)
                  .off(butt, 'mousewheel', stop)
                  .off(butt, 'MozMousePixelScroll', stop);
        L.DomEvent.off(butt, 'click', L.DomEvent.preventDefault);
        L.DomEvent.off(butt, 'click', this.showPanel);
    },
    
    _createPanel: function(map) {
        var _this = this;

        // Create the search panel
        var mapContainer = map.getContainer();
        var className = 'leaflet-fusesearch-panel',
            pane = this._panel = L.DomUtil.create('div', className, mapContainer);
        
        // Make sure we don't drag the map when we interact with the content
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent.on(pane, 'click', stop)
                .on(pane, 'dblclick', stop)
                .on(pane, 'mousedown', stop)
                .on(pane, 'touchstart', stop)
                .on(pane, 'mousewheel', stop)
                .on(pane, 'MozMousePixelScroll', stop);

        // place the pane on the same side as the control
        if (this._panelOnLeftSide) {
            L.DomUtil.addClass(pane, 'left');
        } else {
            L.DomUtil.addClass(pane, 'right');
        }

        // Intermediate container to get the box sizing right
        var container = L.DomUtil.create('div', 'content', pane);
        
        // Search image and input field
        //L.DomUtil.create('img', 'search-image', container);
        //this._input = L.DomUtil.create('input', 'search-input', container); //Modified by Wael
        this._input = L.DomUtil.create('select', 'search-input', container);
        this._input.innerHTML= '<option value="--Select Country--">--Select Country--</option> \
			<option value="Afghanistan">Afghanistan</option>  \
			<option value="Albania">Albania</option>  \
			<option value="Algeria">Algeria</option>  \  \
			<option value="Andorra">Andorra</option>  \
			<option value="Angola">Angola</option>  \
			<option value="Antigua and Barbuda">Antigua and Barbuda</option>  \
			<option value="Argentina">Argentina</option>  \
			<option value="Armenia">Armenia</option>  \
			<option value="Australia">Australia</option>  \
			<option value="Austria">Austria</option>  \
			<option value="Azerbaijan">Azerbaijan</option>  \
			<option value="Bahamas">Bahamas</option>  \
			<option value="Bahrain">Bahrain</option>  \
			<option value="Bangladesh">Bangladesh</option>  \
			<option value="Barbados">Barbados</option>  \
			<option value="Belarus">Belarus</option>  \
			<option value="Belgium">Belgium</option>  \
			<option value="Belize">Belize</option>  \
			<option value="Benin">Benin</option>  \
			<option value="Bhutan">Bhutan</option>  \
			<option value="Bolivia">Bolivia</option>  \
			<option value="Bosnia and Herzegovina">Bosnia and \
				Herzegovina</option>  \
			<option value="Botswana">Botswana</option>  \
			<option value="Brazil">Brazil</option>  \
			<option value="Brunei Darussalam">Brunei Darussalam</option>  \
			<option value="Bulgaria">Bulgaria</option>  \
			<option value="Burkina Faso">Burkina Faso</option>  \
			<option value="Burundi">Burundi</option>  \
			<option value="Cabo Verde">Cabo Verde</option>  \
			<option value="Cambodia">Cambodia</option>  \
			<option value="Cameroon">Cameroon</option>  \
			<option value="Canada">Canada</option>  \
			<option value="Central African Republic">Central African \
				Republic</option>  \
			<option value="Chad">Chad</option>  \
			<option value="Chile">Chile</option>  \
			<option value="China">China</option>  \
			<option value="Colombia">Colombia</option>  \
			<option value="Comoros">Comoros</option>  \
			<option value="Congo,DRC">Congo,DRC</option>  \
			<option value="Congo">Congo</option>  \
			<option value="Costa Rica">Costa Rica</option>  \
			<option value="Cote d\'Ivoire">Cote d\'Ivoire</option>  \
			<option value="Croatia">Croatia</option>  \
			<option value="Cuba">Cuba</option>  \
			<option value="Cyprus">Cyprus</option>  \
			<option value="Czech Republic">Czech Republic</option>  \
			<option value="Denmark">Denmark</option>  \
			<option value="Djibouti">Djibouti</option>  \
			<option value="Dominica">Dominica</option>  \
			<option value="Dominican Republic">Dominican Republic</option>  \
			<option value="Ecuador">Ecuador</option>  \
			<option value="Egypt">Egypt</option>  \
			<option value="El Salvador">El Salvador</option>  \
			<option value="Equatorial Guinea">Equatorial Guinea</option>  \
			<option value="Eritrea">Eritrea</option>  \
			<option value="Estonia">Estonia</option>  \
			<option value="Ethiopia">Ethiopia</option>  \
			<option value="Fiji">Fiji</option>  \
			<option value="Finland">Finland</option>  \
			<option value="France">France</option>  \
			<option value="Gabon">Gabon</option>  \
			<option value="Gambia">Gambia</option>  \
			<option value="Georgia">Georgia</option>  \
			<option value="Germany">Germany</option>  \
			<option value="Ghana">Ghana</option>  \
			<option value="Greece">Greece</option>  \
			<option value="Grenada">Grenada</option>  \
			<option value="Guatemala">Guatemala</option>  \
			<option value="Guinea Bissau">Guinea Bissau</option>  \
			<option value="Guinea">Guinea</option>  \
			<option value="Guyana">Guyana</option>  \
			<option value="Haiti">Haiti</option>  \
			<option value="Honduras">Honduras</option>  \
			<option value="Hungary">Hungary</option>  \
			<option value="Iceland">Iceland</option>  \
			<option value="India">India</option>  \
			<option value="Indonesia">Indonesia</option>  \
			<option value="Iran">Iran</option>  \
			<option value="Iraq">Iraq</option>  \
			<option value="Ireland">Ireland</option>  \
			<option value="Israel">Israel</option>  \
			<option value="Italy">Italy</option>  \
			<option value="Jamaica">Jamaica</option>  \
			<option value="Japan">Japan</option>  \
			<option value="Jordan">Jordan</option>  \
			<option value="Kazakhstan">Kazakhstan</option>  \
			<option value="Kenya">Kenya</option>  \
			<option value="Kiribati">Kiribati</option>  \
			<option value="Kuwait">Kuwait</option>  \
			<option value="Kyrgyzstan">Kyrgyzstan</option>  \
			<option value="Laos">Laos</option>  \
			<option value="Latvia">Latvia</option>  \
			<option value="Lebanon">Lebanon</option>  \
			<option value="Lesotho">Lesotho</option>  \
			<option value="Liberia">Liberia</option>  \
			<option value="Libya">Libya</option>  \
			<option value="Liechtenstein">Liechtenstein</option>  \
			<option value="Lithuania">Lithuania</option>  \
			<option value="Luxembourg">Luxembourg</option>  \
			<option value="Macedonia">Macedonia</option>  \
			<option value="Madagascar">Madagascar</option>  \
			<option value="Malawi">Malawi</option>  \
			<option value="Malaysia">Malaysia</option>  \
			<option value="Maldives">Maldives</option>  \
			<option value="Mali">Mali</option>  \
			<option value="Malta">Malta</option>  \
			<option value="Marshall Islands">Marshall Islands</option>  \
			<option value="Mauritania">Mauritania</option>  \
			<option value="Mauritius">Mauritius</option>  \
			<option value="Mexico">Mexico</option>  \
			<option value="Micronesia">Micronesia</option>  \
			<option value="Moldova">Moldova</option>  \
			<option value="Monaco">Monaco</option>  \
			<option value="Mongolia">Mongolia</option>  \
			<option value="Montenegro">Montenegro</option>  \
			<option value="Morocco">Morocco</option>  \
			<option value="Mozambique">Mozambique</option>  \
			<option value="Myanmar">Myanmar</option>  \
			<option value="Namibia">Namibia</option>  \
			<option value="Nauru">Nauru</option>  \
			<option value="Nepal">Nepal</option>  \
			<option value="Netherlands">Netherlands</option>  \
			<option value="New Zealand">New Zealand</option>  \
			<option value="Nicaragua">Nicaragua</option>  \
			<option value="Niger">Niger</option>  \
			<option value="Nigeria">Nigeria</option>  \
			<option value="North Korea">North Korea</option>  \
			<option value="Norway">Norway</option>  \
			<option value="Oman">Oman</option>  \
			<option value="Pakistan">Pakistan</option>  \
			<option value="Palau">Palau</option>  \
			<option value="Palestine">Palestine</option>  \
			<option value="Panama">Panama</option>  \
			<option value="Papua New Guinea">Papua New Guinea</option>  \
			<option value="Paraguay">Paraguay</option>  \
			<option value="Peru">Peru</option>  \
			<option value="Philippines">Philippines</option>  \
			<option value="Poland">Poland</option>  \
			<option value="Portugal">Portugal</option>  \
			<option value="Qatar">Qatar</option>  \
			<option value="Romania">Romania</option>  \
			<option value="Russia">Russia</option>  \
			<option value="Rwanda">Rwanda</option>  \
			<option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>  \
			<option value="Saint Lucia">Saint Lucia</option>  \
			<option value="Saint Vincent and the Grenadines">Saint \
				Vincent and the Grenadines</option>  \
			<option value="Samoa">Samoa</option>  \
			<option value="San Marino">San Marino</option>  \
			<option value="Sao Tome and Principe">Sao Tome and Principe</option>  \
			<option value="Saudi Arabia">Saudi Arabia</option>  \
			<option value="Senegal">Senegal</option>  \
			<option value="Serbia">Serbia</option>  \
			<option value="Seychelles">Seychelles</option>  \
			<option value="Sierra Leone">Sierra Leone</option>  \
			<option value="Singapore">Singapore</option>  \
			<option value="Slovakia">Slovakia</option>  \
			<option value="Slovenia">Slovenia</option>  \
			<option value="Solomon Islands">Solomon Islands</option>  \
			<option value="Somalia">Somalia</option>  \
			<option value="South Africa">South Africa</option>  \
			<option value="South Korea">South Korea</option>  \
			<option value="South Sudan">South Sudan</option>  \
			<option value="Spain">Spain</option>  \
			<option value="Sri Lanka">Sri Lanka</option>  \
			<option value="Sudan">Sudan</option>  \
			<option value="Suriname">Suriname</option>  \
			<option value="Swaziland">Swaziland</option>  \
			<option value="Sweden">Sweden</option>  \
			<option value="Switzerland">Switzerland</option>  \
			<option value="Syria">Syria</option>  \
			<option value="Tajikistan">Tajikistan</option>  \
			<option value="Tanzania">Tanzania</option>  \
			<option value="Thailand">Thailand</option>  \
			<option value="Timor-Leste">Timor-Leste</option>  \
			<option value="Togo">Togo</option>  \
			<option value="Tonga">Tonga</option>  \
			<option value="Trinidad and Tobago">Trinidad and Tobago</option>  \
			<option value="Tunisia">Tunisia</option>  \
			<option value="Turkey">Turkey</option>  \
			<option value="Turkmenistan">Turkmenistan</option>  \
			<option value="Tuvalu">Tuvalu</option>  \
			<option value="Uganda">Uganda</option>  \
			<option value="Ukraine">Ukraine</option>  \
			<option value="United Arab Emirates">United Arab Emirates</option>  \
			<option value="United Kingdom">United Kingdom</option>  \
			<option value="United States of America">United States of \
				America</option>  \
			<option value="Uruguay">Uruguay</option>  \
			<option value="Uzbekistan">Uzbekistan</option>  \
			<option value="Vanuatu">Vanuatu</option>  \
			<option value="Venezuela">Venezuela</option>  \
			<option value="Vietnam">Vietnam</option>  \
			<option value="Yemen">Yemen</option>  \
			<option value="Zambia">Zambia</option>  \
			<option value="Zimbabwe">Zimbabwe</option>  \
';
        
        this._input.id="countriesDropDownListID"
        //this._input.maxLength = 30;
        //this._input.placeholder = this.options.placeholder;
        this._input.onkeyup = function(evt) {
            var searchString = evt.currentTarget.value;
            _this.searchFeatures(searchString);
        };

        this._input.onchange = function(evt) {
        	//console.log("dropdown menu change event");
            var searchString = evt.currentTarget.value;
            //console.log("Search string is:" + searchString);
            _this.searchFeatures(map,searchString);
        };
        
        // Close button
        var close = this._closeButton = L.DomUtil.create('a', 'close', container);
        close.innerHTML = '&times;';
        L.DomEvent.on(close, 'click', this.hidePanel, this);
        
        // Where the result will be listed
        this._resultList = L.DomUtil.create('div', 'result-list', container); 
        
        return pane;
    },
    
    _clearPanel: function(map) {

        // Unregister event handlers
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent.off(this._panel, 'click', stop)
                  .off(this._panel, 'dblclick', stop)
                  .off(this._panel, 'mousedown', stop)
                  .off(this._panel, 'touchstart', stop)
                  .off(this._panel, 'mousewheel', stop)
                  .off(this._panel, 'MozMousePixelScroll', stop);

        L.DomEvent.off(this._closeButton, 'click', this.hidePanel);
        
        var mapContainer = map.getContainer();
        mapContainer.removeChild(this._panel);
        
        this._panel = null;
    },
    
    _setEventListeners : function() {
        var that = this;
        var input = this._input;
        this._map.addEventListener('overlayadd', function() {
            that.searchFeatures(input.value);
        });
        this._map.addEventListener('overlayremove', function() {
            that.searchFeatures(input.value);
        });
    },
    
    _clearEventListeners: function() {
        this._map.removeEventListener('overlayadd');
        this._map.removeEventListener('overlayremove');        
    },
    
    isPanelVisible: function () {
        return L.DomUtil.hasClass(this._panel, 'visible');
    },

    showPanel: function () {
        if (! this.isPanelVisible()) {
            L.DomUtil.addClass(this._panel, 'visible');
            // Preserve map centre
            this._map.panBy([this.getOffset() * 0.5, 0], {duration: 0.5});
            this.fire('show');
            //this._input.select();
            // Search again as visibility of features might have changed
            //this.searchFeatures(this._input.value);
        }
    },

    hidePanel: function (e) {
        if (this.isPanelVisible()) {
            L.DomUtil.removeClass(this._panel, 'visible');
            // Move back the map centre - only if we still hold this._map
            // as this might already have been cleared up by removeFrom()
            if (null !== this._map) {
                this._map.panBy([this.getOffset() * -0.5, 0], {duration: 0.5});
            };
            this.fire('hide');
            if(e) {
                L.DomEvent.stopPropagation(e);
            }
        }
    },
    
    getOffset: function() {
        if (this._panelOnLeftSide) {
            return - this._panel.offsetWidth;
        } else {
            return this._panel.offsetWidth;
        }
    },

    indexFeatures: function(jsonFeatures, keys) {

        this._keys = keys;
        var properties = jsonFeatures.map(function(feature) {
            // Keep track of the original feature
            feature.properties._feature = feature;
            return feature.properties;
        });
        
        var options = {
            keys: keys,
            caseSensitive: this.options.caseSensitive,
            threshold : this.options.threshold
        };
        
        //console.log(properties[1].name);
        this._fuseIndex = new Fuse(properties, options);
        //console.log(this._fuseIndex.list[0].name);
    },
    
    searchFeatures: function(map,string) {
        
    	var result = this._fuseIndex.search(string);

        //console.log(result[0]._feature.layerPointer);
        if (window.matchMedia("(max-width:480px)").matches) {
            _this.hidePanel();
            console.log("Call map fit bounds if you can");
        } else {
        	//console.log(feature.layer);
        	map.fitBounds(result[0]._feature.layerPointer.getBounds());
            //console.log("Call map fit bounds if you can");
        }
        
        
        
        // Empty result list
        $(".result-item").remove();
        
        var resultList = $('.result-list')[0];
        var feature = result[0]._feature;
        
        /*var num = 0;
        var max = this.options.maxResultLength;
        for (var i in result) {
            var props = result[i];
            var feature = props._feature;
            var popup = this._getFeaturePopupIfVisible(feature);
            
            if (undefined !== popup || this.options.showInvisibleFeatures) {
                this.createResultItem(props, resultList, popup);
                if (undefined !== max && ++num === max)
                    break;
            }
        }*/
        
        // Create a container for the result list to be accessed by the user from his defined callback function.
        var resultItem = L.DomUtil.create('p', 'result-item', resultList);
        resultItem.id="resultItemID"
        this.options.searchResultCallback(feature, resultItem);
    },
    
    _getFeaturePopupIfVisible: function(feature) {
        var layer = feature.layer;
        if (undefined !== layer && this._map.hasLayer(layer)) {
            return layer.getPopup();
        }
    },
    
    createResultItem: function(props, container, popup) {

        var _this = this;
        var feature = props._feature;

        // Create a container and open the associated popup on click
        var resultItem = L.DomUtil.create('p', 'result-item', container);
        
        if (undefined !== popup) {
            L.DomUtil.addClass(resultItem, 'clickable');
            resultItem.onclick = function() {
                
                if (window.matchMedia("(max-width:480px)").matches) {
                    _this.hidePanel();
                    feature.layer.openPopup();
                } else {
                    _this._panAndPopup(feature, popup);
                }
            };
        }

        // Fill in the container with the user-supplied function if any,
        // otherwise display the feature properties used for the search.
        if (null !== this.options.showResultFct) {
            this.options.showResultFct(feature, resultItem);
        } else {
            str = '<b>' + props[this._keys[0]] + '</b>';
            for (var i = 1; i < this._keys.length; i++) {
                str += '<br/>' + props[this._keys[i]];
            }
            resultItem.innerHTML = str;
        };

        return resultItem;
    },
    
    _panAndPopup : function(feature, popup) {
        // Temporarily adapt the map padding so that the popup is not hidden by the search pane
        if (this._panelOnLeftSide) {
            var oldPadding = popup.options.autoPanPaddingTopLeft;
            var newPadding = new L.Point(- this.getOffset(), 10);
            popup.options.autoPanPaddingTopLeft = newPadding;
            feature.layer.openPopup();
            popup.options.autoPanPaddingTopLeft = oldPadding;
        } else {
            var oldPadding = popup.options.autoPanPaddingBottomRight;
            var newPadding = new L.Point(this.getOffset(), 10);
            popup.options.autoPanPaddingBottomRight = newPadding;
            feature.layer.openPopup();
            popup.options.autoPanPaddingBottomRight = oldPadding;
        }
    }
});

L.control.fuseSearch = function(options) {
    return new L.Control.FuseSearch(options);
};
