module.exports = {
    presets: [
      ['@babel/preset-env', { targets: { esmodules: true } }],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ]
  };

  // module.exports = {
  //   presets: [
  //     '@babel/preset-react',
  //     '@babel/preset-env',
  //   ],
  //   plugins: [
  //     '@babel/plugin-transform-runtime',
  //   ],
  // };