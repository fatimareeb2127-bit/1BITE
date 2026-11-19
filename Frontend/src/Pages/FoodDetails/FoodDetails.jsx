import { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../../components/FoodItem/FoodItem";
import styles from "./foodDetails.module.css";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { food_list, URl, cartItem, addToCart, removeFromCart, addToRecent } = useContext(StoreContext);
  const item = food_list.find((food) => food._id === id);

  useEffect(() => {
    if (id) addToRecent(id);
  }, [id]);

  if (!item) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <h1>Dish not found</h1>
          <Link to="/">Back to menu</Link>
        </div>
      </main>
    );
  }

  const related = food_list.filter((food) => food.category === item.category && food._id !== item._id).slice(0, 3);

  return (
    <main className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>
      <section className={styles.hero}>
        <div className={styles.imageWrap}>
          <img src={`${URl}/images/${item.image}`} alt={item.name} />
        </div>
        <div className={styles.info}>
          <p className={styles.category}>{item.category}</p>
          <h1>{item.name}</h1>
          <h2 className={styles.aboutTitle}>About this dish</h2>
          <p className={styles.description}>{item.description}</p>
          <div className={styles.priceRow}>
            <strong>${item.price}</strong>
            {cartItem[item._id] ? (
              <div className={styles.quantity}>
                <button onClick={() => removeFromCart(item._id)} aria-label="Decrease quantity">−</button>
                <span>{cartItem[item._id]}</span>
                <button onClick={() => addToCart(item._id)} aria-label="Increase quantity">+</button>
              </div>
            ) : (
              <button className={styles.add} onClick={() => addToCart(item._id)}>Add to cart</button>
            )}
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className={styles.related}>
          <p>More to love</p>
          <h2>You may also like</h2>
          <div className={styles.grid}>
            {related.map((food) => (
              <FoodItem key={food._id} id={food._id} name={food.name} category={food.category} description={food.description} price={food.price} image={food.image} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default FoodDetails;
