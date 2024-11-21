import React, {createContext, useContext, useState, useEffect} from "react";
import { toast } from "react-hot-toast";


const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if(checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) =>{
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })

            setCartItems(updatedCartItems);
        } else {
            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }]);
        }
        toast.success(`${qty} ${product.name} added to cart.`);
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCardItems = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCardItems);
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);
        console.log("index: ", index);
        const newCardItems = cartItems;

        if(value === 'increase') {
           newCardItems.map((item) =>(item._id === id) && (item.quantity = foundProduct.quantity + 1));
           setCartItems([...newCardItems]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
        } else if(value === 'decrease') {
           if(foundProduct.quantity > 1) {
             newCardItems.map((item) =>(item._id === id) && (item.quantity = foundProduct.quantity - 1));
             setCartItems([...newCardItems]);
             setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
             setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
            }
        }
    }

    const increaseQuantity = () => {
        setQty((prevQty) => prevQty + 1);
    }

    const decreaseQuantity = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1;

            return prevQty - 1;
        });
    }

    return(
        <Context.Provider
          value={{
            showCart,
            setShowCart,
            cartItems,
            totalPrice,
            totalQuantities,
            qty,
            increaseQuantity,
            decreaseQuantity,
            onAdd,
            toggleCartItemQuantity,
            onRemove,
            setCartItems,
            setTotalQuantities,
            setTotalPrice,
          }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () =>  useContext(Context);