const fs = require("fs");
const markdownIt = require("markdown-it");
const markdownItAttrs = require('markdown-it-attrs')
const md = new markdownIt();
const { formatDistanceToNow } = require('date-fns');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/stylesheets/*.css");
    eleventyConfig.addPassthroughCopy("./src/scripts/*.js");
    eleventyConfig.addPassthroughCopy("./src/project/**/assets/*");
    eleventyConfig.addPassthroughCopy("./src/note/images/*");
    eleventyConfig.addPassthroughCopy("./src/assets/**/*");
    eleventyConfig.addPassthroughCopy("./src/CNAME");
    
    eleventyConfig.addPlugin(
        require("@11ty/eleventy-plugin-syntaxhighlight"),
        {
        templateFormats: ["css", "md", "liquid", "html", "js"]
        }
      );

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

    eleventyConfig.addCollection("albumReviews", function(collectionApi) {
        let reviews = {};
        collectionApi.getFilteredByGlob("./src/review/*.md").forEach(item => {
            if(item.data.mbid) {
                reviews[item.data.mbid] = item.url;
            }
        });
        return reviews;
    });

    eleventyConfig.addCollection("reviews", function(collectionApi) {
        return collectionApi.getFilteredByGlob("./src/review/*.md");
    });
              
    return {
        dir: {
            input: "src",
            output: "public",
        },
    };
};