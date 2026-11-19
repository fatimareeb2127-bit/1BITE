import { useContext, useEffect, useRef, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import styles from "./foodDetailsModal.module.css";

const formatPrice = (price) => `$${Number(price).toLocaleString("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})}`;

const FoodDetailsModal = ({ food, onClose }) => {
  const { URl, addToCart } = useContext(StoreContext);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  const addSelectedQuantity = async () => {
    setAdding(true);
    try {
      await addToCart(food._id, quantity);
      onClose();
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !adding) onClose();
      }}
    >
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="food-modal-title"
        aria-describedby="food-modal-description"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close dish details"
        >
          ×
        </button>
        <div className={styles.imageWrap}>
          <img src={`${URl}/images/${food.image}`} alt={food.name} />
          <span>{food.category}</span>
        </div>
        <div className={styles.details}>
          <p className={styles.eyebrow}>From the 1BITE menu</p>
          <h2 id="food-modal-title">{food.name}</h2>
          <p id="food-modal-description" className={styles.description}>
            {food.description}
          </p>
          <div className={styles.priceLine}>
            <span>Price per dish</span>
            <strong>{formatPrice(food.price)}</strong>
          </div>
          <div className={styles.orderRow}>
            <div className={styles.quantity} aria-label={`Quantity: ${quantity}`}>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                aria-label="Decrease quantity"
                disabled={quantity <= 1 || adding}
              >
                −
              </button>
              <output aria-live="polite">{quantity}</output>
              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                aria-label="Increase quantity"
                disabled={adding}
              >
                +
              </button>
            </div>
            <strong className={styles.total} aria-live="polite">
              {formatPrice(Number(food.price) * quantity)}
            </strong>
          </div>
          <button
            type="button"
            className={styles.addButton}
            onClick={addSelectedQuantity}
            disabled={adding}
          >
            {adding ? "Adding…" : "Add to cart"}
            <span>{adding ? "" : "→"}</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default FoodDetailsModal;
