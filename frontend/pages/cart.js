import React, { useState, useEffect } from 'react';
import { viewCart, removeFromCart, checkout } from '../services/cart';
import { useRouter } from 'next/router';
import { Spinner } from '../components/Spinner';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await viewCart();
        setCart(data.cart);
      } catch (error) {
        setMessage(error.message);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter((item) => item._id !== itemId),
      }));
      setMessage('Item removed from cart');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout();
      setCart({ items: [] });
      setMessage('Order placed successfully');
      router.push('/profile');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  if (!cart || !cart.items) {
    return <Spinner />;
  }

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1fr_400px]">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Your Cart</h1>
            {message && <p className="mb-4 text-green-600">{message}</p>}
            <div className="grid gap-6">
              {cart.items.map((item) => (
                <div key={item._id} className="rounded-lg border bg-white text-gray-800 shadow-sm">
                  <div className="p-6 grid gap-4 md:flex md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{item.trainingCentre.name}</h3>
                      <p className="text-gray-500">
                        {new Date(item.date).toLocaleDateString()} | {item.time} | Seat {item.seat}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-semibold">${item.price.toFixed(2)}</div>
                      <button
                        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-blue-100 hover:text-blue-600 h-9 rounded-md px-3"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-white text-gray-800 shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight text-blue-900">Order Summary</h3>
            </div>
            <div className="p-6 grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">${calculateTotal()}</span>
              </div>
              <div data-orientation="horizontal" role="none" className="shrink-0 bg-gray-100 h-[1px] w-full"></div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-blue-900">Total</span>
                <span className="text-lg font-semibold">${calculateTotal()}</span>
              </div>
            </div>
            <div className="p-6">
              <button
                className="inline-flex items-center justify-center rounded-md bg-blue-500 text-white px-4 py-2 text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
