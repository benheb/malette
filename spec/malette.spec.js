'use strict';

import { Malette } from '../src/malette';

describe('Malette... ', function(){
  var malette, url = null, options = null, json, fields;

  beforeEach(function () {
    // inject the HTML fixture for the tests
    var fixture = '<div id="container-element"></div>';
    document.body.insertAdjacentHTML('afterbegin', fixture);

    spyOn(Malette.prototype, '_buildUI').and.callFake(function(){});
    spyOn(Malette.prototype, '_addExporter').and.callFake(function(){});
  
    json = {
      "type": "simple",
      "label": "",
      "description": "",
      "symbol": {
        "color": [
          158,
          188,
          218,
          191
        ],
        "size": 3,
        "angle": 0,
        "xoffset": 0,
        "yoffset": 0,
        "type": "esriSMS",
        "style": "esriSMSCircle",
        "outline": {
          "color": [
            255,
            255,
            255,
            255
          ],
          "width": 0.2,
          "type": "esriSLS",
          "style": "esriSLSSolid"
        }
      }
    };

    fields = [
      {
        alias: 'testField',
        name: 'testField',
        statistics: {
          avg: 100,
          min: 10,
          max: 500,
          stddev: 1.2
        },
        type: 'esriFieldTypeDouble'
      }
    ];

    options = {
      style: json,
      formatIn: 'esri-json',
      formatOut: 'esri-json',
      fields: fields,
      type: 'point',
      exportStyle: true
    };

    malette = new Malette('container-element', options);

  });

  // remove the html fixture from the DOM
  afterEach(function() {
    document.body.removeChild(document.getElementById('container-element'));
  });

  it('container to equal', function(){
    expect(malette.container).toBe('container-element');
  });

  it('build UI should be called', function() {
    expect(malette._buildUI).toHaveBeenCalled();
  });

  it('build exporter should be called', function() {
    expect(malette._addExporter).toHaveBeenCalled();
  });

  it('state graduated to be false', function(){
    expect(malette.state._isGraduated).toBe(false);
  });

  it('state theme to be false', function(){
    expect(malette.state._isTheme).toBe(false);
  });

  it('state type to be point', function(){
    expect(malette.state.type).toBe('point');
  });

  it('set opacity', function() {
    spyOn(Malette.prototype, 'updateStyle').and.callFake(function(){});
    spyOn(Malette.prototype, '_setInnerHTML').and.callFake(function(){});
    
    malette.setOpacity(0.5);
    expect(malette.state.fillOpacity).toEqual( 127.5 );
  });

  it('set stroke width', function() {
    spyOn(Malette.prototype, 'updateStyle').and.callFake(function(){});
    spyOn(Malette.prototype, '_setInnerHTML').and.callFake(function(){});
    
    malette.setStrokeWidth( 5 );
    expect(malette.style.symbol.outline.width).toEqual( 5 );
  });

  it('set size', function() {
    spyOn(Malette.prototype, 'updateStyle').and.callFake(function(){});
    spyOn(Malette.prototype, '_setInnerHTML').and.callFake(function(){});
    
    malette.setSelectedSize( 5 );
    expect(malette.style.symbol.size).toEqual( 5 );
  });

  it('clear graduated symbol', function() {
    spyOn(Malette.prototype, 'updateStyle').and.callFake(function(){});
    spyOn(Malette.prototype, '_setInnerHTML').and.callFake(function(){});
    
    malette.clearGraduated();
    expect(malette.style.classBreakInfos).toEqual( null );
    expect(malette.updateStyle).toHaveBeenCalled();
  });

  it('clear themes', function() {
    spyOn(Malette.prototype, 'updateStyle').and.callFake(function(){});
    spyOn(Malette.prototype, '_setInnerHTML').and.callFake(function(){});
    
    malette.clearTheme();
    expect(malette.style.visualVariables).toEqual( null );
    expect(malette.updateStyle).toHaveBeenCalled();
  });

});
