'use strict';

import { classify } from '../src/classify';

describe('classify', () => {

  var fields = [
      {
        name: 'foo',
        statistics: {
          min: 1,
          max: 10
        }
      },
      {
        name: 'bar',
        statistics: {
          min: 1,
          max: 100
        }
      },
      {
        name: 'baz',
        statistics: {
          min: 0,
          max: 4
        }
      }
    ];

  it('should return class breaks (1 - 10)', function () {
    var result = classify('foo', fields);
    expect(result).toEqual([ 1, 2.125, 3.25, 4.375, 5.5, 6.625, 7.75, 8.875, 10 ]);
  });

  it('should return class breaks (1 - 100)', function () {
    var result = classify('bar', fields);
    expect(result).toEqual([ 1, 13.375, 25.75, 38.125, 50.5, 62.875, 75.25, 87.625, 100 ]);
  });

  it('should return class breaks (0 - 4)', function () {
    var result = classify('baz', fields);
    expect(result).toEqual([ 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4 ]);
  });

});
