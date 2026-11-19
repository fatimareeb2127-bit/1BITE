import { useCallback, useContext, useMemo, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import FoodDisplay from "../foodDisplay/FoodDisplay";
import FoodDetailsModal from "../FoodDetailsModal/FoodDetailsModal";
import styles from "./explore.module.css";

const formatPrice = (price) => `$${Number(price).toLocaleString("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})}`;

const ExploreMenu = ({ category, setCategory }) => {
  const { food_list, URl, searchQuery, setSearchQuery, addToCart } = useContext(StoreContext);
  const [sort, setSort] = useState("featured");
  const [selectedFood, setSelectedFood] = useState(null);
  const closeDetails = useCallback(() => setSelectedFood(null), []);

  const categories = useMemo(() => {
    const seen = new Set();
    return food_list.reduce((result, food) => {
      const name = food.category?.trim();
      const key = name?.toLocaleLowerCase();
      if (name && !seen.has(key)) {
        seen.add(key);
        result.push(name);
      }
      return result;
    }, []);
  }, [food_list]);

  const categoryCounts = useMemo(() => food_list.reduce((counts, food) => {
    const key = food.category?.toLocaleLowerCase();
    if (key) counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {}), [food_list]);

  const visibleFoods = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    const filtered = food_list.filter((food) => {
      const matchesCategory = category === "All"
        || food.category?.toLocaleLowerCase() === category.toLocaleLowerCase();
      const matchesSearch = !query
        || `${food.name} ${food.category} ${food.description}`.toLocaleLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-high") return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [category, food_list, searchQuery, sort]);

  const featuredFoods = useMemo(() => {
    const firstFromCategory = new Map();
    food_list.forEach((food) => {
      const key = food.category?.toLocaleLowerCase();
      if (key && !firstFromCategory.has(key)) firstFromCategory.set(key, food);
    });
    return [...firstFromCategory.values()].slice(0, 3);
  }, [food_list]);

  const chooseCategory = (nextCategory) => {
    setCategory(nextCategory);
  };

  return (
    <section className={styles.ExploreMenu} id="ExploreMenu" aria-labelledby="menu-heading">
      <header className={styles.heading}>
        <p className={styles.eyebrow}><span /> A little something for every craving</p>
        <div className={styles.headingRow}>
          <div>
            <h1 id="menu-heading">Explore the <em>menu.</em></h1>
            <p className={styles.intro}>
              Fresh finds, comforting favorites, and something sweet to finish.
              Find a dish that feels like just the thing.
            </p>
          </div>
          <a className={styles.browseLink} href="#dish-results">
            Browse all dishes <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>

      <div className={styles.categorySection}>
        <div className={styles.categoryHeading}>
          <div>
            <p className={styles.kicker}>Find your flavor</p>
            <h2>Browse by category</h2>
          </div>
          <span className={styles.categoryCount}>{categories.length} categories</span>
        </div>
        <nav className={styles.categoryList} aria-label="Food categories">
          <button
            type="button"
            className={`${styles.categoryButton} ${category === "All" ? styles.categoryActive : ""}`}
            onClick={() => chooseCategory("All")}
            aria-pressed={category === "All"}
          >
            <span className={styles.allIcon} aria-hidden="true">✳</span>
            <span className={styles.categoryLabel}>Everything</span>
            <span className={styles.categoryNumber}>{food_list.length}</span>
          </button>
          {categories.map((name) => {
            const representative = food_list.find((food) => food.category?.toLocaleLowerCase() === name.toLocaleLowerCase());
            const isActive = category.toLocaleLowerCase() === name.toLocaleLowerCase();
            return (
              <button
                type="button"
                key={name}
                className={`${styles.categoryButton} ${isActive ? styles.categoryActive : ""}`}
                onClick={() => chooseCategory(name)}
                aria-pressed={isActive}
              >
                {representative && (
                  <img
                    className={styles.categoryImage}
                    src={`${URl}/images/${representative.image}`}
                    alt=""
                    loading="lazy"
                  />
                )}
                <span className={styles.categoryLabel}>{name}</span>
                <span className={styles.categoryNumber}>{categoryCounts[name.toLocaleLowerCase()]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {featuredFoods.length > 0 && (
        <section className={styles.featured} aria-labelledby="featured-heading">
          <div className={styles.featuredHeading}>
            <div>
              <p className={styles.kicker}>A taste of the menu</p>
              <h2 id="featured-heading">A few good things.</h2>
            </div>
            <span>Selected from the full menu</span>
          </div>
          <div className={styles.featuredGrid}>
            {featuredFoods.map((food, index) => (
              <article
                className={`${styles.featuredCard} ${index === 0 ? styles.featuredLead : ""}`}
                key={food._id}
              >
                <img
                  src={`${URl}/images/${food.image}`}
                  alt={food.name}
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <div className={styles.featuredShade} />
                <div className={styles.featuredCopy}>
                  <span>{food.category}</span>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <div className={styles.featuredActions}>
                    <strong>{formatPrice(food.price)}</strong>
                    <button
                      type="button"
                      onClick={() => setSelectedFood(food)}
                      aria-label={`View ${food.name} details`}
                    >
                      Discover <span aria-hidden="true">↗</span>
                    </button>
                    <button
                      type="button"
                      className={styles.quickAdd}
                      onClick={() => addToCart(food._id)}
                      aria-label={`Add ${food.name} to cart`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className={styles.menuResults} id="dish-results" aria-labelledby="results-heading">
        <div className={styles.resultsHeading}>
          <div>
            <p className={styles.kicker}>The good stuff</p>
            <h2 id="results-heading">
              {category === "All" ? "The full menu" : category}
              <span className={styles.resultCount}>{visibleFoods.length}</span>
            </h2>
          </div>
          <div className={styles.controls}>
            <label className={styles.searchBox}>
              <span className={styles.searchIcon} aria-hidden="true">⌕</span>
              <span className={styles.visuallyHidden}>Search dishes</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search the menu"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search">
                  ×
                </button>
              )}
            </label>
            <label className={styles.sortBox}>
              <span className={styles.visuallyHidden}>Sort dishes</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">Featured order</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>
        </div>
        <FoodDisplay foods={visibleFoods} onSelect={setSelectedFood} />
      </section>

      {selectedFood && (
        <FoodDetailsModal
          food={selectedFood}
          onClose={closeDetails}
        />
      )}
    </section>
  );
};

export default ExploreMenu;
