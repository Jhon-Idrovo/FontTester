const categories = [
  { category: "sans-serif", exp: "sans-serif" },
  { category: "serif", exp: "serif" },
  { category: "monospace", exp: "Roboto Mono" },
  { category: "handwriting", exp: "MonteCarlo" },
  { category: "display", exp: "Lobster" },
];

function CategoryFilter({ filters, setTexts }) {
  /**
   * Removes or adds the category to the active text area filters accordingly
   * @param {string} category one of the 5 google font categories
   */
  const handleCategoryFilter = (category) => {
    //add the category to the filters array on the texts variable if it's in it. Otherwise
    //remove it
    setTexts((texts) => {
      const activeTextFilters = texts[activeTextIndex].filters;
      activeTextFilters.includes(category)
        ? activeTextFilters.splice(activeTextFilters.indexOf(category), 1)
        : activeTextFilters.push(category);
      //force re-rendering
      return JSON.parse(JSON.stringify(texts));
    });
  };
  return (
    <div className="flex w-full justify-center ml-11">
      {/* {categories.map((category) => (
        <h2 style={{ fontFamily: category }}>F</h2>
      ))} */}
      {categories.map(({ category, exp }) => (
        <h2
          style={{ fontFamily: exp }}
          className={`filter-item ${
            !filters.includes(category) ? "filter-on" : ""
          }`}
          onClick={() => handleCategoryFilter(category)}
        >
          F
          <span className="hidden-tooltip" style={{ fontFamily: exp }}>
            {category}
          </span>
        </h2>
      ))}
    </div>
  );
}

export default CategoryFilter;
