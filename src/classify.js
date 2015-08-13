  /*
  * Classify returns classification breaks for a field based on stats 
  * @param {string} fieldName     field to classify on 
  * @param {array} fields       array of possible fields 
  *
  */
  export function classify (fieldName, fields){

    var breaks = 8; 
    var values = [];

    fields.forEach(function(f) {
      if ( f.name === fieldName ) {
        var step = ( f.statistics.max - f.statistics.min ) / breaks;
        for (var i = 0; i<=breaks; i++ ) {
          values.push( f.statistics.min + (step * i) );
        }
      }
    });

    return values;
  }