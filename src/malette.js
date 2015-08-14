//! malette.js
//! version : 1.00
//!license : MIT 

import { dojoColorToRgba, rgbaToDojoColor, themeColors, colorSwatches } from './colors.js';
import { classify } from './classify.js';
import { stringToDom } from './string-to-dom.js';

//class Malette extends HTMLElement {
class Malette {
  // constructor(el) {
  //   this.el = el;
  //   //...
  // }

  constructor (container, options) {
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
        this.style.symbol.color = dojoColorToRgba( this.style.symbol.color ); //helper for colors, etc\

        if ( this.state.type !== 'line' ) {
          this.style.symbol.outline.color = dojoColorToRgba( this.style.symbol.outline.color );
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
  }

  _buildUI () {
    var template = `
      <div id='malette'>
        <div id="malette-header">Malette</div>
        <div id='malette-content'></div>
      </div>
    `;
    
    var container = document.getElementById( this.container );
    
    container.appendChild(stringToDom(template));

    var innerContainer = document.getElementById( 'malette' );
    var content = document.getElementById( 'malette-content' );

    if ( this.options.title ) {
      header = document.createElement( 'div' );
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
  _addTabs (el) {
    var self = this;

    var disabled = ( this.state.type === 'point' ) ? '' : 'disabled';
    var stroke = ( this.state.type !== 'line' ) ? 'stroke' : 'line';

    var template = `
      <div id='malette-tab-region'>
        <div id='malette-color-tab' class='malette-tab malette-tab-selected'>color</div>
        <div id='malette-size-tab' class='malette-tab ${disabled}'>size</div>
        <div id='malette-stroke-tab' class='malette-tab'>${stroke}</div>
        <div id='malette-opacity-tab' class='malette-tab'>opacity</div>
      </div>
    `;
    el.appendChild(stringToDom(template));

    //toggle the tabs!! 
    this._classEventBuilder('click', 'malette-tab', '_onTabClick' );
  }

  /*
  * Exporter UI 
  * 
  *
  */
  _addExporter () {
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
    css.checked = (this.exportFormat === 'css');
    this._createElement('span', header, 'css-out-toggle', 'CSS', 'malette-export-label');

    var esriRenderer = this._createElement('input', header, 'malette-export-esri-toggle', '', 'export-type-toggle');
    esriRenderer.type = 'checkbox';
    esriRenderer.checked = (this.exportFormat === 'esri-json');
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
  _addColors (el, selectedColor) {
    var swatch;
    var colors = colorSwatches; 

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
  _addThemes (el) {
    var self = this;
    var swatch;

    var select = this._createAttributeSelect('malette-attr-select');

    this.themeColors = themeColors;

    var template = `
      <div id='malette-theme-palette'>
        <div id='malette-theme-palette-inner'></div>
      </div>
    `;
    el.appendChild(stringToDom(template));

    var palette = document.getElementById( 'malette-theme-palette');
    var colorPalette = document.getElementById( 'malette-theme-palette-inner' );

    palette.insertBefore(select, colorPalette);

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
  _constructColorRegion (el) {
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
  _addGraduated (el) {
    var select = this._createAttributeSelect();
    var graduatedPaletteContainer = this._createElement('div', el, 'malette-graduated-palette', '', '');

    graduatedPaletteContainer.appendChild( select ).id = 'malette-grad-attr-select';
  }

  /*
  * Creates the size tab UI
  * @param {String} el   Parent element to append the size UI 
  *
  */
  _constructSizePalette (el) {
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
  _constructStrokePalette (el) {
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
  _constructOpacityPalette (el) {
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
  _createElement (type, parent, id, html, className ) {
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
  _createAttributeSelect (id) {
    var select = document.createElement('select');
    if ( id ) select.id = id;

    for (var i = 0; i < this.options.fields.length; i++) { 
      if ( this.options.fields[i].type === 'esriFieldTypeDouble' || this.options.fields[i].type === 'esriFieldTypeInteger' || this.options.fields[i].type === 'esriFieldTypeSingle' || this.options.fields[i].type === 'esriFieldTypeSmallInteger' ) {
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
  _selectOption (id, field) {
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
  _getApplicableFields () {
    var isApplicable = false; 

    if ( this.options.fields ) {
      for (var i = 0; i < this.options.fields.length; i++) { 
        if ( this.options.fields[i].type === 'esriFieldTypeDouble' || this.options.fields[i].type === 'esriFieldTypeInteger' || this.options.fields[i].type === 'esriFieldTypeSingle' || this.options.fields[i].type === 'esriFieldTypeSmallInteger' ) {
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
  _classEventBuilder (eventName, className, fnName ) {
    var self = this; 
    
    var linkEl = document.getElementsByClassName( className );
    for(var i=0;i<linkEl.length;i++){
      if(linkEl[i].addEventListener){
        linkEl[i].addEventListener( eventName , function(e) { self[ fnName ].call(self, e); });
      } else {
        linkEl[i].attachEvent('on'+eventName, function(e) { self[ fnName ].call(self, e); });
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
  _idEventBuilder (eventName, id, fnName ) {
    var self = this; 
    
    var linkEl = document.getElementById( id );
    if(linkEl.addEventListener){
      linkEl.addEventListener(eventName, function(e) { self[ fnName ].call(self, e); });
    } else {
      linkEl.attachEvent('on'+eventName, function(e) { self[ fnName ].call(self, e); });
    }
  }

  /************* METHODS **************/

  /*
  * Self distruct 
  * Really only called from external resources 
  *
  */
  destroy () {
    var parent = document.getElementById( this.container ); 
    parent.removeChild( document.getElementById('malette') );
  }

  /*
  * Change tab
  * 
  *
  */
  changeTab (tab) {
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
  * Sets thematic styles 
  * @param {Array} ramp     (optional) color ramp 
  * @param {String} field     Field being styled 
  *
  */
  setTheme (ramp, field) {
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
    
    var values = classify( this.state.selectedField, this.options.fields );
    
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
    ];
    this.updateStyle();
  }

  /*
  * Sets graduated styles 
  * @param {String} field     Field being styled 
  *
  *
  */
  setGraduated (field) {
    this.state.selectedField = ( field ) ? field : this.state.selectedField;

    var values = classify( this.state.selectedField, this.options.fields );

    this.style.type = "classBreaks";
    this.style.field = this.state.selectedField;
    this.style.minValue = 1;
    this.style.classBreakInfos = [
      {
        "symbol": {
          "color": rgbaToDojoColor(this.style.symbol.color),
          "size": 4,
          "xoffset": 0,
          "yoffset": 0,
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "outline": {
            "color": rgbaToDojoColor(this.style.symbol.outline.color),
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
          "color": rgbaToDojoColor(this.style.symbol.color),
          "size": 10,
          "xoffset": 0,
          "yoffset": 0,
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "outline": {
            "color": rgbaToDojoColor(this.style.symbol.outline.color),
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
          "color": rgbaToDojoColor(this.style.symbol.color),
          "size": 16,
          "xoffset": 0,
          "yoffset": 0,
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "outline": {
            "color": rgbaToDojoColor(this.style.symbol.outline.color),
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
          "color": rgbaToDojoColor(this.style.symbol.color),
          "size": 22,
          "xoffset": 0,
          "yoffset": 0,
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "outline": {
            "color": rgbaToDojoColor(this.style.symbol.outline.color),
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
          "color": rgbaToDojoColor(this.style.symbol.color),
          "size": 30,
          "xoffset": 0,
          "yoffset": 0,
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "outline": {
            "color": rgbaToDojoColor(this.style.symbol.outline.color),
            "width": this.style.symbol.outline.width,
            "type": "esriSLS",
            "style": "esriSLSSolid"
          }
        },
        "label": "> "+values[3]+" to "+values[4],
        "classMaxValue": values[4]
      }
    ];

    this.updateStyle();
  }

  /*
  * Set to single, remove and destroy theme 
  *
  *
  */
  clearTheme () {
    this.style.visualVariables = null;
    this.updateStyle();
  }

  /*
  *
  * Clear graduated styles 
  *
  */
  clearGraduated () {
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
  showThemeUI () {
    document.getElementById('malette-theme-palette').style.display = 'block';
    document.getElementById('malette-color-palette').style.display = 'none';
    document.getElementById('malette-single-color-option').className = 'malette-option-toggle';
    document.getElementById('malette-theme-color-option').className = 'malette-option-toggle malette-option-toggle-selected';
    this.state._isTheme = true;

    var index = document.getElementById('malette-attr-select').selectedIndex;
    var field = document.getElementById('malette-attr-select')[index].innerHTML;
    
    this.setTheme(null, field);
  }

  showSingleColorUI () {
    document.getElementById('malette-theme-palette').style.display = 'none';
    document.getElementById('malette-color-palette').style.display = 'block';
    document.getElementById('malette-single-color-option').className = 'malette-option-toggle malette-option-toggle-selected';
    document.getElementById('malette-theme-color-option').className = 'malette-option-toggle';
    this.state._isTheme = false;
    this.clearTheme();
  }

  showGraduatedUI () {
    document.getElementById('malette-graduated-palette').style.display = 'block';
    document.getElementById('malette-size-palette').style.display = 'none';
    document.getElementById('malette-single-size-option').className = 'malette-option-toggle';
    document.getElementById('malette-graduated-size-option').className = 'malette-option-toggle malette-option-toggle-selected';
    this.state._isGraduated = true;

    var index = document.getElementById('malette-grad-attr-select').selectedIndex;
    var field = document.getElementById('malette-grad-attr-select')[index].innerHTML;

    this.setGraduated(field);
  }

  showSingleSizeUI () {
    document.getElementById('malette-graduated-palette').style.display = 'none';
    document.getElementById('malette-size-palette').style.display = 'block';
    document.getElementById('malette-single-size-option').className = 'malette-option-toggle malette-option-toggle-selected';
    document.getElementById('malette-graduated-size-option').className = 'malette-option-toggle';
    this.state._isGraduated = false;
    this.clearGraduated();
  }

  toggleExportUI (e) {
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
  changeExportType (e) {

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
  setSelectedColor (color) {
    this.style.symbol.color = color;
    var swatch = document.getElementById( 'malette-selected-swatch' );
    swatch.style.backgroundColor = this.style.symbol.color;

    if ( this.state._isGraduated ) {
      this.setGraduated();
    } else {
      this.updateStyle();
    }
  }

  setSelectedThemeRow (e) {
    var self = this;
    var index = parseInt(e.target.id.replace(/malette-theme-row-/g, ''));
    var ramp = [];

    this.themeColors[ index ].forEach(function(color) {
      var c = rgbaToDojoColor(color);
      ramp.push(c);
    });

    this.setTheme(ramp);
  }

  setSelectedStrokeColor (color) {
    this.style.symbol.outline.color = color;
    var swatch = document.getElementById( 'malette-selected-swatch' );
    swatch.style.backgroundColor = this.style.symbol.outline.color;

    if ( this.state._isGraduated ) {
      this.setGraduated();
    } else {
      this.updateStyle();
    }
  }

  setSelectedSize (size) {
    this.style.symbol.size = parseInt(size);
    var el = document.getElementById( 'malette-size-number' );
    this._setInnerHTML(el, 'Radius: ' + size + 'px');
    this.updateStyle();
  }

  setStrokeWidth (width) {
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

  setOpacity (opacity) {
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

  _setInnerHTML (el, html) {
    el.innerHTML = html;
  }

  _setRamp () {
    if ( !this.selectedRamp ) this.selectedRamp = [];
    var self = this;

    this.style.visualVariables[0].stops.forEach(function(stop) {
      var color = stop.color;
      self.selectedRamp.push(color);
    });
  }


  /*
  * Convert various style inputs to esri-json which is used in Malette 
  * 
  *
  */ 
  _toEsriJson () {
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
  _toCss (callback) {
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
  updateStyle () {
    var self = this; 

    if ( this.exportFormat === 'esri-json' ) {

      if ( this.style.symbol ) {
        this.style.symbol.color = rgbaToDojoColor( this.style.symbol.color, this.state.fillOpacity ); //change colors BACK to dojo :(
        if ( this.state.type !== 'line' ) {
          this.style.symbol.outline.color = rgbaToDojoColor( this.style.symbol.outline.color );
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

  _generateExportStyle (type) {
    //codeBox.innerHTML = JSON.stringify(this.style, null, 2);
    type = type || this.selectedExportType; 

    if ( type === 'esri-json' ) {

      this.style.symbol.color = rgbaToDojoColor( this.style.symbol.color, this.state.fillOpacity ); //change colors BACK to dojo :(

      if ( this.state.type !== 'line' ) {
        this.style.symbol.outline.color = rgbaToDojoColor( this.style.symbol.outline.color );
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
  on (eventName, handler){
    this._handlers[ eventName ] = handler; 
  }

  // trigger callback 
  emit (eventName, val) {
    if (this._handlers[ eventName ]){
      this._handlers[ eventName ](val);
    }
  }

  _onColorClick (e) {
    if( e.which === 1 && !(e.metaKey || e.ctrlKey)){
      e.preventDefault();
      this.setSelectedColor(e.target.style.backgroundColor);
    }
  }

  _onThemeRowClick (e) {
    e.preventDefault();
    this.setSelectedThemeRow(e);
  }

  _onAttributeChange (e) {
    var index = document.getElementById('malette-attr-select').selectedIndex;
    var field = document.getElementById('malette-attr-select')[index].innerHTML;
    this.state.selectedField = field;
    this.setTheme(null, field);

    if ( this.state._isGraduated ) {
      this.setGraduated(field);
    }
  }

  _onGradAttributeChange (e) {
    var index = document.getElementById('malette-grad-attr-select').selectedIndex;
    var field = document.getElementById('malette-grad-attr-select')[index].innerHTML;
    this.state.selectedField = field;
    this.setGraduated(field);

    if ( this.state._isTheme ) {
      this.setTheme(null, field);
    }
  }

  _onStrokeColorClick (e) {
    if( e.which === 1 && !(e.metaKey || e.ctrlKey)){
      e.preventDefault();
      this.setSelectedStrokeColor(e.target.style.backgroundColor);
    }
  }

  _onSizeChanged (e) {
    e.preventDefault();
    this.setSelectedSize(e.target.value);
  }

  _onStrokeWidthChanged (e) {
    e.preventDefault();
    this.setStrokeWidth(e.target.value);
  }

  _onOpacityChanged (e) {
    e.preventDefault();
    this.setOpacity(e.target.value);
  }

  _onToggleExportUI (e) {
    this.toggleExportUI(e);
  }

  _onExportTypeChange (e) {
    //e.preventDefault();
    this.changeExportType(e);
  }

  _onTabClick (e) {
    
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
  }
}

//document.registerElement('filtering-search-bar', FilteringSearchBar);
