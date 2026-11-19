import style from './footer.module.css'
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div className={style.Footer} id="Footer">
      <div className={style.FooterContent}>
        <div className={style.FooterContentLeft}>
            <img src={assets.logo} alt=""  className={style.logo}/>
            <p>Fresh favorites, thoughtful choices, and a simpler way to enjoy food at home.</p>
            <div className={style.FooterSocial}>
                <img src={assets.facebook_icon} alt="" /><img src={assets.twitter_icon} alt="" /><img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className={style.FooterContentMiddle}>
            <h2>
                COMPANY
            </h2>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><a href="#ExploreMenu">Menu</a></li>
                <li><Link to="/myorders">My orders</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
            </ul>
        </div>
        <div className={style.FooterContentRight}>
            <h2>Get In Touch</h2>
            <ul>
                <li>0123456789</li>
                <li>hello@1bite.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className={style.FooterCopyrigth}>
        CopyRight 2022 ©️ Company.com - All Rights Reserved.
      </p>
    </div>
  );
}

export default Footer