//! malette.js
//! version : 0.01
//! author : Brendan Heberton
//!license : MIT 
(function(window){
  'use strict';

  var Malette = function Malette( container, options ) {
    console.log('init Malette, options: ', options);
    var self = this;

    //store options 
    this.options = options;

    //UI defaults 
    this.width = options.width || 239;
    this.height = options.height || 'auto';
    this.container = container;
    this._handlers = {};
    this.state = {};
    this.state._isGraduated = false;
    this.state._isTheme = false;
    this.state.type = (options.type) ? options.type.toLowerCase() : 'point';
    this.state.layerId = options.layerId || null;

    //style params 
    this.format = options.formatIn || 'esri-json';
    this.exportFormat = options.formatOut || 'esri-json';

    //can choropleth || graduate 
    this._hasApplicableFields = this._getApplicableFields();

    //initialize the things 
    if ( this.format === 'esri-json' ) {
      if ( options.style ) {
        
        this.style = options.style || {};
        
        if ( this.style.visualVariables ) {
          this._setRamp();
        }
        if ( !this.style.symbol && this.style.defaultSymbol ) {
          this.style.symbol = this.style.defaultSymbol;
        }
        
        this.state.fillOpacity = this.style.symbol.color[3];
        this.style.symbol.color = this._dojoColorToRgba( this.style.symbol.color ); //helper for colors, etc\

        if ( this.state.type !== 'line' ) {
          this.style.symbol.outline.color = this._dojoColorToRgba( this.style.symbol.outline.color );
        }

      } else {
        //TODO 
        //create default esri json 
      }
    } else {
      if ( options.style ) {
        this._toEsriJson();
      }
    }

    //optional UI elements 
    //initialize 
    this._buildUI();

    if ( options.exportStyle === true ) {
      this.showExport = true;
      this.exportFormat = options.formatOut;
      this._addExporter();
    }

  };




  /************* UI **************/

  /*
  * Builds the main container for Malette, appends a header and tile; 
  *
  */
  Malette.prototype._buildUI = function() {

    var container = document.getElementById( this.container );
    var innerContainer = document.createElement( 'div' );
    container.appendChild( innerContainer ).id = 'malette';

    var content = document.createElement( 'div' );
    innerContainer.appendChild( content ).id = 'malette-content';

    var header = document.createElement( 'div' );
    innerContainer.appendChild( header ).id = 'malette-header';
    header.innerHTML = 'Malette';

    if ( this.options.title ) {
      var header = document.createElement( 'div' );
      innerContainer.appendChild( header ).id = 'malette-title';
      header.innerHTML = this.options.title;
      document.getElementById('malette-content').style['margin-top'] = '40px';
    }

    this._addTabs(innerContainer);
    this._constructColorRegion(content);

  }



  /*
  * Builds the navigation tabs 
  * Default: Color, Size
  * @param {String} el    Builds UI for navigation tabs 
  */
  Malette.prototype._addTabs = function(el) {
    var self = this;

    var tabRegion = document.createElement( 'div' );
    el.appendChild( tabRegion ).id = 'malette-tab-region';

    var disabled = ( this.state.type === 'point' ) ? '' : 'disabled';
    var stroke = ( this.state.type !== 'line' ) ? 'stroke' : 'line';

    this._createElement('div', tabRegion, 'malette-color-tab', 'color', 'malette-tab malette-tab-selected');
    this._createElement('div', tabRegion, 'malette-size-tab', 'size', 'malette-tab '+disabled);
    this._createElement('div', tabRegion, 'malette-stroke-tab', stroke, 'malette-tab');
    this._createElement('div', tabRegion, 'malette-opacity-tab', 'opacity', 'malette-tab');

    //toggle the tabs!! 
    this._classEventBuilder('click', 'malette-tab', '_onTabClick' );
    
  }



  /*
  * Exporter UI 
  * 
  *
  */
  Malette.prototype._addExporter = function() {
    var self = this;

    var container = document.getElementById('malette-content');
    var el = this._createElement('div', container, 'malette-export-toggle-container', '', '');
    var span = this._createElement('span', el, 'malette-export-toggle-text', 'Show JSON', '');
    var toggle = this._createElement('input', el, 'malette-export-toggle', '', '');
    toggle.type = 'checkbox';
    if ( this._isShowJson ) {
      toggle.checked = true;
    }

    var content = document.getElementById('malette');
    var exporter = this._createElement('div', content, 'malette-export-container', '', '');
    var header = this._createElement('div', exporter, 'malette-export-header', '', '');
    
    var css = this._createElement('input', header, 'malette-export-css-toggle', '', 'export-type-toggle');
    css.type = 'checkbox';
    (this.exportFormat === 'css') ? css.checked = true : false;
    this._createElement('span', header, 'css-out-toggle', 'CSS', 'malette-export-label');

    var esriRenderer = this._createElement('input', header, 'malette-export-esri-toggle', '', 'export-type-toggle');
    esriRenderer.type = 'checkbox';
    (this.exportFormat === 'esri-json') ? esriRenderer.checked = true : false;
    this._createElement('span', header, 'esri-out-toggle', 'Esri Renderer', 'malette-export-label');

    var codeBox = this._createElement('textarea', exporter, 'export-code-block', '', 'code-block');
    
    this.selectedExportType = this.exportFormat;
    this._generateExportStyle( this.exportFormat );

    //toggle export UI event handler
    this._idEventBuilder('click', 'malette-export-toggle', '_onToggleExportUI' );

    //export type toggle 
    this._classEventBuilder('click', 'export-type-toggle', '_onExportTypeChange' );

  }




  /*
  * Color swatch UI generator 
  * Used both in fill and stroke color UI 
  * @param {String} el    parenet element 
  * @param {String} selectedColor    currently selected color rgba 
  */ 
  Malette.prototype._addColors = function(el, selectedColor) {
    var swatch;
    var colors = [
      'rgb(255,255,255)','rgb(240,240,240)','rgb(217,217,217)','rgb(189,189,189)','rgb(150,150,150)','rgb(115,115,115)','rgb(82,82,82)','rgb(37,37,37)',
      'rgb(247,252,253)','rgb(224,236,244)','rgb(191,211,230)','rgb(158,188,218)','rgb(140,150,198)','rgb(140,107,177)','rgb(136,65,157)','rgb(110,1,107)',
      'rgb(255,247,243)','rgb(253,224,221)','rgb(252,197,192)','rgb(250,159,181)','rgb(247,104,161)','rgb(221,52,151)','rgb(174,1,126)','rgb(122,1,119)',
      'rgb(255,255,204)','rgb(255,237,160)','rgb(254,217,118)','rgb(254,178,76)','rgb(253,141,60)','rgb(252,78,42)','rgb(227,26,28)','rgb(177,0,38)',
      'rgb(255,255,217)','rgb(237,248,177)','rgb(199,233,180)','rgb(127,205,187)','rgb(65,182,196)','rgb(29,145,192)','rgb(34,94,168)','rgb(12,44,132)',
      'rgb(247,252,240)','rgb(224,243,219)','rgb(204,235,197)','rgb(168,221,181)','rgb(123,204,196)','rgb(78,179,211)','rgb(43,140,190)','rgb(8,88,158)',
      'rgb(247,252,253)','rgb(229,245,249)','rgb(204,236,230)','rgb(153,216,201)','rgb(102,194,164)','rgb(65,174,118)','rgb(35,139,69)','rgb(0,88,36)'
    ];

    var colorPalette = this._createElement('div', el, 'malette-color-palette', '', '');

    var selectedEl = this._createElement('div', colorPalette, 'malette-selected-color', 'Selected color', '');
    swatch = this._createElement('span', selectedEl, 'malette-selected-swatch', '', 'malette-color-swatch-selected');
    swatch.style.backgroundColor = selectedColor;

    colors.forEach(function(color, i) {
      swatch = document.createElement( 'div' );
      swatch.style.backgroundColor = color;
      colorPalette.appendChild( swatch ).className = 'malette-color-swatch';
    }); 

  }



  /*
  * Color theme UI generator 
  * creates color ramps 
  * @param {String} el    parenet element 
  * @param {String} 
  */ 
  Malette.prototype._addThemes = function(el) {
    var self = this;
    var swatch;

    var select = this._createAttributeSelect();

    this.themeColors = [
      ['rgb(255,255,255)','rgb(240,240,240)','rgb(217,217,217)','rgb(189,189,189)','rgb(150,150,150)','rgb(115,115,115)','rgb(82,82,82)','rgb(37,37,37)'],
      ['rgb(255,255,217)','rgb(237,248,177)','rgb(199,233,180)','rgb(127,205,187)','rgb(65,182,196)','rgb(29,145,192)','rgb(34,94,168)','rgb(12,44,132)'],
      ['rgb(255,255,229)','rgb(247,252,185)','rgb(217,240,163)','rgb(173,221,142)','rgb(120,198,121)','rgb(65,171,93)','rgb(35,132,67)','rgb(0,90,50)'],
      ['rgb(255,247,251)','rgb(236,226,240)','rgb(208,209,230)','rgb(166,189,219)','rgb(103,169,207)','rgb(54,144,192)','rgb(2,129,138)','rgb(1,100,80)'],
      ['rgb(247,252,253)','rgb(224,236,244)','rgb(191,211,230)','rgb(158,188,218)','rgb(140,150,198)','rgb(140,107,177)','rgb(136,65,157)','rgb(110,1,107)'],
      ['rgb(255,255,204)','rgb(255,237,160)','rgb(254,217,118)','rgb(254,178,76)','rgb(253,141,60)','rgb(252,78,42)','rgb(227,26,28)','rgb(177,0,38)'],
      ['rgb(255,245,235)','rgb(254,230,206)','rgb(253,208,162)','rgb(253,174,107)','rgb(253,141,60)','rgb(241,105,19)','rgb(217,72,1)','rgb(140,45,4)']
    ];

    var colorPaletteContainer = this._createElement('div', el, 'malette-theme-palette', '', '');

    colorPaletteContainer.appendChild( select ).id = 'malette-attr-select';
  
    var colorPalette = this._createElement('div', colorPaletteContainer, 'malette-theme-palette-inner', '', '');    

    this.themeColors.forEach(function(colors, i) {
      var row = self._createElement('div', colorPalette, 'malette-theme-row-'+i, '', 'malette-theme-row');
      colorPalette.appendChild(row);
      
      colors.forEach(function(color) {
        swatch = document.createElement( 'div' );
        swatch.style.backgroundColor = color;
        row.appendChild( swatch ).className = 'malette-theme-swatch';
      });

    });

  }




  /*
  * Creates the color tab UI
  * @param {String} el   Parent element to append the color UI 
  *
  */
  Malette.prototype._constructColorRegion = function(el) {
    var self = this;

    el.innerHTML = '';
    
    this._createElement('div', el, 'malette-single-color-option', 'Single', 'malette-option-toggle malette-option-toggle-selected');

    if ( this._hasApplicableFields === true ) {
      this._createElement('div', el, 'malette-theme-color-option', 'Theme', 'malette-option-toggle');
    } else {
      this._createElement('div', el, 'malette-theme-color-option', 'Theme', 'malette-option-toggle disabled');
    }

    var colorContainer = this._createElement('div', el, 'malatte-color-container', '', '');

    this._addColors(colorContainer, this.style.symbol.color);

    //Color swatch events 
    this._classEventBuilder('click', 'malette-color-swatch', '_onColorClick' );

    //show single colors event 
    this._idEventBuilder('click', 'malette-single-color-option', 'showSingleColorUI' );

    if ( this._hasApplicableFields === true ) {
      this._addThemes(colorContainer);

      //show ui theme event 
      this._idEventBuilder('click', 'malette-theme-color-option', 'showThemeUI' );

      //theme color change event 
      this._idEventBuilder('change', 'malette-attr-select', '_onAttributeChange' );

      //on theme click handler 
      this._classEventBuilder('click', 'malette-theme-row', '_onThemeRowClick' );
    }

    this._selectOption('malette-attr-select', 'selectedField');

    if ( this.state._isTheme || this.style.visualVariables ) {
      if ( this.style.visualVariables ) {
        this.state.selectedField = this.style.visualVariables[ 0 ].field;
        this._selectOption('malette-attr-select', 'selectedField');
      }
      self.showThemeUI();
    }

  }



  /*
  * Creates UI for graduated symbols; only called if fields exist 
  * @param {String} el   Parent element to append the graduated ui to 
  *
  */
  Malette.prototype._addGraduated = function(el) {
    var select = this._createAttributeSelect();
    var graduatedPaletteContainer = this._createElement('div', el, 'malette-graduated-palette', '', '');

    graduatedPaletteContainer.appendChild( select ).id = 'malette-grad-attr-select';
  }




  /*
  * Creates the size tab UI
  * @param {String} el   Parent element to append the size UI 
  *
  */
  Malette.prototype._constructSizePalette = function(el) {
    var self = this;

    el.innerHTML = '';

    this._createElement('div', el, 'malette-single-size-option', 'Single', 'malette-option-toggle malette-option-toggle-selected');
    if ( this._hasApplicableFields === true ) {
      this._createElement('div', el, 'malette-graduated-size-option', 'Graduated', 'malette-option-toggle');
    } else {
      this._createElement('div', el, 'malette-graduated-size-option', 'Graduated', 'malette-option-toggle disabled');
    }

    var sizePalette = this._createElement('div', el, 'malette-size-palette', '', '');

    var size = this.style.symbol.size || 8; 

    var slider = document.createElement( 'input' );
    slider.type = 'range';
    slider.min = 1;
    slider.max = 30;
    slider.step = 1;
    slider.value = size;
    sizePalette.appendChild( slider ).id = 'malette-size-slider';

    var sizeNumber = this._createElement('div', sizePalette, 'malette-size-number', 'Radius: '+size+'px', '');
    
    //size slide event handler
    this._idEventBuilder('input', 'malette-size-slider', '_onSizeChanged' );

    //show single size event 
    this._idEventBuilder('click', 'malette-single-size-option', 'showSingleSizeUI' );

    if ( this._hasApplicableFields === true ) {
      this._addGraduated(el);

      //change to graduated size event 
      this._idEventBuilder('click', 'malette-graduated-size-option', 'showGraduatedUI' );

      //change grad attr 
      this._idEventBuilder('change', 'malette-grad-attr-select', '_onGradAttributeChange' );
    }

    this._selectOption('malette-grad-attr-select', 'selectedField');
    
    if ( this.state._isGraduated || this.style.classBreakInfos ) {
      if ( this.style.classBreakInfos ) {
        this.state.selectedField = this.style.field;
        this._selectOption('malette-grad-attr-select', 'selectedField');
      }
      self.showGraduatedUI();
    }

  }



  /*
  * Creates the stroke tab UI
  * @param {String} el   Parent element to append the stroke UI 
  *
  */
  Malette.prototype._constructStrokePalette = function(el) {
    var self = this;
    el.innerHTML = '';
    var width = ( this.state.type !== 'line' ) ? this.style.symbol.outline.width : this.style.symbol.width; 
    
    var slider = document.createElement( 'input' );
    slider.type = 'range';
    slider.min = 0.5;
    slider.max = 20;
    slider.step = 0.5;
    slider.value = width;
    el.appendChild( slider ).id = 'malette-stroke-slider';

    var sizeNumber = this._createElement('div', el, 'malette-stroke-width', width+'px', '');
    el.appendChild( sizeNumber );

    if ( this.state.type !== 'line' ) {
      this._addColors( el, this.style.symbol.outline.color );
    }

    //stroke width change event
    this._idEventBuilder('input', 'malette-stroke-slider', '_onStrokeWidthChanged' );

    //Color events 
    this._classEventBuilder('click', 'malette-color-swatch', '_onStrokeColorClick' );

  }




  /*
  * Creates the opacity tab UI
  * @param {String} el   Parent element to append the opacity UI 
  *
  */
  Malette.prototype._constructOpacityPalette = function(el) {
    var self = this;

    el.innerHTML = '';

    var opacity = (this.state.fillOpacity / 255) || 0.7; 

    var slider = document.createElement( 'input' );
    slider.type = 'range';
    slider.min = 0.1;
    slider.max = 1;
    slider.step = 0.1;
    slider.value = opacity;
    el.appendChild( slider ).id = 'malette-opacity-slider';

    var sizeNumber = this._createElement('div', el, 'malette-opacity-number', 'Opacity: '+(opacity * 100)+'%', '');
    el.appendChild( sizeNumber );

    //opacity change event
    this._idEventBuilder('input', 'malette-opacity-slider', '_onOpacityChanged' );
  }




  /*
  * creates a generic element, and appends to 'parent' div 
  * @param {String}   type of HTML element to create 
  * @param {String}   parent element to append created element to 
  * @param {String}   id of newly created element 
  * @param {String}   any text one wishes to append to new element 
  * @param {String}   optional classname for new element 
  */
  Malette.prototype._createElement = function(type, parent, id, html, className ) {

    var el = document.createElement( type ); 
    parent.appendChild( el ).id = id;
    el.innerHTML = html;
    document.getElementById( id ).className = className;

    return el;
  }




  /*
  * Builds a generic attribute select drop down 
  * Requires this.options.fields be defined; 
  *
  */
  Malette.prototype._createAttributeSelect = function() {
    var select = document.createElement('select');
    for (var i = 0; i < this.options.fields.length; i++) { 
      if ( this.options.fields[i].type === 'esriFieldTypeDouble' || this.options.fields[i].type === 'esriFieldTypeInteger' 
        || this.options.fields[i].type === 'esriFieldTypeSingle' || this.options.fields[i].type === 'esriFieldTypeSmallInteger' ) {
        if ( this.options.fields[i].statistics && this.options.fields[i].statistics.max ) {
          var option = document.createElement('option');
          option.setAttribute('value', this.options.fields[i].type);
          option.setAttribute('id', this.options.fields[i].name.replace(/ /g, ''));
          option.appendChild(document.createTextNode(this.options.fields[i].name));
          select.appendChild(option);
        }
      }
    }

    return select;
  }



  /*
  * Programatically select an option in dropdown 
  * @param {String}     id - id of select element 
  * @param {String}     field - value of select option 
  *
  */
  Malette.prototype._selectOption = function(id, field) {
    if ( this.state[ field ] ) {
      var index = 0;
      var x = document.getElementById( id );
      for (var i = 0; i < x.length; i++) {
        if ( x.options[i].text === this.state[ field ].replace(/ /g, '') ) {
          index = x.options[i].index;
        }
      }
      document.getElementById( id ).getElementsByTagName('option')[index].selected = 'selected';
    }
  }



  /*
  * Checks if we can use any of the fields passed in as options 
  *
  *
  */
  Malette.prototype._getApplicableFields = function() {
    var isApplicable = false; 

    if ( this.options.fields ) {
      for (var i = 0; i < this.options.fields.length; i++) { 
        if ( this.options.fields[i].type === 'esriFieldTypeDouble' || this.options.fields[i].type === 'esriFieldTypeInteger' 
          || this.options.fields[i].type === 'esriFieldTypeSingle' || this.options.fields[i].type === 'esriFieldTypeSmallInteger' ) {
          if ( this.options.fields[i].statistics && this.options.fields[i].statistics.max ) {
            isApplicable = true; 
          }
        }
      }
    }

    return isApplicable;
  }



  /*
  * Event builder for classes 
  * @param {String}     eventName, type of event 
  * @param {String}     className, what element class are we binding to
  * @param {String}     fnName, what action (function to call) when event fires 
  *
  */
  Malette.prototype._classEventBuilder = function(eventName, className, fnName ) {
    var self = this; 
    
    var linkEl = document.getElementsByClassName( className );
    for(var i=0;i<linkEl.length;i++){
      if(linkEl[i].addEventListener){
        linkEl[i].addEventListener( eventName , function(e) { self[ fnName ].call(self, e) });
      } else {
        linkEl[i].attachEvent('on'+eventName, function(e) { self[ fnName ].call(self, e) });
      }
    }

  }



  /*
  * Event builder for ids 
  * @param {String}     eventName, type of event 
  * @param {String}     id, what element are we binding to
  * @param {String}     fnName, what action (function to call) when event fires 
  *
  */
  Malette.prototype._idEventBuilder = function(eventName, id, fnName ) {
    var self = this; 
    
    var linkEl = document.getElementById( id );
    if(linkEl.addEventListener){
      linkEl.addEventListener(eventName, function(e) { self[ fnName ].call(self, e) });
    } else {
      linkEl.attachEvent('on'+eventName, function(e) { self[ fnName ].call(self, e) });
    }

  }



  /************* METHODS **************/


  /*
  * Self distruct 
  * Really only called from external resources 
  *
  */
  Malette.prototype.destroy = function() {
    var parent = document.getElementById( this.container ); 
    parent.removeChild( document.getElementById('malette') );
  }




  /*
  * Change tab
  * 
  *
  */
  Malette.prototype.changeTab = function(tab) {
    var el = document.getElementById('malette-content');

    switch(tab) {
      case 'color': 
        this._constructColorRegion(el);
        break;
      case 'size': 
        this._constructSizePalette(el);
        break;
      case 'stroke': 
        this._constructStrokePalette(el);
        break;
      case 'line': 
        this._constructStrokePalette(el);
        break;
      case 'opacity': 
        this._constructOpacityPalette(el);
        break;
      default: 
        this._constructColorRegion(el);
    }

    if ( this.options.exportStyle ) {
      this._addExporter();
    }
  }




  /*
  * Classify function 
  * Only thing supported right now is equal interval 
  *
  *
  */
  Malette.prototype.classify = function(field){

    var fields = this.options.fields;
    var breaks = 8; 
    var values = [];

    fields.forEach(function(f) {
      if ( f.name === field ) {
        var step = ( f.statistics.max - f.statistics.min ) / breaks;
        for (var i = 0; i<=breaks; i++ ) {
          values.push( f.statistics.min + (step * i) );
        }
      }
    });

    return values;
  };





  /*
  * Sets thematic styles 
  * @param {Array} ramp     (optional) color ramp 
  * @param {String} field     Field being styled 
  *
  */
  Malette.prototype.setTheme = function(ramp, field) {
    var self = this;

    this.state.selectedField = ( field ) ? field : this.state.selectedField; 
    
    //default theme map 
    if ( !ramp && !this.selectedRamp ) {
      ramp = [[255,247,251, this.state.fillOpacity],[236,226,240, this.state.fillOpacity],
        [208,209,230, this.state.fillOpacity],[166,189,219, this.state.fillOpacity],[103,169,207, this.state.fillOpacity],
        [54,144,192, this.state.fillOpacity],[2,129,138,130],[1,100,80, this.state.fillOpacity]];
    } else if ( !ramp && this.selectedRamp ) {
      ramp = this.selectedRamp;
    }
    
    this.selectedRamp = (ramp) ? ramp : this.selectedRamp;

    //set opacity on ramp colors
    this.selectedRamp.forEach(function(color, i) {
      self.selectedRamp[ i ][ 3 ] = self.state.fillOpacity;
    });
    
    var values = this.classify( this.state.selectedField );
    
    this.style.visualVariables = [
      { 
        "type": "colorInfo",
        "field": this.state.selectedField,
        "stops":  [
            {
              "value": values[0],
              "color": this.selectedRamp[0],
              "label": null
            },
            {
              "value": values[1],
              "color": this.selectedRamp[1],
              "label": null
            },
            {
              "value": values[2],
              "color": this.selectedRamp[2],
              "label": null
            },
            {
              "value": values[3],
              "color": this.selectedRamp[3],
              "label": null
            },
            {
              "value": values[4],
              "color": this.selectedRamp[4],
              "label": null
            },
            {
              "value": values[5],
              "color": this.selectedRamp[5],
              "label": null
            },
            {
              "value": values[6],
              "color": this.selectedRamp[6],
              "label": null
            },
            {
              "value": values[7],
              "color": this.selectedRamp[7],
              "label": null
            }
        ]
      }
    ]
    this.updateStyle();
  }




  /*
  * Sets graduated styles 
  * @param {String} field     Field being styled 
  *
  *
  */
  Malette.prototype.setGraduated = function(field) {
    
    this.state.selectedField = ( field ) ? field : this.state.selectedField;

    var values = this.classify( this.state.selectedField );

    this.style.type = "classBreaks";
    this.style.field = this.state.selectedField;
    this.style.minValue = 1;
    this.style.classBreakInfos = [
      {
        "symbol": {
          "color": this._rgbaToDojoColor(this.style.symbol.color),
          "size": 4,
          "xoffset": 0,
          "yoffset": 0,
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "outline": {
            "color": this._rgbaToDojoColor(this.style.symbol.outline.color),
            "width": this.style.symbol.outline.width,
            "type": "esriSLS",
            "style": "esriSLSSolid"
          }
        },
        "label": values[0],
        "classMaxValue": values[0]
      },
      {
        "symbol": {
          "color": this._rgbaToDojoColor(this.style.symbol.color),
          "size": 10,
          "xoffset": 0,
          "yoffset": 0,
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "outline": {
            "color": this._rgbaToDojoColor(this.style.symbol.outline.color),
            "width": this.style.symbol.outline.width,
            "type": "esriSLS",
            "style": "esriSLSSolid"
          }
        },
        "label": "> "+values[0]+" to "+values[1],
        "classMaxValue": values[1]
      },
      {
       "symbol": {
          "color": this._rgbaToDojoColor(this.style.symbol.color),
          "size": 16,
          "xoffset": 0,
          "yoffset": 0,
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "outline": {
            "color": this._rgbaToDojoColor(this.style.symbol.outline.color),
            "width": this.style.symbol.outline.width,
            "type": "esriSLS",
            "style": "esriSLSSolid"
          }
        },
        "label": "> "+values[1]+" to "+values[2],
        "classMaxValue": values[2]
      },
      {
        "symbol": {
          "color": this._rgbaToDojoColor(this.style.symbol.color),
          "size": 22,
          "xoffset": 0,
          "yoffset": 0,
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "outline": {
            "color": this._rgbaToDojoColor(this.style.symbol.outline.color),
            "width": this.style.symbol.outline.width,
            "type": "esriSLS",
            "style": "esriSLSSolid"
          }
        },
        "label": "> "+values[2]+" to "+values[3],
        "classMaxValue": values[3]
      },
      {
        "symbol": {
          "color": this._rgbaToDojoColor(this.style.symbol.color),
          "size": 30,
          "xoffset": 0,
          "yoffset": 0,
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "outline": {
            "color": this._rgbaToDojoColor(this.style.symbol.outline.color),
            "width": this.style.symbol.outline.width,
            "type": "esriSLS",
            "style": "esriSLSSolid"
          }
        },
        "label": "> "+values[3]+" to "+values[4],
        "classMaxValue": values[4]
      }
    ]

    this.updateStyle();
  }



  /*
  * Set to single, remove and destroy theme 
  *
  *
  */
  Malette.prototype.clearTheme = function() {
    this.style.visualVariables = null;
    this.updateStyle();
  }




  /*
  *
  * Clear graduated styles 
  *
  */
  Malette.prototype.clearGraduated = function() {
    this.style.type = "simple";
    this.style.field = null;
    this.style.minValue = 1;
    this.style.classBreakInfos = null;
    this.updateStyle();
  }




  /*
  * Crazy UI handlers 
  *
  */
  Malette.prototype.showThemeUI = function() {
    document.getElementById('malette-theme-palette').style.display = 'block';
    document.getElementById('malette-color-palette').style.display = 'none';
    document.getElementById('malette-single-color-option').className = 'malette-option-toggle';
    document.getElementById('malette-theme-color-option').className = 'malette-option-toggle malette-option-toggle-selected';
    this.state._isTheme = true;

    var index = document.getElementById('malette-attr-select').selectedIndex;
    var field = document.getElementById('malette-attr-select')[index].innerHTML;
    
    this.setTheme(null, field);
  }


  Malette.prototype.showSingleColorUI = function() {
    document.getElementById('malette-theme-palette').style.display = 'none';
    document.getElementById('malette-color-palette').style.display = 'block';
    document.getElementById('malette-single-color-option').className = 'malette-option-toggle malette-option-toggle-selected';
    document.getElementById('malette-theme-color-option').className = 'malette-option-toggle';
    this.state._isTheme = false;
    this.clearTheme();
  }


  Malette.prototype.showGraduatedUI = function() {
    document.getElementById('malette-graduated-palette').style.display = 'block';
    document.getElementById('malette-size-palette').style.display = 'none';
    document.getElementById('malette-single-size-option').className = 'malette-option-toggle';
    document.getElementById('malette-graduated-size-option').className = 'malette-option-toggle malette-option-toggle-selected';
    this.state._isGraduated = true;

    var index = document.getElementById('malette-grad-attr-select').selectedIndex;
    var field = document.getElementById('malette-grad-attr-select')[index].innerHTML;

    this.setGraduated(field);
  }


  Malette.prototype.showSingleSizeUI = function() {
    document.getElementById('malette-graduated-palette').style.display = 'none';
    document.getElementById('malette-size-palette').style.display = 'block';
    document.getElementById('malette-single-size-option').className = 'malette-option-toggle malette-option-toggle-selected';
    document.getElementById('malette-graduated-size-option').className = 'malette-option-toggle';
    this.state._isGraduated = false;
    this.clearGraduated();
  }


  Malette.prototype.toggleExportUI = function(e) {
    if ( e.target.checked === true ) {
      document.getElementById("malette-export-container").style.visibility = "visible";
      document.getElementById('malette-export-toggle-text').innerHTML = 'Hide JSON';
      this._isShowJson = true;
    } else {
      document.getElementById("malette-export-container").style.visibility = "hidden";
      document.getElementById('malette-export-toggle-text').innerHTML = 'Show JSON';
      this._isShowJson = false;
    }
  }





  /*
  * Logic for toggling the export type in the Export UI 
  *
  *
  */
  Malette.prototype.changeExportType = function(e) {

    var checkbox = document.getElementsByClassName( 'export-type-toggle' );
    for(var i=0;i<checkbox.length;i++){
      document.getElementsByClassName( 'export-type-toggle' )[i].checked = false;
    }
    e.target.checked = true;

    var id = e.target.id;
    if ( id === 'malette-export-esri-toggle' ) {
      this.selectedExportType = 'esri-json';
      this._generateExportStyle('esri-json');
    } else if ( id === 'malette-export-css-toggle' ) {
      this.selectedExportType = 'css';
      this._generateExportStyle('css');
    }

  }



  /*
  * Sets the selected color 
  *
  *
  */
  Malette.prototype.setSelectedColor = function(color) {

    this.style.symbol.color = color;
    var swatch = document.getElementById( 'malette-selected-swatch' );
    swatch.style.backgroundColor = this.style.symbol.color;

    if ( this.state._isGraduated ) {
      this.setGraduated();
    } else {
      this.updateStyle();
    }
  }


  Malette.prototype.setSelectedThemeRow = function(e) {
    var self = this;
    var index = parseInt(e.target.id.replace(/malette-theme-row-/g, ''));
    var ramp = [];

    this.themeColors[ index ].forEach(function(color) {
      var c = self._rgbaToDojoColor(color);
      ramp.push(c);
    });

    this.setTheme(ramp);
  }


  Malette.prototype.setSelectedStrokeColor = function(color) {

    this.style.symbol.outline.color = color;
    var swatch = document.getElementById( 'malette-selected-swatch' );
    swatch.style.backgroundColor = this.style.symbol.outline.color;

    if ( this.state._isGraduated ) {
      this.setGraduated();
    } else {
      this.updateStyle();
    }
  }


  Malette.prototype.setSelectedSize = function(size) {
    this.style.symbol.size = parseInt(size);
    var el = document.getElementById( 'malette-size-number' );
    this._setInnerHTML(el, 'Radius: ' + size + 'px');
    this.updateStyle();
  }



  Malette.prototype.setStrokeWidth = function(width) {
    if ( this.state.type !== 'line' ) {
      this.style.symbol.outline.width = parseFloat(width);
    } else {
      this.style.symbol.width = parseFloat(width);
    }

    var el = document.getElementById( 'malette-stroke-width' );
    this._setInnerHTML(el, width + 'px');
    
    if ( this.state._isGraduated ) {
      this.setGraduated();
    } else {
      this.updateStyle();
    }

    if ( this.state._isTheme ) {
      this.setTheme();
    } else {
      this.updateStyle();
    }
  }


  Malette.prototype.setOpacity = function(opacity) {
    this.state.fillOpacity = parseFloat(opacity) * 255;
    var el = document.getElementById( 'malette-opacity-number' );
    this._setInnerHTML(el, 'Opacity: ' + (opacity*100) + '%');

    if ( this.state._isGraduated ) {
      this.setGraduated();
    } else if ( this.state._isTheme ) {
      this.setTheme();
    } else {
      this.updateStyle();
    }
  }



  Malette.prototype._setInnerHTML = function(el, html) {
    el.innerHTML = html;
  }



  Malette.prototype._setRamp = function() {
    if ( !this.selectedRamp ) this.selectedRamp = [];
    var self = this;

    this.style.visualVariables[0].stops.forEach(function(stop) {
      var color = stop.color;
      self.selectedRamp.push(color);
    });
  }



  //helpers 
  Malette.prototype._dojoColorToRgba = function(c) {
    var color = 'rgba('+c[0]+','+c[1]+','+c[2]+','+c[3]+')';
    return color;
  }


  Malette.prototype._rgbaToDojoColor = function(c, opacity) {
    var color;
    if ( !opacity ) opacity = 255;

    if ( Array.isArray(c) ) {
      color = c;
      color[3] = opacity;
      return color;
    } else {
      var color = c.split(',');
      return [ parseInt(color[0].replace(/[^0-9]/g, '')), parseInt(color[1]), parseInt(color[2]), opacity ];
    }
  }


  /*
  * Convert various style inputs to esri-json which is used in Malette 
  * 
  *
  */ 
  Malette.prototype._toEsriJson = function() {

    if ( this.format === 'css' ) {
      this.style = {
        type: 'simple',
        symbol: {}
      };
      this.style.symbol.color = (this.options.style.fillColor) ? this.options.style.fillColor : 'rgba(202,58,45,130)';
      this.style.symbol.size = ( this.options.style.radius ) ? this.options.style.radius : 8;

      if ( this.state.type !== 'line' ) {
        this.style.symbol.outline = {};
        this.style.symbol.outline.width = this.options.style.weight || 1; 
        this.style.symbol.outline.color = [ this.options.style.color ] || 'rgba(255,255,255,255';
      }

      this.state.fillOpacity = ( this.options.style.fillOpacity ) ? (this.options.style.fillOpacity * 255) : 255;
    }

  }


  /*
  * Convert esri-json to CSS 
  * 
  *
  */ 
  Malette.prototype._toCss = function(callback) {

    var css = {};
    css.fillColor = this.style.symbol.color;

    if ( this.state.type !== 'line' ) {
      css.weight = this.style.symbol.outline.width;
      css.color = this.style.symbol.outline.color;
      css.radius = this.style.symbol.size;
    }

    css.fillOpacity = this.state.fillOpacity / 255;

    callback(css);

  }



  /*
  * Master style object
  * Updates and emits 
  *
  */
  Malette.prototype.updateStyle = function() {
    var self = this; 

    if ( this.exportFormat === 'esri-json' ) {

      if ( this.style.symbol ) {
        this.style.symbol.color = this._rgbaToDojoColor( this.style.symbol.color, this.state.fillOpacity ); //change colors BACK to dojo :(
        if ( this.state.type !== 'line' ) {
          this.style.symbol.outline.color = this._rgbaToDojoColor( this.style.symbol.outline.color );
        }
      }

      this.style.layerId = this.state.layerId;
      this.style.defaultSymbol = this.style.symbol;
      console.log('emit --->>>', this.style);
      this.emit( 'style-change', this.style);
    } else {

      if ( this.exportFormat === 'css' ) {
        this._toCss(function(css) {
          css.layerId = self.state.layerId;
          css.defaultSymbol = css.symbol;
          self.emit( 'style-change', css );
        });
      }

    }

    this._generateExportStyle();

  }




  Malette.prototype._generateExportStyle = function(type) {
    //codeBox.innerHTML = JSON.stringify(this.style, null, 2);
    type = type || this.selectedExportType; 

    if ( type === 'esri-json' ) {

      this.style.symbol.color = this._rgbaToDojoColor( this.style.symbol.color, this.state.fillOpacity ); //change colors BACK to dojo :(

      if ( this.state.type !== 'line' ) {
        this.style.symbol.outline.color = this._rgbaToDojoColor( this.style.symbol.outline.color );
      }

      document.getElementById('export-code-block').innerHTML = JSON.stringify(this.style, null, 2);
    } else {

      if ( type === 'css' ) {
        this._toCss(function(css) {
          document.getElementById('export-code-block').innerHTML = JSON.stringify(css, null, 2);
        });
      }

    }
  }



  /************* EVENTS **************/


  /*
  * Register Malette events 
  * 
  */
  Malette.prototype.on = function(eventName, handler){
    this._handlers[ eventName ] = handler; 
  };


  // trigger callback 
  Malette.prototype.emit = function(eventName, val) {
    if (this._handlers[ eventName ]){
      this._handlers[ eventName ](val);
    }
  };


  Malette.prototype._onColorClick = function(e) {
    if( e.which === 1 && !(e.metaKey || e.ctrlKey)){
      e.preventDefault();
      this.setSelectedColor(e.target.style.backgroundColor);
    }
  };


  Malette.prototype._onThemeRowClick = function(e) {
    e.preventDefault();
    this.setSelectedThemeRow(e);
  };


  Malette.prototype._onAttributeChange = function(e) {
    var index = document.getElementById('malette-attr-select').selectedIndex;
    var field = document.getElementById('malette-attr-select')[index].innerHTML;
    this.state.selectedField = field;
    this.setTheme(null, field);

    if ( this.state._isGraduated ) {
      this.setGraduated(field);
    }
  }

  Malette.prototype._onGradAttributeChange = function(e) {
    var index = document.getElementById('malette-grad-attr-select').selectedIndex;
    var field = document.getElementById('malette-grad-attr-select')[index].innerHTML;
    this.state.selectedField = field;
    this.setGraduated(field);

    if ( this.state._isTheme ) {
      this.setTheme(null, field);
    }
  }

  Malette.prototype._onStrokeColorClick = function(e) {
    if( e.which === 1 && !(e.metaKey || e.ctrlKey)){
      e.preventDefault();
      this.setSelectedStrokeColor(e.target.style.backgroundColor);
    }
  };


  Malette.prototype._onSizeChanged = function(e) {
    e.preventDefault();
    this.setSelectedSize(e.target.value);
  };


  Malette.prototype._onStrokeWidthChanged = function(e) {
    e.preventDefault();
    this.setStrokeWidth(e.target.value);
  };


  Malette.prototype._onOpacityChanged = function(e) {
    e.preventDefault();
    this.setOpacity(e.target.value);
  };


  Malette.prototype._onToggleExportUI = function(e) {
    this.toggleExportUI(e);
  }


  Malette.prototype._onExportTypeChange = function(e) {
    //e.preventDefault();
    this.changeExportType(e);
  }


  Malette.prototype._onTabClick = function(e) {
    
    if ( e.target.classList.contains('disabled') ) {
      return;
    }

    if( e.which === 1 && !(e.metaKey || e.ctrlKey)){
      e.preventDefault();

      var els = document.getElementsByClassName( 'malette-tab' );
      for(var i=0;i<els.length;i++){
        els[i].classList.remove( 'malette-tab-selected' );
      }
      e.target.classList.add('malette-tab-selected');

      this.changeTab(e.target.innerHTML);
    }

  };


  window.Malette = Malette;

})(window);