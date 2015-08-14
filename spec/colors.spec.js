'use strict';

import { dojoColorToRgba, rgbaToDojoColor } from '../src/colors';

describe('colors', () => {

  describe('dojoColorToRgba', () => {

    it('should return rgba', function () {
      var result = dojoColorToRgba([ 1, 2, 3, 0.4 ]);
      expect(result).toEqual('rgba(1,2,3,0.4)');
    });

  });

  describe('rgbaToDojoColor', () => {

    it('should return color array when passed an array', function () {
      var result = rgbaToDojoColor([ 1, 2, 3 ], 0.4);
      expect(result).toEqual([ 1, 2, 3, 0.4 ]);
    });

    it('should return color array when passed a string', function () {
      var result = rgbaToDojoColor('1, 2, 3', 0.4);
      expect(result).toEqual([ 1, 2, 3, 0.4 ]);
    });

  });

});
