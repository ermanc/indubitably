import { validator, types, operators } from '../src/index';
import expect from 'expect.js';

describe('utils/parse_by_schema', function () {
  let schema, input, parsed;

  describe('for valid nested types', function() {
    beforeEach(function() {
      schema = {
          a: {                             // hash type
              x: types.integer,                  // any integer
              y: [ types.integer(5, 10) ]        // integer, 5 or 10
          },
          b: [{                            // array type, array of hashes
              n: types.decimal(1.2, 2.3),        // decimal type
              m: [
                types.integer(function(i) { return i > 100 && i < 200 }) // validator functions! (100 < x < 200)
              ]
          }],
          c: types.string,                       // any string
          d: types.string(function(s) { return s.length > 3 }),  // strings of length > 3
          e: types.any,                          // whatever...
          f: "42"                                // strict equality (will come in useful later)
      };

      input = {
          a: {
              x: "50",
              y: [5, 10, 5, 10]
          },
          b: [{
              n: "1.2",
              m: [101, 102, 103, 150]
          }, {
              n: 2.3,
              m: [101, "102", 103, 104]
          }, ],
          c: "duh",
          d: "fubar",
          e: 100.24,
          f: "42"
      };

      parsed = {
          a: {
              x: 50,
              y: [5, 10, 5, 10]
          },
          b: [{
              n: 1.2,
              m: [101, 102, 103, 150]
          }, {
              n: 2.3,
              m: [101, 102, 103, 104]
          }, ],
          c: "duh",
          d: "fubar",
          e: 100.24,
          f: "42"
      };

    });

    it('parses the nested data', function() {
      expect(validator(input, schema)).to.eql(parsed);
    });
  });

  describe('for operator types', function() {
    beforeEach(function() {
      schema = operators.ensure([
        operators.or(
          {
            type: "3D",
            X: types.integer,
            Y: types.integer,
            Z: types.integer
          },
          {
            type: "2D",
            X: types.integer,
            Y: types.integer
          }
        )
      ], (val) => val.length === 2);

      input = [
        {
          type: "2D",
          X: "10",
          Y: 20,
          D: 50  // not in schema, gets discarded
        },
        {
          type: "3D",
          X: "10",
          Y: 20,
          Z: 30
        }
      ];

      parsed = [
        {
          type: "2D",
          X: 10,
          Y: 20
        },
        {
          type: "3D",
          X: 10,
          Y: 20,
          Z: 30
        }
      ];

    });

    it('parses the operator wrapped data', function() {
      expect(validator(input, schema)).to.eql(parsed);
    });
  });
});

