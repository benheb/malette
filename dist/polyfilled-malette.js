(function(e,t,n,r){"use strict";function rt(e,t){for(var n=0,r=e.length;n<r;n++)dt(e[n],t)}function it(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],nt(r,b[ot(r)])}function st(e){return function(t){j(t)&&(dt(t,e),rt(t.querySelectorAll(w),e))}}function ot(e){var t=e.getAttribute("is"),n=e.nodeName.toUpperCase(),r=S.call(y,t?v+t.toUpperCase():d+n);return t&&-1<r&&!ut(n,t)?-1:r}function ut(e,t){return-1<w.indexOf(e+'[is="'+t+'"]')}function at(e){var t=e.currentTarget,n=e.attrChange,r=e.prevValue,i=e.newValue;Q&&t.attributeChangedCallback&&e.attrName!=="style"&&t.attributeChangedCallback(e.attrName,n===e[a]?null:r,n===e[l]?null:i)}function ft(e){var t=st(e);return function(e){X.push(t,e.target)}}function lt(e){K&&(K=!1,e.currentTarget.removeEventListener(h,lt)),rt((e.target||t).querySelectorAll(w),e.detail===o?o:s),B&&pt()}function ct(e,t){var n=this;q.call(n,e,t),G.call(n,{target:n})}function ht(e,t){D(e,t),et?et.observe(e,z):(J&&(e.setAttribute=ct,e[i]=Z(e),e.addEventListener(p,G)),e.addEventListener(c,at)),e.createdCallback&&Q&&(e.created=!0,e.createdCallback(),e.created=!1)}function pt(){for(var e,t=0,n=F.length;t<n;t++)e=F[t],E.contains(e)||(F.splice(t,1),dt(e,o))}function dt(e,t){var n,r=ot(e);-1<r&&(tt(e,b[r]),r=0,t===s&&!e[s]?(e[o]=!1,e[s]=!0,r=1,B&&S.call(F,e)<0&&F.push(e)):t===o&&!e[o]&&(e[s]=!1,e[o]=!0,r=1),r&&(n=e[t+"Callback"])&&n.call(e))}if(r in t)return;var i="__"+r+(Math.random()*1e5>>0),s="attached",o="detached",u="extends",a="ADDITION",f="MODIFICATION",l="REMOVAL",c="DOMAttrModified",h="DOMContentLoaded",p="DOMSubtreeModified",d="<",v="=",m=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,g=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],y=[],b=[],w="",E=t.documentElement,S=y.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},x=n.prototype,T=x.hasOwnProperty,N=x.isPrototypeOf,C=n.defineProperty,k=n.getOwnPropertyDescriptor,L=n.getOwnPropertyNames,A=n.getPrototypeOf,O=n.setPrototypeOf,M=!!n.__proto__,_=n.create||function vt(e){return e?(vt.prototype=e,new vt):this},D=O||(M?function(e,t){return e.__proto__=t,e}:L&&k?function(){function e(e,t){for(var n,r=L(t),i=0,s=r.length;i<s;i++)n=r[i],T.call(e,n)||C(e,n,k(t,n))}return function(t,n){do e(t,n);while((n=A(n))&&!N.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),P=e.MutationObserver||e.WebKitMutationObserver,H=(e.HTMLElement||e.Element||e.Node).prototype,B=!N.call(H,E),j=B?function(e){return e.nodeType===1}:function(e){return N.call(H,e)},F=B&&[],I=H.cloneNode,q=H.setAttribute,R=H.removeAttribute,U=t.createElement,z=P&&{attributes:!0,characterData:!0,attributeOldValue:!0},W=P||function(e){J=!1,E.removeEventListener(c,W)},X,V=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,10)},$=!1,J=!0,K=!0,Q=!0,G,Y,Z,et,tt,nt;O||M?(tt=function(e,t){N.call(t,e)||ht(e,t)},nt=ht):(tt=function(e,t){e[i]||(e[i]=n(!0),ht(e,t))},nt=tt),B?(J=!1,function(){var e=k(H,"addEventListener"),t=e.value,n=function(e){var t=new CustomEvent(c,{bubbles:!0});t.attrName=e,t.prevValue=this.getAttribute(e),t.newValue=null,t[l]=t.attrChange=2,R.call(this,e),this.dispatchEvent(t)},r=function(e,t){var n=this.hasAttribute(e),r=n&&this.getAttribute(e),i=new CustomEvent(c,{bubbles:!0});q.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[f]=i.attrChange=1:i[a]=i.attrChange=0,this.dispatchEvent(i)},s=function(e){var t=e.currentTarget,n=t[i],r=e.propertyName,s;n.hasOwnProperty(r)&&(n=n[r],s=new CustomEvent(c,{bubbles:!0}),s.attrName=n.name,s.prevValue=n.value||null,s.newValue=n.value=t[r]||null,s.prevValue==null?s[a]=s.attrChange=0:s[f]=s.attrChange=1,t.dispatchEvent(s))};e.value=function(e,o,u){e===c&&this.attributeChangedCallback&&this.setAttribute!==r&&(this[i]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",s)),t.call(this,e,o,u)},C(H,"addEventListener",e)}()):P||(E.addEventListener(c,W),E.setAttribute(i,1),E.removeAttribute(i),J&&(G=function(e){var t=this,n,r,s;if(t===e.target){n=t[i],t[i]=r=Z(t);for(s in r){if(!(s in n))return Y(0,t,s,n[s],r[s],a);if(r[s]!==n[s])return Y(1,t,s,n[s],r[s],f)}for(s in n)if(!(s in r))return Y(2,t,s,n[s],r[s],l)}},Y=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,at(o)},Z=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),t[r]=function(n,r){p=n.toUpperCase(),$||($=!0,P?(et=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new P(function(r){for(var i,s,o=0,u=r.length;o<u;o++)i=r[o],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,Q&&s.attributeChangedCallback&&i.attributeName!=="style"&&s.attributeChangedCallback(i.attributeName,i.oldValue,s.getAttribute(i.attributeName)))})}(st(s),st(o)),et.observe(t,{childList:!0,subtree:!0})):(X=[],V(function E(){while(X.length)X.shift().call(null,X.shift());V(E)}),t.addEventListener("DOMNodeInserted",ft(s)),t.addEventListener("DOMNodeRemoved",ft(o))),t.addEventListener(h,lt),t.addEventListener("readystatechange",lt),t.createElement=function(e,n){var r=U.apply(t,arguments),i=""+e,s=S.call(y,(n?v:d)+(n||i).toUpperCase()),o=-1<s;return n&&(r.setAttribute("is",n=n.toLowerCase()),o&&(o=ut(i.toUpperCase(),n))),Q=!t.createElement.innerHTMLHelper,o&&nt(r,b[s]),r},H.cloneNode=function(e){var t=I.call(this,!!e),n=ot(t);return-1<n&&nt(t,b[n]),e&&it(t.querySelectorAll(w)),t});if(-2<S.call(y,v+p)+S.call(y,d+p))throw new Error("A "+n+" type is already registered");if(!m.test(p)||-1<S.call(g,p))throw new Error("The type "+n+" is invalid");var i=function(){return f?t.createElement(l,p):t.createElement(l)},a=r||x,f=T.call(a,u),l=f?r[u].toUpperCase():p,c=y.push((f?v:d)+p)-1,p;return w=w.concat(w.length?",":"",f?l+'[is="'+n.toLowerCase()+'"]':l),i.prototype=b[c]=T.call(a,"prototype")?a.prototype:_(H),rt(t.querySelectorAll(w),s),i}})(window,document,Object,"registerElement");function dojoColorToRgba(c){var color="rgba("+c[0]+","+c[1]+","+c[2]+","+c[3]+")";return color}function rgbaToDojoColor(c,opacity){var color;if(!opacity)opacity=255;if(Array.isArray(c)){color=c;color[3]=opacity;return color}else{color=c.split(",");return[parseInt(color[0].replace(/[^0-9]/g,"")),parseInt(color[1]),parseInt(color[2]),opacity]}}var themeColors=[["rgb(255,255,255)","rgb(240,240,240)","rgb(217,217,217)","rgb(189,189,189)","rgb(150,150,150)","rgb(115,115,115)","rgb(82,82,82)","rgb(37,37,37)"],["rgb(255,255,217)","rgb(237,248,177)","rgb(199,233,180)","rgb(127,205,187)","rgb(65,182,196)","rgb(29,145,192)","rgb(34,94,168)","rgb(12,44,132)"],["rgb(255,255,229)","rgb(247,252,185)","rgb(217,240,163)","rgb(173,221,142)","rgb(120,198,121)","rgb(65,171,93)","rgb(35,132,67)","rgb(0,90,50)"],["rgb(255,247,251)","rgb(236,226,240)","rgb(208,209,230)","rgb(166,189,219)","rgb(103,169,207)","rgb(54,144,192)","rgb(2,129,138)","rgb(1,100,80)"],["rgb(247,252,253)","rgb(224,236,244)","rgb(191,211,230)","rgb(158,188,218)","rgb(140,150,198)","rgb(140,107,177)","rgb(136,65,157)","rgb(110,1,107)"],["rgb(255,255,204)","rgb(255,237,160)","rgb(254,217,118)","rgb(254,178,76)","rgb(253,141,60)","rgb(252,78,42)","rgb(227,26,28)","rgb(177,0,38)"],["rgb(255,245,235)","rgb(254,230,206)","rgb(253,208,162)","rgb(253,174,107)","rgb(253,141,60)","rgb(241,105,19)","rgb(217,72,1)","rgb(140,45,4)"]];var colorSwatches=["rgb(255,255,255)","rgb(240,240,240)","rgb(217,217,217)","rgb(189,189,189)","rgb(150,150,150)","rgb(115,115,115)","rgb(82,82,82)","rgb(37,37,37)","rgb(247,252,253)","rgb(224,236,244)","rgb(191,211,230)","rgb(158,188,218)","rgb(140,150,198)","rgb(140,107,177)","rgb(136,65,157)","rgb(110,1,107)","rgb(255,247,243)","rgb(253,224,221)","rgb(252,197,192)","rgb(250,159,181)","rgb(247,104,161)","rgb(221,52,151)","rgb(174,1,126)","rgb(122,1,119)","rgb(255,255,204)","rgb(255,237,160)","rgb(254,217,118)","rgb(254,178,76)","rgb(253,141,60)","rgb(252,78,42)","rgb(227,26,28)","rgb(177,0,38)","rgb(255,255,217)","rgb(237,248,177)","rgb(199,233,180)","rgb(127,205,187)","rgb(65,182,196)","rgb(29,145,192)","rgb(34,94,168)","rgb(12,44,132)","rgb(247,252,240)","rgb(224,243,219)","rgb(204,235,197)","rgb(168,221,181)","rgb(123,204,196)","rgb(78,179,211)","rgb(43,140,190)","rgb(8,88,158)","rgb(247,252,253)","rgb(229,245,249)","rgb(204,236,230)","rgb(153,216,201)","rgb(102,194,164)","rgb(65,174,118)","rgb(35,139,69)","rgb(0,88,36)"];function classify(fieldName,fields){var breaks=8;var values=[];fields.forEach(function(f){if(f.name===fieldName){var step=(f.statistics.max-f.statistics.min)/breaks;for(var i=0;i<=breaks;i++){values.push(f.statistics.min+step*i)}}});return values}function stringToDom(tagString){var dom;if(document.createRange){var range=document.createRange();range.selectNode(document.body);dom=range.createContextualFragment(tagString)}else{try{dom=document.createElement(tagString)}catch(e){var div=document.createElement("div");div.innerHTML=tagString;dom=div.childNodes}}return dom}"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}var Malette=function(){function Malette(container,options){_classCallCheck(this,Malette);console.log("init Malette, options: ",options);var self=this;this.options=options;this.width=options.width||239;this.height=options.height||"auto";this.container=container;this._handlers={};this.state={};this.state._isGraduated=false;this.state._isTheme=false;this.state.type=options.type?options.type.toLowerCase():"point";this.state.layerId=options.layerId||null;this.format=options.formatIn||"esri-json";this.exportFormat=options.formatOut||"esri-json";this._hasApplicableFields=this._getApplicableFields();if(this.format==="esri-json"){if(options.style){this.style=options.style||{};if(this.style.visualVariables){this._setRamp()}if(!this.style.symbol&&this.style.defaultSymbol){this.style.symbol=this.style.defaultSymbol}this.state.fillOpacity=this.style.symbol.color[3];this.style.symbol.color=dojoColorToRgba(this.style.symbol.color);if(this.state.type!=="line"){this.style.symbol.outline.color=dojoColorToRgba(this.style.symbol.outline.color)}}else{}}else{if(options.style){this._toEsriJson()}}this._buildUI();if(options.exportStyle===true){this.showExport=true;this.exportFormat=options.formatOut;this._addExporter()}}_createClass(Malette,[{key:"_buildUI",value:function _buildUI(){var template="\n      <div id='malette'>\n        <div id=\"malette-header\">Malette</div>\n        <div id='malette-content'></div>\n      </div>\n    ";var container=document.getElementById(this.container);container.appendChild(stringToDom(template));var innerContainer=document.getElementById("malette");var content=document.getElementById("malette-content");if(this.options.title){header=document.createElement("div");innerContainer.appendChild(header).id="malette-title";header.innerHTML=this.options.title;document.getElementById("malette-content").style["margin-top"]="40px"}this._addTabs(innerContainer);this._constructColorRegion(content)}},{key:"_addTabs",value:function _addTabs(el){var self=this;var disabled=this.state.type==="point"?"":"disabled";var stroke=this.state.type!=="line"?"stroke":"line";var template="\n      <div id='malette-tab-region'>\n        <div id='malette-color-tab' class='malette-tab malette-tab-selected'>color</div>\n        <div id='malette-size-tab' class='malette-tab "+disabled+"'>size</div>\n        <div id='malette-stroke-tab' class='malette-tab'>"+stroke+"</div>\n        <div id='malette-opacity-tab' class='malette-tab'>opacity</div>\n      </div>\n    ";el.appendChild(stringToDom(template));this._classEventBuilder("click","malette-tab","_onTabClick")}},{key:"_addExporter",value:function _addExporter(){var self=this;var container=document.getElementById("malette-content");var checked=this._isShowJson?"checked":"";var template="\n      <div id='malette-export-toggle-container'>\n        <span id='malette-export-toggle-text'>Show JSON</span>\n        <input id='malette-export-toggle' type='checkbox' "+checked+" />\n      </div>\n    ";container.appendChild(stringToDom(template));var content=document.getElementById("malette");var cssChecked=this.exportFormat==="css"?"checked":"";var esriChecked=this.exportFormat==="esri-json"?"checked":"";var template="\n      <div id='malette-export-container'>\n        <div id='malette-export-header'>\n          <input id='malette-export-css-toggle' class='export-type-toggle' type='checkbox' "+cssChecked+" />\n          <span id='css-out-toggle' class='malette-export-label'>CSS</span>\n          <input id='malette-export-esri-toggle' class='export-type-toggle' type='checkbox' "+esriChecked+" />\n          <span id='esri-out-toggle' class='malette-export-label'>Esri Renderer</span>\n        </div>\n        <textarea id='export-code-block' class='code-block'></textarea>\n      </div>\n    ";content.appendChild(stringToDom(template));this.selectedExportType=this.exportFormat;this._generateExportStyle(this.exportFormat);this._idEventBuilder("click","malette-export-toggle","_onToggleExportUI");this._classEventBuilder("click","export-type-toggle","_onExportTypeChange")}},{key:"_addColors",value:function _addColors(el,selectedColor){var swatch;var colors=colorSwatches;var colorPalette=this._createElement("div",el,"malette-color-palette","","");var selectedEl=this._createElement("div",colorPalette,"malette-selected-color","Selected color","");swatch=this._createElement("span",selectedEl,"malette-selected-swatch","","malette-color-swatch-selected");swatch.style.backgroundColor=selectedColor;colors.forEach(function(color,i){swatch=document.createElement("div");swatch.style.backgroundColor=color;colorPalette.appendChild(swatch).className="malette-color-swatch"})}},{key:"_addThemes",value:function _addThemes(el){var self=this;var swatch;var select=this._createAttributeSelect("malette-attr-select");this.themeColors=themeColors;var template="\n      <div id='malette-theme-palette'>\n        <div id='malette-theme-palette-inner'></div>\n      </div>\n    ";el.appendChild(stringToDom(template));var palette=document.getElementById("malette-theme-palette");var colorPalette=document.getElementById("malette-theme-palette-inner");palette.insertBefore(select,colorPalette);this.themeColors.forEach(function(colors,i){var row=self._createElement("div",colorPalette,"malette-theme-row-"+i,"","malette-theme-row");colorPalette.appendChild(row);colors.forEach(function(color){swatch=document.createElement("div");swatch.style.backgroundColor=color;row.appendChild(swatch).className="malette-theme-swatch"})})}},{key:"_constructColorRegion",value:function _constructColorRegion(el){var self=this;el.innerHTML="";this._createElement("div",el,"malette-single-color-option","Single","malette-option-toggle malette-option-toggle-selected");if(this._hasApplicableFields===true){this._createElement("div",el,"malette-theme-color-option","Theme","malette-option-toggle")}else{this._createElement("div",el,"malette-theme-color-option","Theme","malette-option-toggle disabled")}var colorContainer=this._createElement("div",el,"malatte-color-container","","");this._addColors(colorContainer,this.style.symbol.color);this._classEventBuilder("click","malette-color-swatch","_onColorClick");this._idEventBuilder("click","malette-single-color-option","showSingleColorUI");if(this._hasApplicableFields===true){this._addThemes(colorContainer);this._idEventBuilder("click","malette-theme-color-option","showThemeUI");this._idEventBuilder("change","malette-attr-select","_onAttributeChange");this._classEventBuilder("click","malette-theme-row","_onThemeRowClick")}this._selectOption("malette-attr-select","selectedField");if(this.state._isTheme||this.style.visualVariables){if(this.style.visualVariables){this.state.selectedField=this.style.visualVariables[0].field;this._selectOption("malette-attr-select","selectedField")}self.showThemeUI()}}},{key:"_addGraduated",value:function _addGraduated(el){var select=this._createAttributeSelect();var graduatedPaletteContainer=this._createElement("div",el,"malette-graduated-palette","","");graduatedPaletteContainer.appendChild(select).id="malette-grad-attr-select"}},{key:"_constructSizePalette",value:function _constructSizePalette(el){var self=this;el.innerHTML="";this._createElement("div",el,"malette-single-size-option","Single","malette-option-toggle malette-option-toggle-selected");if(this._hasApplicableFields===true){this._createElement("div",el,"malette-graduated-size-option","Graduated","malette-option-toggle")}else{this._createElement("div",el,"malette-graduated-size-option","Graduated","malette-option-toggle disabled")}var size=this.style.symbol.size||8;var template='\n      <div id="malette-size-palette">\n        <input type=\'range\' min="1" max="30" step="0.5" value='+size+' id="malette-size-slider" />\n        <div id="malette-size-number">Radius: '+size+"px</div>\n      </div>\n    ";el.appendChild(stringToDom(template));this._idEventBuilder("input","malette-size-slider","_onSizeChanged");this._idEventBuilder("click","malette-single-size-option","showSingleSizeUI");if(this._hasApplicableFields===true){this._addGraduated(el);this._idEventBuilder("click","malette-graduated-size-option","showGraduatedUI");this._idEventBuilder("change","malette-grad-attr-select","_onGradAttributeChange")}this._selectOption("malette-grad-attr-select","selectedField");if(this.state._isGraduated||this.style.classBreakInfos){if(this.style.classBreakInfos){this.state.selectedField=this.style.field;this._selectOption("malette-grad-attr-select","selectedField")}self.showGraduatedUI()}}},{key:"_constructStrokePalette",value:function _constructStrokePalette(el){var self=this;el.innerHTML="";var width=this.state.type!=="line"?this.style.symbol.outline.width:this.style.symbol.width;width=width.toFixed(1);var template='\n      <input type=\'range\' min="0.5" max="20" step="0.5" value='+width+' id="malette-stroke-slider" />\n      <div id="malette-stroke-width">'+width+"px</div>\n    ";el.appendChild(stringToDom(template));if(this.state.type!=="line"){this._addColors(el,this.style.symbol.outline.color)}this._idEventBuilder("input","malette-stroke-slider","_onStrokeWidthChanged");this._classEventBuilder("click","malette-color-swatch","_onStrokeColorClick")}},{key:"_constructOpacityPalette",value:function _constructOpacityPalette(el){var self=this;el.innerHTML="";var opacity=this.state.fillOpacity/255||.7;var slider=document.createElement("input");slider.type="range";slider.min=.1;slider.max=1;slider.step=.1;slider.value=opacity;el.appendChild(slider).id="malette-opacity-slider";var sizeNumber=this._createElement("div",el,"malette-opacity-number","Opacity: "+opacity*100+"%","");el.appendChild(sizeNumber);this._idEventBuilder("input","malette-opacity-slider","_onOpacityChanged")}},{key:"_createElement",value:function _createElement(type,parent,id,html,className){var el=document.createElement(type);parent.appendChild(el).id=id;el.innerHTML=html;document.getElementById(id).className=className;return el}},{key:"_createAttributeSelect",value:function _createAttributeSelect(id){var select=document.createElement("select");if(id)select.id=id;for(var i=0;i<this.options.fields.length;i++){if(this.options.fields[i].type==="esriFieldTypeDouble"||this.options.fields[i].type==="esriFieldTypeInteger"||this.options.fields[i].type==="esriFieldTypeSingle"||this.options.fields[i].type==="esriFieldTypeSmallInteger"){if(this.options.fields[i].statistics&&this.options.fields[i].statistics.max){var option=document.createElement("option");option.setAttribute("value",this.options.fields[i].type);option.setAttribute("id",this.options.fields[i].name.replace(/ /g,""));option.appendChild(document.createTextNode(this.options.fields[i].name));select.appendChild(option)}}}return select}},{key:"_selectOption",value:function _selectOption(id,field){if(this.state[field]){var index=0;var x=document.getElementById(id);for(var i=0;i<x.length;i++){if(x.options[i].text===this.state[field].replace(/ /g,"")){index=x.options[i].index}}document.getElementById(id).getElementsByTagName("option")[index].selected="selected"}}},{key:"_getApplicableFields",value:function _getApplicableFields(){var isApplicable=false;if(this.options.fields){for(var i=0;i<this.options.fields.length;i++){if(this.options.fields[i].type==="esriFieldTypeDouble"||this.options.fields[i].type==="esriFieldTypeInteger"||this.options.fields[i].type==="esriFieldTypeSingle"||this.options.fields[i].type==="esriFieldTypeSmallInteger"){if(this.options.fields[i].statistics&&this.options.fields[i].statistics.max){isApplicable=true}}}}return isApplicable}},{key:"_classEventBuilder",value:function _classEventBuilder(eventName,className,fnName){var self=this;var linkEl=document.getElementsByClassName(className);for(var i=0;i<linkEl.length;i++){if(linkEl[i].addEventListener){linkEl[i].addEventListener(eventName,function(e){self[fnName].call(self,e)})}else{linkEl[i].attachEvent("on"+eventName,function(e){self[fnName].call(self,e)})}}}},{key:"_idEventBuilder",value:function _idEventBuilder(eventName,id,fnName){var self=this;var linkEl=document.getElementById(id);if(linkEl.addEventListener){linkEl.addEventListener(eventName,function(e){self[fnName].call(self,e)})}else{linkEl.attachEvent("on"+eventName,function(e){self[fnName].call(self,e)})}}},{key:"destroy",value:function destroy(){var parent=document.getElementById(this.container);parent.removeChild(document.getElementById("malette"))}},{key:"changeTab",value:function changeTab(tab){var el=document.getElementById("malette-content");switch(tab){case"color":this._constructColorRegion(el);break;case"size":this._constructSizePalette(el);break;case"stroke":this._constructStrokePalette(el);break;case"line":this._constructStrokePalette(el);break;case"opacity":this._constructOpacityPalette(el);break;default:this._constructColorRegion(el)}if(this.options.exportStyle){this._addExporter()}}},{key:"setTheme",value:function setTheme(ramp,field){var self=this;this.state.selectedField=field?field:this.state.selectedField;if(!ramp&&!this.selectedRamp){ramp=[[255,247,251,this.state.fillOpacity],[236,226,240,this.state.fillOpacity],[208,209,230,this.state.fillOpacity],[166,189,219,this.state.fillOpacity],[103,169,207,this.state.fillOpacity],[54,144,192,this.state.fillOpacity],[2,129,138,130],[1,100,80,this.state.fillOpacity]]}else if(!ramp&&this.selectedRamp){ramp=this.selectedRamp}this.selectedRamp=ramp?ramp:this.selectedRamp;this.selectedRamp.forEach(function(color,i){self.selectedRamp[i][3]=self.state.fillOpacity});var values=classify(this.state.selectedField,this.options.fields);this.style.visualVariables=[{type:"colorInfo",field:this.state.selectedField,stops:[{value:values[0],color:this.selectedRamp[0],label:null},{value:values[1],color:this.selectedRamp[1],label:null},{value:values[2],color:this.selectedRamp[2],label:null},{value:values[3],color:this.selectedRamp[3],label:null},{value:values[4],color:this.selectedRamp[4],label:null},{value:values[5],color:this.selectedRamp[5],label:null},{value:values[6],color:this.selectedRamp[6],label:null},{value:values[7],color:this.selectedRamp[7],label:null}]}];this.updateStyle()}},{key:"setGraduated",value:function setGraduated(field){this.state.selectedField=field?field:this.state.selectedField;var values=classify(this.state.selectedField,this.options.fields);this.style.type="classBreaks";this.style.field=this.state.selectedField;this.style.minValue=1;this.style.classBreakInfos=[{symbol:{color:rgbaToDojoColor(this.style.symbol.color),size:4,xoffset:0,yoffset:0,type:"esriSMS",style:"esriSMSCircle",outline:{color:rgbaToDojoColor(this.style.symbol.outline.color),width:this.style.symbol.outline.width,type:"esriSLS",style:"esriSLSSolid"}},label:values[0],classMaxValue:values[0]},{symbol:{color:rgbaToDojoColor(this.style.symbol.color),size:10,xoffset:0,yoffset:0,type:"esriSMS",style:"esriSMSCircle",outline:{color:rgbaToDojoColor(this.style.symbol.outline.color),width:this.style.symbol.outline.width,type:"esriSLS",style:"esriSLSSolid"}},label:"> "+values[0]+" to "+values[1],classMaxValue:values[1]},{symbol:{color:rgbaToDojoColor(this.style.symbol.color),size:16,xoffset:0,yoffset:0,type:"esriSMS",style:"esriSMSCircle",outline:{color:rgbaToDojoColor(this.style.symbol.outline.color),width:this.style.symbol.outline.width,type:"esriSLS",style:"esriSLSSolid"}},label:"> "+values[1]+" to "+values[2],classMaxValue:values[2]},{symbol:{color:rgbaToDojoColor(this.style.symbol.color),size:22,xoffset:0,yoffset:0,type:"esriSMS",style:"esriSMSCircle",outline:{color:rgbaToDojoColor(this.style.symbol.outline.color),width:this.style.symbol.outline.width,type:"esriSLS",style:"esriSLSSolid"}},label:"> "+values[2]+" to "+values[3],classMaxValue:values[3]},{symbol:{color:rgbaToDojoColor(this.style.symbol.color),size:30,xoffset:0,yoffset:0,type:"esriSMS",style:"esriSMSCircle",outline:{color:rgbaToDojoColor(this.style.symbol.outline.color),width:this.style.symbol.outline.width,type:"esriSLS",style:"esriSLSSolid"}},label:"> "+values[3]+" to "+values[4],classMaxValue:values[4]}];this.updateStyle()}},{key:"clearTheme",value:function clearTheme(){this.style.visualVariables=null;this.updateStyle()}},{key:"clearGraduated",value:function clearGraduated(){this.style.type="simple";this.style.field=null;this.style.minValue=1;this.style.classBreakInfos=null;this.updateStyle()}},{key:"showThemeUI",value:function showThemeUI(){document.getElementById("malette-theme-palette").style.display="block";document.getElementById("malette-color-palette").style.display="none";document.getElementById("malette-single-color-option").className="malette-option-toggle";document.getElementById("malette-theme-color-option").className="malette-option-toggle malette-option-toggle-selected";this.state._isTheme=true;var index=document.getElementById("malette-attr-select").selectedIndex;var field=document.getElementById("malette-attr-select")[index].innerHTML;this.setTheme(null,field)}},{key:"showSingleColorUI",value:function showSingleColorUI(){document.getElementById("malette-theme-palette").style.display="none";document.getElementById("malette-color-palette").style.display="block";document.getElementById("malette-single-color-option").className="malette-option-toggle malette-option-toggle-selected";document.getElementById("malette-theme-color-option").className="malette-option-toggle";this.state._isTheme=false;this.clearTheme()}},{key:"showGraduatedUI",value:function showGraduatedUI(){document.getElementById("malette-graduated-palette").style.display="block";document.getElementById("malette-size-palette").style.display="none";document.getElementById("malette-single-size-option").className="malette-option-toggle";document.getElementById("malette-graduated-size-option").className="malette-option-toggle malette-option-toggle-selected";this.state._isGraduated=true;var index=document.getElementById("malette-grad-attr-select").selectedIndex;var field=document.getElementById("malette-grad-attr-select")[index].innerHTML;this.setGraduated(field)}},{key:"showSingleSizeUI",value:function showSingleSizeUI(){document.getElementById("malette-graduated-palette").style.display="none";document.getElementById("malette-size-palette").style.display="block";document.getElementById("malette-single-size-option").className="malette-option-toggle malette-option-toggle-selected";document.getElementById("malette-graduated-size-option").className="malette-option-toggle";this.state._isGraduated=false;this.clearGraduated()}},{key:"toggleExportUI",value:function toggleExportUI(e){if(e.target.checked===true){document.getElementById("malette-export-container").style.visibility="visible";document.getElementById("malette-export-toggle-text").innerHTML="Hide JSON";this._isShowJson=true}else{document.getElementById("malette-export-container").style.visibility="hidden";document.getElementById("malette-export-toggle-text").innerHTML="Show JSON";this._isShowJson=false}}},{key:"changeExportType",value:function changeExportType(e){var checkbox=document.getElementsByClassName("export-type-toggle");for(var i=0;i<checkbox.length;i++){document.getElementsByClassName("export-type-toggle")[i].checked=false}e.target.checked=true;var id=e.target.id;if(id==="malette-export-esri-toggle"){this.selectedExportType="esri-json";this._generateExportStyle("esri-json")}else if(id==="malette-export-css-toggle"){this.selectedExportType="css";this._generateExportStyle("css")}}},{key:"setSelectedColor",value:function setSelectedColor(color){this.style.symbol.color=color;var swatch=document.getElementById("malette-selected-swatch");swatch.style.backgroundColor=this.style.symbol.color;if(this.state._isGraduated){this.setGraduated()}else{this.updateStyle()}}},{key:"setSelectedThemeRow",value:function setSelectedThemeRow(e){var self=this;var index=parseInt(e.target.id.replace(/malette-theme-row-/g,""));var ramp=[];this.themeColors[index].forEach(function(color){var c=rgbaToDojoColor(color);ramp.push(c)});this.setTheme(ramp)}},{key:"setSelectedStrokeColor",value:function setSelectedStrokeColor(color){this.style.symbol.outline.color=color;var swatch=document.getElementById("malette-selected-swatch");swatch.style.backgroundColor=this.style.symbol.outline.color;if(this.state._isGraduated){this.setGraduated()}else{this.updateStyle()}}},{key:"setSelectedSize",value:function setSelectedSize(size){this.style.symbol.size=parseInt(size);var el=document.getElementById("malette-size-number");this._setInnerHTML(el,"Radius: "+size+"px");this.updateStyle()}},{key:"setStrokeWidth",value:function setStrokeWidth(width){if(this.state.type!=="line"){this.style.symbol.outline.width=parseFloat(width)}else{this.style.symbol.width=parseFloat(width)}var el=document.getElementById("malette-stroke-width");this._setInnerHTML(el,width+"px");if(this.state._isGraduated){this.setGraduated()}else{this.updateStyle()}if(this.state._isTheme){this.setTheme()}else{this.updateStyle()}}},{key:"setOpacity",value:function setOpacity(opacity){this.state.fillOpacity=parseFloat(opacity)*255;var el=document.getElementById("malette-opacity-number");this._setInnerHTML(el,"Opacity: "+opacity*100+"%");if(this.state._isGraduated){this.setGraduated()}else if(this.state._isTheme){this.setTheme()}else{this.updateStyle()}}},{key:"_setInnerHTML",value:function _setInnerHTML(el,html){el.innerHTML=html}},{key:"_setRamp",value:function _setRamp(){if(!this.selectedRamp)this.selectedRamp=[];var self=this;this.style.visualVariables[0].stops.forEach(function(stop){var color=stop.color;self.selectedRamp.push(color)})}},{key:"_toEsriJson",value:function _toEsriJson(){if(this.format==="css"){this.style={type:"simple",symbol:{}};this.style.symbol.color=this.options.style.fillColor?this.options.style.fillColor:"rgba(202,58,45,130)";this.style.symbol.size=this.options.style.radius?this.options.style.radius:8;if(this.state.type!=="line"){this.style.symbol.outline={};this.style.symbol.outline.width=this.options.style.weight||1;this.style.symbol.outline.color=[this.options.style.color]||"rgba(255,255,255,255"}this.state.fillOpacity=this.options.style.fillOpacity?this.options.style.fillOpacity*255:255}}},{key:"_toCss",value:function _toCss(callback){var css={};css.fillColor=this.style.symbol.color;if(this.state.type!=="line"){css.weight=this.style.symbol.outline.width;
css.color=this.style.symbol.outline.color;css.radius=this.style.symbol.size}css.fillOpacity=this.state.fillOpacity/255;callback(css)}},{key:"updateStyle",value:function updateStyle(){var self=this;if(this.exportFormat==="esri-json"){if(this.style.symbol){this.style.symbol.color=rgbaToDojoColor(this.style.symbol.color,this.state.fillOpacity);if(this.state.type!=="line"){this.style.symbol.outline.color=rgbaToDojoColor(this.style.symbol.outline.color)}}this.style.layerId=this.state.layerId;this.style.defaultSymbol=this.style.symbol;console.log("emit --->>>",this.style);this.emit("style-change",this.style)}else{if(this.exportFormat==="css"){this._toCss(function(css){css.layerId=self.state.layerId;css.defaultSymbol=css.symbol;self.emit("style-change",css)})}}this._generateExportStyle()}},{key:"_generateExportStyle",value:function _generateExportStyle(type){type=type||this.selectedExportType;if(type==="esri-json"){this.style.symbol.color=rgbaToDojoColor(this.style.symbol.color,this.state.fillOpacity);if(this.state.type!=="line"){this.style.symbol.outline.color=rgbaToDojoColor(this.style.symbol.outline.color)}document.getElementById("export-code-block").innerHTML=JSON.stringify(this.style,null,2)}else{if(type==="css"){this._toCss(function(css){document.getElementById("export-code-block").innerHTML=JSON.stringify(css,null,2)})}}}},{key:"on",value:function on(eventName,handler){this._handlers[eventName]=handler}},{key:"emit",value:function emit(eventName,val){if(this._handlers[eventName]){this._handlers[eventName](val)}}},{key:"_onColorClick",value:function _onColorClick(e){if(e.which===1&&!(e.metaKey||e.ctrlKey)){e.preventDefault();this.setSelectedColor(e.target.style.backgroundColor)}}},{key:"_onThemeRowClick",value:function _onThemeRowClick(e){e.preventDefault();this.setSelectedThemeRow(e)}},{key:"_onAttributeChange",value:function _onAttributeChange(e){var index=document.getElementById("malette-attr-select").selectedIndex;var field=document.getElementById("malette-attr-select")[index].innerHTML;this.state.selectedField=field;this.setTheme(null,field);if(this.state._isGraduated){this.setGraduated(field)}}},{key:"_onGradAttributeChange",value:function _onGradAttributeChange(e){var index=document.getElementById("malette-grad-attr-select").selectedIndex;var field=document.getElementById("malette-grad-attr-select")[index].innerHTML;this.state.selectedField=field;this.setGraduated(field);if(this.state._isTheme){this.setTheme(null,field)}}},{key:"_onStrokeColorClick",value:function _onStrokeColorClick(e){if(e.which===1&&!(e.metaKey||e.ctrlKey)){e.preventDefault();this.setSelectedStrokeColor(e.target.style.backgroundColor)}}},{key:"_onSizeChanged",value:function _onSizeChanged(e){e.preventDefault();this.setSelectedSize(e.target.value)}},{key:"_onStrokeWidthChanged",value:function _onStrokeWidthChanged(e){e.preventDefault();this.setStrokeWidth(e.target.value)}},{key:"_onOpacityChanged",value:function _onOpacityChanged(e){e.preventDefault();this.setOpacity(e.target.value)}},{key:"_onToggleExportUI",value:function _onToggleExportUI(e){this.toggleExportUI(e)}},{key:"_onExportTypeChange",value:function _onExportTypeChange(e){this.changeExportType(e)}},{key:"_onTabClick",value:function _onTabClick(e){if(e.target.classList.contains("disabled")){return}if(e.which===1&&!(e.metaKey||e.ctrlKey)){e.preventDefault();var els=document.getElementsByClassName("malette-tab");for(var i=0;i<els.length;i++){els[i].classList.remove("malette-tab-selected")}e.target.classList.add("malette-tab-selected");this.changeTab(e.target.innerHTML)}}}]);return Malette}();"use strict";