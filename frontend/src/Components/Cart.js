import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../Components/css/cart.css';

function Cart() {
  const [cartData, setCartData] = useState([]);
  const [totalprice, setTotalprice] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const navigate = useNavigate();


  const dataGet = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/cartpage");
    if (Array.isArray(data)) {
      setCartData(data);
      console.log("cartData:", data); // Logs the entire array
      data.forEach((item, index) => {
        console.log(`Item ${index}:`, item); // Logs each object individually
      });
    } else {
      console.error("Invalid response format:", data);
      setCartData([]);
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
};


  useEffect(() => {
    dataGet();
  }, []);

  useEffect(() => {
    if (Array.isArray(cartData)) {
      const totalAmount = cartData.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotalprice(totalAmount);
      localStorage.setItem("price",totalprice)

      const totalQuantity = cartData.reduce((sum, item) => sum + item.quantity, 0);
      setTotalProduct(totalQuantity);
    }
  }, [cartData]);

  const handleIncrement = async (cartId) => {
    const item = cartData.find((item) => item.id === cartId);
    if (!item) return;

    const updatedQuantity = item.quantity + 1;

    try {
      await axios.put(`http://localhost:5000/api/cartpage/update/${cartId}`, {
        quantity: updatedQuantity,
      });

      setCartData((prevCart) =>
        prevCart.map((item) =>
          item.id === cartId
            ? { ...item, quantity: updatedQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDecrement = async (cartId) => {
    const item = cartData.find((item) => item.id === cartId);
    if (!item) return;

    const updatedQuantity = Math.max(0, item.quantity - 1);

    try {
      if (updatedQuantity > 0) {
        await axios.put(`http://localhost:5000/api/cartpage/update/${cartId}`, {
          quantity: updatedQuantity,
        });

        setCartData((prevCart) =>
          prevCart.map((item) =>
            item.id === cartId
              ? { ...item, quantity: updatedQuantity }
              : item
          )
        );
      } else {
        await axios.delete(`http://localhost:5000/api/cartpage/delete/${cartId}`);

        setCartData((prevCart) =>
          prevCart.filter((item) => item.id !== cartId)
        );
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleProceedToAddress = () => {
    // Navigate to Address page and pass cartData as state
    navigate('/address', { state: { cartData,totalprice } });
  };

  return (
    <>
      <Header />
      <center>
        <h1 className="p-3">Cart Page</h1>
      </center>
      <div className="row  mx-2">
        {cartData.length > 0 ? (
          cartData.map((data, index) => (
            <div className="card flex-row " key={index}>
              <img
                className="card-img-left example-card-img-responsive"
                src={`http://localhost:5000/uploads/${data.image}`}
                alt={data.name}
                style={{ width: "20%", height: "200px" }}
              />
              <div className="card-body d-flex">
                <div className="col-md-8 product">
                  <h5 className="card-title text-capitalize">{data.name}</h5>
                  <h6 className="card-text text-muted badge rounded-pill bg-secondary">{data.category}</h6>
                  <div>
                    <button
                      className="btn btn-outline-secondary mr-2"
                      onClick={() => handleDecrement(data.id)}
                    >
                      -
                    </button>
                    {data.quantity}
                    <button
                      className="btn btn-outline-secondary ml-2"
                      onClick={() => handleIncrement(data.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-md-3 text-right">
                  <h5 className="card-text font-weight-bold">₹{data.price}</h5>
                  <h6 className="card-text">
                    Total: ₹{data.price * data.quantity}
                  </h6>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <h3>Your cart is empty</h3>
            <p>Browse products and add them to your cart.</p>
            <Link to="/" className="btn btn-primary">
              Go to Shop
            </Link>
          </div>
        )}
        {cartData.length > 0 && (
          <div className="row">
            <div className="col-7"></div>
            <div className="col-5 total-price mt-5">
              <table className="table text-left">
                <tbody>
                  <tr>
                    <th>Total Products:</th>
                    <td>{totalProduct}</td>
                  </tr>
                  <tr>
                    <th>Total Price:</th>
                    <td>₹{totalprice}</td>
                  </tr>
                </tbody>
              </table>
              <center>
              <button className="btn btn-primary" onClick={handleProceedToAddress}>Proceed to Address</button>

              </center>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
