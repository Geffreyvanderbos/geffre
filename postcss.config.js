module.exports = {
    plugins: [
      require('postcss-import'), // This handles @import statements
      require('cssnano') // ... any other plugins like cssnano for minification
    ]
  };