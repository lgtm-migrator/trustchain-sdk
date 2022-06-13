/* eslint-disable */
export default {
  displayName: 'did',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  roots: ['./', '../tests/src/did'],
  coverageDirectory: '../../coverage/packages/did',
};
