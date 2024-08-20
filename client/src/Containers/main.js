import React, { useEffect } from 'react'
import { Home, Header, HomeSlider, FilterSection ,Cart} from '../Components'
import { useDispatch, useSelector } from 'react-redux'
import { displayProfile, getAllProducts } from '../api'
import { setAllProducts } from '../Context/Actions/productActions'
import { setCartItems } from '../Context/Actions/cartActions'
import { setProfile } from "../Context/Actions/profileActions";
import { profile, validateUserJWTToken } from "../api";
const Main = () => {
  const product = useSelector(state => state.product)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const displayCart=useSelector(state=>state.displayCart)
  useEffect(() => {
   
    if (!product) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      })
    }
    
  }, [])


  return (
    <main className="w-screen h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 overflow-auto scrollbar-none ">
        <div className="w-full flex flex-col items-center justify-center mt-40 px-6 md:px-24 2xl:px-96 gap-12 pb-24">
          <Home />
          <HomeSlider />
          
          <FilterSection  />
          
          
         {user && (displayCart && <Cart/>)}
        </div>
      </div>
  
    </main>
  )
}

export default Main

