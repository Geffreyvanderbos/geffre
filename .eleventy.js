const fs = require("fs");
const markdownIt = require("markdown-it");
const markdownItAttrs = require('markdown-it-attrs')
const md = new markdownIt();
const { formatDistanceToNow } = require('date-fns');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");
const { DateTime } = require("luxon");
const { execSync } = require('child_process');

// Image URL Shortcode
async function imageUrlShortcode(src, width = null, format = 'webp') {
  try {
      let fullPath = `src/${src}`;
      let options = {
          widths: [width].filter(w => w !== null),
          formats: [format],
          urlPath: `/${src.split("/").slice(0, -1).join("/")}`,
          outputDir: "./public/" + src.split("/").slice(0, -1).join("/")
      };

      console.log("Full path:", require('path').resolve(fullPath));
      console.log("Source:", src);
      console.log("Options:", options);

      await Image(fullPath, options);
      let metadata = Image.statsSync(fullPath, options);
      console.log("Metadata:", metadata);

      return metadata[format][0].url;
  } catch (error) {
      console.error("Error in imageUrl shortcode:", error);
      return "";
  }
}


module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "./src/stylesheets/*.css": "stylesheets",
    "./src/scripts/*.js": "scripts",
    "./src/project/**/assets/*": "project/assets",
    "./src/note/images/*": "note/images",
    "./src/assets/**/*": "assets",
    "./src/journal/*.png": "journal",
    "./src/journal/*.jpg": "journal",
    "./src/photostream/*.jpg": "photostream",
    "./src/CNAME": ".",
  });


  ////////////////////
  // Shortcodes     //
  ////////////////////

  eleventyConfig.addShortcode("imageUrl", imageUrlShortcode);
    
  ////////////////////
  // Plugins        //
  ////////////////////

  eleventyConfig.addPlugin(syntaxHighlight, {
    templateFormats: ["css", "md", "liquid", "html", "js"]
  });
      
  // PostCSS Processing
    eleventyConfig.on('afterBuild', () => {
      console.log("Processing CSS with PostCSS ... ");
      execSync('npx postcss src/stylesheets/style.css -o public/stylesheets/style.css');
      console.log("Done processing the CSS!");
  });

  const markdownItOptions = {
      html: true,
      breaks: true,
      linkify: false
  };

  const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs);
  eleventyConfig.setLibrary('md', markdownLib);

  ////////////////////
  // Custom Filters //
  ////////////////////

  eleventyConfig.addFilter("markdownify", function(filePath) {
      let markdownContent = fs.readFileSync(filePath, 'utf8');
      return markdownLib.render(markdownContent);
  });

  eleventyConfig.addFilter("distanceToNowDate", (date) => {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
        zone: "Europe/Amsterdam",
    }).setLocale('en').toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addFilter("bust", (url) => {
    const [urlPart, paramPart] = url.split("?");
    const params = new URLSearchParams(paramPart || "");
    params.set("v", DateTime.local().toFormat("X"));
    return `${urlPart}?${params}`;
  });

  eleventyConfig.addFilter("journalDateFormat", function(date) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return DateTime.fromJSDate(date, {zone: 'utc'}).toFormat("LLL yyyy");
  });

  eleventyConfig.addFilter("extractMonth", function(dateString) {
    return dateString.split(' ')[0];
  });

  eleventyConfig.addFilter('latestJournalRedirect', function(collection) {
    const latestEntry = collection[0];
    return latestEntry.url;
  });

  // For Album reviews previous and next
  eleventyConfig.addFilter("findIndex", (array, findFn) => {
    return array.findIndex(findFn);
  });

  eleventyConfig.addFilter("findReviewNeighbors", function(reviews, currentPageUrl) {
    const currentIndex = reviews.findIndex(review => review.url === currentPageUrl);
  
    let prevReview = null;
    let nextReview = null;

    for (let i = currentIndex - 1; i >= 0; i--) {
      if (reviews[i].data.status !== 'reviewing') {
        prevReview = reviews[i];
        break;
      }
    }
  
    for (let i = currentIndex + 1; i < reviews.length; i++) {
      if (reviews[i].data.status !== 'reviewing') {
        nextReview = reviews[i];
        break; 
      }
    }
  
    return { prevReview, nextReview };
  });

  ////////////////////////
  //    Collections    //
  ///////////////////////

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

  eleventyConfig.addCollection("photostream", function(collection) {
    return collection.getFilteredByGlob("./src/photostream/*.md").sort((a, b) => {
        return b.data.date - a.data.date;
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

    reviewsArray.sort((a, b) => a.data.created - b.data.created);

    let reviewsObject = {};
    reviewsArray.forEach(item => {
        reviewsObject[item.data.mbid] = item.url;
    });

    return reviewsObject;
  });

  eleventyConfig.addCollection("reviews", function(collectionApi) {
      return collectionApi.getFilteredByGlob("./src/review/*.md").sort((a, b) => {
          return new Date(b.data.created) - new Date(a.data.created);
      });
  });
    
  eleventyConfig.addCollection("journal", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./src/journal/*.md").sort((a, b) => {
        return new Date(b.data.date) - new Date(a.data.date);
    });
  });

  eleventyConfig.addCollection("combinedNotesReviews", function(collectionApi) {
    let notes = collectionApi.getFilteredByGlob("./src/note/*.md").map(item => {
        item.data.type = "note";
        return item;
    });

    let reviews = collectionApi.getFilteredByGlob("./src/review/*.md").map(item => {
        item.data.type = "review"; 
        return item;
    });

    let combined = notes.concat(reviews);

    combined.sort((a, b) => {
        return new Date(b.data.created) - new Date(a.data.created);
    });

    return combined;
  });
    
    return {
        dir: {
            input: "src",
            output: "public",
        },
    };
};