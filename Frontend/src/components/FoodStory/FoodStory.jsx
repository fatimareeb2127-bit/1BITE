import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import styles from "./foodStory.module.css";

const scenes = [
  {
    category: "Salad",
    eyebrow: "01 / Fresh starts",
    title: "A little lighter. A lot of flavor.",
    description: "Meet crisp, colorful favorites for when fresh is exactly what you’re craving.",
  },
  {
    category: "Rolls",
    eyebrow: "02 / Wrapped up",
    title: "Big flavor, ready to go.",
    description: "Find a savory roll for lunch, a quick bite, or whenever hunger calls.",
  },
  {
    category: "Pasta",
    eyebrow: "03 / Comfort food",
    title: "Twirl into something good.",
    description: "Creamy, cheesy, tomato-rich and more—browse the pasta picks on our menu.",
  },
  {
    category: "Dessert",
    eyebrow: "04 / Sweet finish",
    title: "Save room for the good part.",
    description: "Make the moment a little sweeter with a cool scoop or a soft slice.",
  },
];

const FoodStory = ({ onChooseCategory }) => {
  const { food_list, URl, addToCart } = useContext(StoreContext);
  const sectionRef = useRef(null);
  const [activeScene, setActiveScene] = useState(0);

  const featuredFoods = useMemo(() => scenes.map((scene, index) => {
    const categoryMatches = food_list.filter((food) =>
      food.category.toLowerCase() === scene.category.toLowerCase() ||
      (scene.category === "Dessert" && food.category.toLowerCase() === "deserts")
    );
    return categoryMatches[index % Math.max(categoryMatches.length, 1)] || food_list[index] || null;
  }), [food_list]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const targets = section.querySelectorAll("[data-story-scene]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveScene(Number(entry.target.getAttribute("data-story-scene")));
        }
      });
    }, { threshold: 0.55 });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const activeFood = featuredFoods[activeScene];
  const activeCopy = scenes[activeScene];

  const exploreCategory = (category) => {
    onChooseCategory(category);
    document.getElementById("fooddisplay")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className={styles.story} ref={sectionRef} aria-label="A taste of the menu">
      <div className={styles.intro}>
        <p>Made for every kind of craving</p>
        <h2>One menu.<br /><em>Many good moments.</em></h2>
      </div>
      <div className={styles.sequence}>
        <div className={styles.pin}>
          <div className={styles.visual}>
            {activeFood ? (
              <Link to={`/food/${activeFood._id}`} className={styles.foodLink}>
                <img
                  key={activeFood._id}
                  src={`${URl}/images/${activeFood.image}`}
                  alt={activeFood.name}
                  className={styles.foodImage}
                />
              </Link>
            ) : (
              <div className={styles.imagePlaceholder} aria-hidden="true">1B</div>
            )}
            <div className={styles.visualTop}><span>1BITE PICKS</span><span>0{activeScene + 1} — 04</span></div>
            {activeFood && (
              <div className={styles.foodCaption}>
                <div>
                  <span>{activeCopy.category}</span>
                  <strong>{activeFood.name}</strong>
                </div>
                <b>${activeFood.price}</b>
              </div>
            )}
            <div className={styles.progress} aria-hidden="true"><span style={{ transform: `scaleX(${(activeScene + 1) / scenes.length})` }} /></div>
          </div>
        </div>
        <div className={styles.scenes}>
          {scenes.map((scene, index) => {
            const food = featuredFoods[index];
            return (
              <article
                className={`${styles.scene} ${activeScene === index ? styles.sceneActive : ""}`}
                data-story-scene={index}
                key={scene.category}
              >
                <p className={styles.eyebrow}>{scene.eyebrow}</p>
                <h3>{scene.title}</h3>
                <p className={styles.description}>{scene.description}</p>
                {food && (
                  <button className={styles.addButton} onClick={() => addToCart(food._id)}>
                    Add {food.name} · ${food.price} <span>+</span>
                  </button>
                )}
                <button className={styles.categoryLink} onClick={() => exploreCategory(scene.category)}>
                  Explore {scene.category} <span>↗</span>
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FoodStory;
