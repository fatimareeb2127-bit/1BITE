import { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../../components/FoodItem/FoodItem";
import styles from "./wishlist.module.css";

const Wishlist = () => {
  const { food_list, wishlist } = useContext(StoreContext);
  const savedItems = food_list.filter((item) => wishlist.includes(item._id));

  return (
    <main className={styles.page}>
      <div className={styles.heading}>
        <p>Saved for later</p>
        <h1>Your wishlist</h1>
      </div>
      {savedItems.length ? (
        <div className={styles.grid}>
          {savedItems.map((item) => (
            <FoodItem key={item._id} id={item._id} name={item.name} category={item.category} description={item.description} price={item.price} image={item.image} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span>♡</span>
          <h2>No saved dishes yet</h2>
          <p>Tap the heart on a dish to keep it here.</p>
          <Link to="/">Explore the menu</Link>
        </div>
      )}
    </main>
  );
};

export default Wishlist;
