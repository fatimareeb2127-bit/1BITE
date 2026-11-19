import style from './header.module.css'

const Header = () => {
  return (
    <div className={style.header}>
        <div className={style.eyebrow}><span /> Fresh picks, delivered</div>
        <div className={style.headerContent}>
            <h1>Made with care.<br/><em>Delivered with joy.</em></h1>
            <p>Explore a carefully made menu and get your favorites delivered fresh to your door.</p>
            <a href="#ExploreMenu" className={style.cta}>Explore menu <span>→</span></a>
        </div>
        <div className={style.visual} aria-hidden="true">
          <div className={style.orbit} />
          <img src="/header_img.jpg" alt="" />
        </div>
    </div>
  )
}

export default Header