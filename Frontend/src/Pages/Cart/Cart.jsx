import { useContext } from "react";
import style from "./cart.module.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItem, food_list, removeFromCart, addToCart, getTotalCartAmount , URl} = useContext(StoreContext);

  const navigate = useNavigate();
  const hasItems = Object.values(cartItem).some((quantity) => quantity > 0);

  if (!hasItems) {
    return (
      <div className={style.empty}>
        <span>○</span>
        <h1>Your cart is empty</h1>
        <p>Explore the menu and add something delicious.</p>
        <button onClick={() => navigate("/")}>Browse menu</button>
      </div>
    )
  }

  return (
    <div className={style.Cart}>
      <div className={style.CartItems}>
        <div className={style.CartItemsTitle}>
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItem[item._id] > 0) {
            return (
              <div key={item._id}>
                <div
                  className={`${style.CartItemsTitle} ${style.CartItemsItem}`}
                >
                  <img src={URl+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItem[item._id]}</p>
                  <p>${item.price * cartItem[item._id]}</p>
                  <div className={style.quantity}>
                    <button onClick={() => removeFromCart(item._id)} aria-label="Decrease quantity">−</button>
                    <span>{cartItem[item._id]}</span>
                    <button onClick={() => addToCart(item._id)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className={style.CartBottom}>
        <div className={style.CartTotal}>
          <h2>Cart Total</h2>
          <div>
            <div className={style.CartTotalDetails}>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className={style.CartTotalDetails}>
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount()===0?0:5}</p> 
            </div> 
            <hr />
            <div className={style.CartTotalDetails}>
              <b>Total</b>
              <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+5}</b>
            </div>
          </div>
          <button onClick={()=>navigate('/placeorder')}>Checkout</button>
        </div>
        <div className={style.CartPromoCode}>
          <div>
            <p>If you have promo code then add here</p>
            <div className={style.CartPromoCodeInput}>
              <input type="text" placeholder="Promocode" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
