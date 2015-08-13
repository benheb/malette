export function stringToDom(tagString) {
  var dom;
  
  // standards land (IE 11+, FF, Chrome, Safari)
  if (document.createRange) {
    var range = document.createRange();
    range.selectNode(document.body);
    dom = range.createContextualFragment(tagString);
  } else {
    try {
      // non standard IE behavior will throw a DOM error in non IE
      dom = document.createElement(tagString);
    } catch (e){
      // this is what most libraries do (jquery ect...)
      var div = document.createElement('div');
      div.innerHTML = tagString;
      dom = div.childNodes;
    }
  }
  
  return dom;
}