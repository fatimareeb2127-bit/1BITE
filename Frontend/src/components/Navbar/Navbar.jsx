import { useContext, useState } from "react";
import style from "../Navbar/navbar.module.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  // useState used here for menu
  const [menu, setMenu] = useState("home");
  const [searchOpen,setSearchOpen] = useState(false)
  const [mobileOpen,setMobileOpen] = useState(false)

  const { token, setToken, searchQuery, setSearchQuery, wishlist, cartItem } = useContext(StoreContext)

  const navigate = useNavigate()
  const Logout = () => {
    localStorage.removeItem("token")
    setToken("")
    navigate("/")
  }

  return (
    <>
    <header className={style.Navbar}>
      <Link to="/" className={style.brand}><img src={assets.logo} className={style.logo} alt="1BITE" /></Link>
      <nav className={`${style.navbarMenu} ${mobileOpen ? style.mobileOpen : ""}`}>
        <Link to="/" className={menu === "home" ? style.active : ""} onClick={() => {setMenu("home");setMobileOpen(false)}}>Home</Link>
        <a href="/#ExploreMenu" className={menu === "menu" ? style.active : ""} onClick={() => {setMenu("menu");setMobileOpen(false)}}>Menu</a>
        <Link to="/myorders" onClick={() => setMobileOpen(false)}>Orders</Link>
        <Link to="/wishlist" onClick={() => setMobileOpen(false)}>Saved {wishlist.length > 0 && <span className={style.navCount}>{wishlist.length}</span>}</Link>
      </nav>
      <div className={style.navbarRight}>
        <button className={style.iconButton} onClick={() => setSearchOpen(true)} aria-label="Search menu">
          <img src={assets.search_icon} alt="" />
        </button>
        <Link className={style.cartButton} to='/cart' aria-label="Open cart">
          <img src={assets.basket_icon} alt="" />
          {Object.values(cartItem).some((quantity) => quantity > 0) && <span>{Object.values(cartItem).reduce((sum, quantity) => sum + quantity, 0)}</span>}
        </Link>
        {!token ? <button
          onClick={() => {
            setShowLogin(true);
          }}
        >
          Sign in
        </button> : <div className={style.navbarProfile}>
          <img src={assets.profile_icon} />
          <ul className={style.navProfileDropdown}>
            <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} /><p>Orders</p></li>
            <hr />
            <li onClick={Logout}><img src={assets.logout_icon} /><p>Logout</p></li>
          </ul>
        </div>}
        <button className={`${style.mobileToggle} ${mobileOpen ? style.open : ""}`} onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle navigation">
          <span /><span />
        </button>
      </div>
    </header>
    {searchOpen && (
      <div className={style.searchOverlay} role="dialog" aria-modal="true">
        <button className={style.searchClose} onClick={() => setSearchOpen(false)} aria-label="Close search">×</button>
        <div className={style.searchPanel}>
          <p>Find your next favorite</p>
          <input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search dishes or categories" />
          {searchQuery && <button className={style.clearSearch} onClick={() => setSearchQuery("")}>Clear</button>}
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;
