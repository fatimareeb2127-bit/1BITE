import { useContext } from "react";
import styles from "./fooditem.module.css";
import { StoreContext } from "../../context/StoreContext";
import { Link } from "react-router-dom";

const formatPrice = (price) => `$${Number(price).toLocaleString("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})}`;

const FoodItem = ({ id, name, category, price, description, image, onSelect, style: itemStyle }) => {
  const { cartItem, addToCart, removeFromCart, URl, wishlist, toggleWishlist, addToRecent } = useContext(StoreContext);
  const saved = wishlist.includes(id);
  const quantity = cartItem[id] || 0;
  const openDetails = () => {
    addToRecent(id);
    onSelect?.();
  };

  return (
    <article className={styles.FoodItem} style={itemStyle}>
      <div className={styles.FoodItemImageContainer}>
        {onSelect ? (
          <button
            type="button"
            className={styles.imageButton}
            onClick={openDetails}
            aria-label={`View ${name} details`}
          >
            <img className={styles.FoodItemImage} src={`${URl}/images/${image}`} alt={name} loading="lazy" />
          </button>
        ) : (
          <Link to={`/food/${id}`} onClick={() => addToRecent(id)} className={styles.imageButton}>
            <img className={styles.FoodItemImage} src={`${URl}/images/${image}`} alt={name} loading="lazy" />
          </Link>
        )}
        <button
          type="button"
          className={`${styles.wishlist} ${saved ? styles.saved : ""}`}
          onClick={() => toggleWishlist(id)}
          aria-label={saved ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          aria-pressed={saved}
        >
          {saved ? "♥" : "♡"}
        </button>
        {quantity === 0 ? (
          <button
            type="button"
            className={styles.add}
            onClick={() => addToCart(id)}
            aria-label={`Add ${name} to cart`}
          >
            +
          </button>
        ) : (
          <div className={styles.FoodItemCount} aria-label={`${quantity} ${name} in cart`}>
            <button type="button" onClick={() => removeFromCart(id)} aria-label={`Remove one ${name} from cart`}>−</button>
            <output aria-live="polite">{quantity}</output>
            <button type="button" onClick={() => addToCart(id)} aria-label={`Add one ${name} to cart`}>+</button>
          </div>
        )}
      </div>
      <div className={styles.FoodItemInfo}>
        <div className={styles.nameRow}>
          {onSelect ? (
            <button type="button" className={styles.nameButton} onClick={openDetails}>{name}</button>
          ) : (
            <Link to={`/food/${id}`} onClick={() => addToRecent(id)} className={styles.nameButton}>{name}</Link>
          )}
          <span className={styles.price}>{formatPrice(price)}</span>
        </div>
        {category && <span className={styles.FoodItemCategory}>{category}</span>}
        <p className={styles.FoodItemDescription}>{description}</p>
        {onSelect ? (
          <button type="button" className={styles.detailsLink} onClick={openDetails}>
            Dish details <span aria-hidden="true">↗</span>
          </button>
        ) : (
          <Link className={styles.detailsLink} to={`/food/${id}`} onClick={() => addToRecent(id)}>
            Dish details <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </article>
  );
};

export default FoodItem;
