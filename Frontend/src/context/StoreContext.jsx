import { createContext, useEffect, useState } from "react";
export const StoreContext = createContext(null);
import axios from "axios";

const StoreContextProvider = (props) => {
  const [cartItem, setCartItems] = useState({});
  const URl = "http://localhost:4000"
  const [token , setToken] = useState("")
  const [food_list,setFoodList] = useState([])
  const [searchQuery,setSearchQuery] = useState("")
  const [wishlist,setWishlist] = useState(() => {
    const saved = localStorage.getItem("1bite-wishlist")
    return saved ? JSON.parse(saved) : []
  })
  const [recentlyViewed,setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem("1bite-recent")
    return saved ? JSON.parse(saved) : []
  })
  const [toast,setToast] = useState("")

  const showToast = (message) => {
    setToast(message)
  }

  useEffect(() => {
    localStorage.setItem("1bite-wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem("1bite-recent", JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(""), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const toggleWishlist = (itemId) => {
    setWishlist((prev) => {
      const exists = prev.includes(itemId)
      showToast(exists ? "Removed from saved dishes" : "Saved to your wishlist")
      return exists ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    })
  }

  const addToRecent = (itemId) => {
    setRecentlyViewed((prev) => [itemId, ...prev.filter((id) => id !== itemId)].slice(0, 8))
  }

  const addToCart = async (itemId, quantity = 1) => {
    const amount = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + amount }));

    if (token) {
      for (let count = 0; count < amount; count += 1) {
        await axios.post(URl+"/api/cart/add", {itemId}, {headers: {token}})
      }
    }
    showToast(amount === 1 ? "Added to your cart" : `Added ${amount} to your cart`)

  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(URl+"/api/cart/remove", {itemId}, {headers: {token}})
    }
    showToast("Cart updated")
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
            totalAmount += itemInfo.price * cartItem[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async ()=>{
    const response = await axios.get(URl+"/api/food/list")
    setFoodList(response.data.data)
  }

  const loadcartData = async (token) => {
    const response = await axios.post(URl+"/api/cart/get",{}, {headers: {token}})
    setCartItems(response.data.cartData)
  }

  // To not logout When refreshed
  useEffect(()=>{
    async function loaddata () {
      await fetchFoodList()
      if(localStorage.getItem("token")){
        setToken(localStorage.getItem("token"))
        await loadcartData(localStorage.getItem("token"));
      }
    }
    loaddata()
  },[])

  const contextValue = {
    food_list,
    cartItem,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    URl,
    token,
    setToken,
    searchQuery,
    setSearchQuery,
    wishlist,
    toggleWishlist,
    recentlyViewed,
    addToRecent,
    toast,
    showToast
  };



  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
