import './Navbar.css'
import logo from '../../assets/Logo.png'

const Navbar = () => {
  return (
    <div className='Navbar'>
      <img className='logo' src={logo} alt="1BITE" />
      <div className='admin-mark' aria-label='1BITE admin'>1</div>
    </div>
  )
}

export default Navbar
