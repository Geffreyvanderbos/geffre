const purgecss = require("@fullhuman/postcss-purgecss")({
  // Specify the content to analyze for PurgeCSS
  content: ["./src/**/*.njk", "./src/**/*.js"],
  // Specify the default extractor
  defaultExtractor: (content) => {
      // Use a regular expression to match CSS selectors in the HTML content
      return content.match(/[A-Za-z0-9-_:/]+/g) || [];
  },
  // Optionally, add a safelist if needed
  safelist: [],
});

module.exports = {
  plugins: [
      require('postcss-import'), // This handles @import statements
      require('cssnano'), // ... any other plugins like cssnano for minification
      require('autoprefixer'),
      purgecss,
  ]
};