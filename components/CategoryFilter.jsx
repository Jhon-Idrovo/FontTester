const categories = [
  { category: "sans-serif", exp: "sans-serif" },
  { category: "serif", exp: "serif" },
  { category: "monospace", exp: "Roboto Mono" },
  { category: "handwriting", exp: "MonteCarlo" },
  { category: "display", exp: "Lobster" },
];

function CategoryFilter({ filters, handleCategoryFilter }) {
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
