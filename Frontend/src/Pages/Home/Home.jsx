import { useContext, useState } from 'react'
import style from './home.module.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import AppDownload from '../../components/AppDownload/AppDownload'
import { StoreContext } from '../../context/StoreContext'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import FoodStory from '../../components/FoodStory/FoodStory'

const Home = () => {

  const [category,setCategory] = useState("All")
  const { food_list, recentlyViewed, URl } = useContext(StoreContext)
  const recentItems = recentlyViewed.map((id) => food_list.find((item) => item._id === id)).filter(Boolean).slice(0,4)


  return (
    <div className={style.a1}>
      <Header />
      <ScrollReveal><ExploreMenu category={category} setCategory={setCategory} /></ScrollReveal>
      <FoodStory onChooseCategory={setCategory} />
      {recentItems.length > 0 && (
        <ScrollReveal><section className={style.recent}>
          <p>Jump back in</p>
          <h2>Recently viewed</h2>
          <div className={style.recentGrid}>
            {recentItems.map((item) => (
              <a href={`/food/${item._id}`} className={style.recentCard} key={item._id}>
                <img src={`${URl}/images/${item.image}`} alt={item.name} loading="lazy" />
                <div><strong>{item.name}</strong><span>${item.price}</span></div>
              </a>
            ))}
          </div>
        </section></ScrollReveal>
      )}
      <ScrollReveal><AppDownload/></ScrollReveal>
    </div>
  );
}

export default Home