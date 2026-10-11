module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("layout", "layouts/content.njk");
  eleventyConfig.addGlobalData("currentYear", new Date().getFullYear());
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("uploads");
  eleventyConfig.addWatchTarget("assets");
  eleventyConfig.addFilter("dateReadable", (dateValue) => {
    if (!dateValue) return "Date not specified";
    const date = new Date(dateValue);
    return Number.isNaN(date.getTime())
      ? dateValue
      : date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  });
  eleventyConfig.addCollection("destinations", (api) =>
    api.getFilteredByGlob("content/destinations/*.md").sort((a, b) =>
      (a.data.title || "").localeCompare(b.data.title || "")
    )
  );
  eleventyConfig.addCollection("stories", (api) =>
    api.getFilteredByGlob("content/stories/*.md").sort((a, b) =>
      new Date(b.data.date || 0) - new Date(a.data.date || 0)
    )
  );
  eleventyConfig.addCollection("itineraries", (api) =>
    api.getFilteredByGlob("content/itineraries/*.md")
  );
  eleventyConfig.addCollection("providers", (api) =>
    api.getFilteredByGlob("content/providers/*.md")
  );
  return {
    dir: { input: ".", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
