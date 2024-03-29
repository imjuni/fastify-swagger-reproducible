const Ajv = require('ajv');
const ajv = new Ajv();

ajv.addSchema({
  definitions: {
    common: {
      'server-status': {
        type: 'object',
        properties: {
          status: { type: 'string' },
        },
        required: ['status'],
      },
      hello: {
        'another-status': {
          $ref: '#/definitions/common/server-status',
        },
      },
      hero: {
        allOf: [
          {
            type: 'object',
            properties: {
              name: { type: 'string' },
              age: { type: 'integer' },
            },
          },
          {
            $ref: '#/definitions/common/server-status',
          },
        ],
      },
    },
  },
});

const v01 = ajv.getSchema('#/definitions/common/hello/another-status');
const r01 = v01({ status: 'helthy' });

const v02 = ajv.getSchema('#/definitions/common/hero');
const r02 = v02({ name: 'ironman', age: 40 });

console.log(r01);
console.log(r02);
