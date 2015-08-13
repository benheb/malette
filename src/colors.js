export function dojoColorToRgba(c) {
  var color = 'rgba('+c[0]+','+c[1]+','+c[2]+','+c[3]+')';
  return color;
}

export function rgbaToDojoColor(c, opacity) {
  var color;
  if ( !opacity ) opacity = 255;

  if ( Array.isArray(c) ) {
    color = c;
    color[3] = opacity;
    return color;
  } else {
    color = c.split(',');
    return [ parseInt(color[0].replace(/[^0-9]/g, '')), parseInt(color[1]), parseInt(color[2]), opacity ];
  }
}