const fs = require("fs");
const markdownIt = require("markdown-it");
const markdownItAttrs = require('markdown-it-attrs')
const md = new markdownIt();
const { formatDistanceToNow } = require('date-fns');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { DateTime } = require("luxon");
const { execSync } = require('child_process');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/stylesheets/*.css");
    eleventyConfig.addPassthroughCopy("./src/scripts/*.js");
    eleventyConfig.addPassthroughCopy("./src/project/**/assets/*");
    eleventyConfig.addPassthroughCopy("./src/note/images/*");
    eleventyConfig.addPassthroughCopy("./src/assets/**/*");
    eleventyConfig.addPassthroughCopy("./src/concept/*.png");
    eleventyConfig.addPassthroughCopy("./src/concept/*.jpg");
    eleventyConfig.addPassthroughCopy("./src/CNAME");
    
    eleventyConfig.addPlugin(
        require("@11ty/eleventy-plugin-syntaxhighlight"),
        {
        templateFormats: ["css", "md", "liquid", "html", "js"]
        }
      );

        // Run PostCSS during build
    eleventyConfig.on('afterBuild', () => {
        // Execute PostCSS command
        console.log("Processing CSS ... ")
        execSync('npx postcss src/stylesheets/style.css -o public/stylesheets/style.css');
        console.log("Done processing the CSS!")
    });

    //   eleventyConfig.addPlugin(
    //     require("@photogabble/eleventy-plugin-interlinker"),
    //     {
    //     }
    //   );

    const markdownItOptions = {
        html: true,
        breaks: true,
        linkify: false
    };

    const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs);
    eleventyConfig.setLibrary('md', markdownLib);

    eleventyConfig.addFilter("markdownify", function(filePath) {
        let markdownContent = fs.readFileSync(filePath, 'utf8');
        return markdownLib.render(markdownContent);
    });

    eleventyConfig.addFilter("readableDate", (date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    });

    eleventyConfig.addFilter("bust", (url) => {
        const [urlPart, paramPart] = url.split("?");
        const params = new URLSearchParams(paramPart || "");
        params.set("v", DateTime.local().toFormat("X"));
        return `${urlPart}?${params}`;
      });

    eleventyConfig.addCollection("navigation", function(collection) {
        return collection.getAll()
          .filter(item => "nav" in item.data)
          .sort((a, b) => a.data.order - b.data.order);
      });

    eleventyConfig.addCollection("projects", function(collection) {
        return collection.getFilteredByGlob("./src/project/**/*.njk").sort((a, b) => {
            return a.data.order - b.data.order;
        });
      });

    eleventyConfig.addCollection("now", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./src/now/*.md").sort((a, b) => {
        return b.date - a.date; // Sort by date in descending order
        });
    });

    eleventyConfig.addCollection("notes", function(collectionApi) {
        return collectionApi.getFilteredByGlob("./src/note/*.md").sort((a, b) => {
            return b.data.updated - a.data.updated;
            });
        });

    eleventyConfig.addCollection("reviewsObject", function(collectionApi) {
        let reviewsArray = collectionApi.getFilteredByGlob("./src/review/*.md").filter(item => item.data.mbid);
    
        reviewsArray.sort((a, b) => a.data.date - b.data.date);
    
        let reviewsObject = {};
        reviewsArray.forEach(item => {
            reviewsObject[item.data.mbid] = item.url;
        });
    
        return reviewsObject;
    });

    eleventyConfig.addCollection("reviews", function(collectionApi) {
        return collectionApi.getFilteredByGlob("./src/review/*.md").sort((a, b) => {
            return new Date(b.data.date) - new Date(a.data.date);
        });
    });
    
    eleventyConfig.addCollection("concepts", function(collectionApi) {
      return collectionApi.getFilteredByGlob("./src/concept/*.md").sort((a, b) => {
            return new Date(b.data.date) - new Date(a.data.date);
        });
      });

    // For Album reviews previous and next
    eleventyConfig.addFilter("findIndex", (array, findFn) => {
        return array.findIndex(findFn);
      });
    
      eleventyConfig.addFilter("findReviewNeighbors", function(reviews, currentPageUrl) {
        const currentIndex = reviews.findIndex(review => review.url === currentPageUrl);
      
        // Initialize previous and next as null
        let prevReview = null;
        let nextReview = null;
      
        // Find the previous review that is not 'reviewing'
        for (let i = currentIndex - 1; i >= 0; i--) {
          if (reviews[i].data.status !== 'reviewing') {
            prevReview = reviews[i];
            break; // Exit the loop once the suitable previous review is found
          }
        }
      
        // Find the next review that is not 'reviewing'
        for (let i = currentIndex + 1; i < reviews.length; i++) {
          if (reviews[i].data.status !== 'reviewing') {
            nextReview = reviews[i];
            break; // Exit the loop once the suitable next review is found
          }
        }
      
        return { prevReview, nextReview };
      });
      
    return {
        dir: {
            input: "src",
            output: "public",
        },
    };
};