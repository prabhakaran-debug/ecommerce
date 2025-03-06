import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PaymentButton from "./Paymentbutton";

function Preview() {
    const [address, setAddress] = useState({});
    const [product, setProduct] = useState({});
    const [cartIds, setCartIds] = useState([]); // New state to store all IDs
    const location = useLocation();
    const address_id = location.state?.address_id;
    const product_id = location.state?.product_id;
    const totalprice = location.state?.totalprice;
    const { cartData = [] } = location.state || {};

    useEffect(() => {
        console.log(totalprice);
        
        if (cartData.length > 0) {
            const ids = cartData.map((item) => item.id); // Replace 'id' with the actual key for IDs in your data
            setCartIds(ids);
            console.log("Cart IDs:", ids);
        }
    }, [cartData]);

    useEffect(() => {
        if (address_id) {
            fetch(`http://localhost:5000/api/address/${address_id}`)
                .then((response) => response.json())
                .then((addressdata) => {
                    setAddress(addressdata);
                    console.log("Address Data:", addressdata);
                })
                .catch((error) => console.error("Error fetching address data:", error));
        }

        if (product_id) {
            fetch(`http://localhost:5000/api/product/${product_id}`)
                .then((response) => response.json())
                .then((productdata) => {
                    setProduct(productdata);
                    console.log("Product Data:", productdata);
                })
                .catch((error) => console.error("Error fetching product data:", error));
        }
    }, [address_id, product_id]);

    return (
        <div className="container">
            <div className="m-auto text-center">
                <h2 className="h2">Preview Page</h2>
                {cartData.length > 0 ? (
                    cartData.map((data, index) => (
                        <img
                            key={index}
                            src={`http://localhost:5000/uploads/${data.image}`}
                            alt={data.name}
                            style={{ width: "200px", height: "150px", margin: "5px" }}
                        />
                    ))
                ) : (
                    product.image && (
                        <img
                            src={`http://localhost:5000/uploads/${product.image}`}
                            alt={product.name}
                            style={{ width: "200px", height: "150px" }}
                        />
                    )
                )}
            </div>

            <div className="row pt-5 mx-auto">
                <div className="col-6 m-auto text-center">
                <h3 style={{ marginLeft: "240px" }}>Product Details</h3>
                {cartData.length > 0 ? (
                        cartData.map((data, index) => (
                            <div className="Product text-right my-5" key={index}>
                                <p><strong>Product Name :</strong> {data.name}</p>
                                <p><strong>Product Price : </strong> {data.price}</p>
                                <p><strong>Product Category : </strong> {data.category}</p>
                                <p><strong>Product Quantity : </strong> {data.quantity}</p>
                            </div>
                        ))
                    ) : (
                        <div className="Product text-right my-5 ">
                            <p><strong>Product Name :</strong> {product.name}</p>
                            <p><strong>Product Price : </strong>{product.price}</p>
                            <p><strong>Product Category : </strong>{product.category}</p>
                        </div>
                    )}
                </div>

                <div className="col-6 mx-auto text-center">
                    <h3 style={{ marginRight: "240px" }}>Address Details</h3>
                    <div className="Address m-auto text-left  my-5">
                        <p><strong>Street :</strong> {address.houseNo}, {address.street}</p>
                        <p><strong>City :</strong> {address.city}</p>
                        <p><strong>State : </strong>{address.state}, {address.country}</p>
                    </div>
                </div>
            </div>

            <div className="row  mt-0 w-5">
                {cartData.length > 0 ? (
                    <PaymentButton
                        cartIds={cartIds}
                        addressId={address_id}
                        cartData={cartData}
                        totalprice={totalprice}
                    />
                ) : (
                    <PaymentButton
                        productId={product_id}
                        addressId={address_id}
                        productDetail={product}
                        price={product.price}
                    />
                )}
            </div>
        </div>
    );
}

export default Preview;
