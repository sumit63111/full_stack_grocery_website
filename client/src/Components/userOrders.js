import React, { useEffect ,useState} from 'react'
import {Header,Cart,OrderData,MainLoader} from "../Components"
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders } from '../api'
import { setAllOrders } from '../Context/Actions/ordersActions'

const UserOrders = () => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const displayCart = useSelector((state) => state.displayCart)
    const order = useSelector((state) => state.order)
    const [userOrders, setUserOrders] = useState()

    useEffect(() => {
        if (!order) {
            getAllOrders().then((data) => {
                dispatch(setAllOrders(data))
            })
        }
    }, []) // Fetch orders only once on component mount

    useEffect(() => {
        if (order) {
            const filteredOrders = order.filter(item => item.userId === user?.user_id)
            setUserOrders(filteredOrders)
        }
    }, [order, user]) // Update userOrders when order or user changes

    return (
        <main className="w-screen h-screen overflow-hidden flex flex-col">
            <Header/>
            <div className="flex-1 overflow-auto scrollbar-none ">
                <div className="w-full flex flex-col items-center justify-center mt-40 px-6 md:px-24 2xl:px-96 gap-12 pb-24">
                    {userOrders && userOrders.length > 0 ? (
                        userOrders.map((item, i) => (
                            <OrderData key={i} data={item} index={i} admin={false} />
                        ))
                    ) : (
                        <div className="text-[72px] text-headingColor font-bold">No Order</div>
                    )}
                    {user && displayCart && <Cart/>}
                </div>
            </div>
        </main>
    )
}

export default UserOrders
