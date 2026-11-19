import style from "./fooddisplay.module.css";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ foods, onSelect }) => {
  return (
    <div className={style.FoodDisplay} id="fooddisplay">
      <div className={style.FoodDisplayList}>
        {foods.map((item, index) => (
          <FoodItem
            key={item._id}
            id={item._id}
            name={item.name}
            category={item.category}
            description={item.description}
            price={item.price}
            image={item.image}
            onSelect={() => onSelect(item)}
            style={{ "--card-index": index }}
          />
        ))}
        {foods.length === 0 && (
          <div className={style.empty}>
            <strong>No dishes found</strong>
            <p>Try another category or clear your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
