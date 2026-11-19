import { useState } from 'react'
import { useContext } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Cart from './Pages/Cart/Cart'
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopUp from './components/Login/LoginPopUp'
import Verify from './Pages/Verify/Verify'
import MyOrders from './Pages/Orders/MyOrders'
import FoodDetails from './Pages/FoodDetails/FoodDetails'
import Wishlist from './Pages/Wishlist/Wishlist'
import { StoreContext } from './context/StoreContext'


const App = () => {
  const [showLogin,setShowLogin] = useState(false)
  const { toast } = useContext(StoreContext)
  return (
    <>
      {showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </div>
      <Footer />
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

export default App