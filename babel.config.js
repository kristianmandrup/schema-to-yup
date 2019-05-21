// Babel allows us to use eslint to lint Typescript code
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: '10'}}],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/proposal-class-properties',
  ]
};