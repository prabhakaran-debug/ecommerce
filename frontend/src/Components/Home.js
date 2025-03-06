import React, { useEffect, useState } from "react";
import Header from "./Header";
import "../Components/css/Home.css";
import { Link } from "react-router-dom";
import PriceRangeSlider from "./PriceRangeSlider"; // Import your slider component
import addtocart from '../Components/image/addtocart.png'; // Cart icon image

import Banner from "./Banner";

function Home() {
    const [datas, setDatas] = useState([]);
    const [search, setSearch] = useState([]);
    const [category, setCategory] = useState(""); 
    const [priceRange, setPriceRange] = useState([100, 1000]); 
    const [cartcout, setCartcount] = useState(0); 
    const [quantity, setQuantity] = useState({}); 

    const dataGet = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/products");
            const data = await response.json();
            setDatas(data);
            setSearch(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getCartdata = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/cartpage");
            const data = await response.json();
            setCartcount(data.length);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        dataGet();
        getCartdata();
    }, []);

    const filter = (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = search.filter((data) =>
            data.name.toLowerCase().includes(query)
        );
        setDatas(filtered);
    };

    const handlePriceChange = (range) => {
        setPriceRange(range);
    };

    const handleRadioChange = (e) => {
        setCategory(e);
    };

    const handleFilter = () => {
        const apiData = {
            min: priceRange[0],
            max: priceRange[1],
            category: category,
        };

        fetch("http://localhost:5000/api/products/filter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(apiData),
        })
            .then((response) => response.json())
            .then((filteredProducts) => {
                setDatas(filteredProducts); // Update the product list with the filtered data
            })
            .catch((error) => {
                console.error("Error fetching filtered data:", error);
            });
    };

    const addToCard = (productId, quantity) => {
        console.log(quantity);
    
        fetch("http://localhost:5000/api/cart/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity || 1, 
            }),
        })
        .then(response => response.json())
        .then(() => {
            setCartcount(cartcout + 1); 
        })
        .catch((error) => console.error("Error adding to cart:", error));
    };

    const cart = () => {
        window.location.href = `/Cart?cartcount=${cartcout}`;
    };

    const handleIncrement = (id) => {
        setQuantity((prev) => {
            const newQuantity = (prev[id] || 0) + 1;
            console.log(`New quantity for product ${id}:`, newQuantity); 

            return {
                ...prev,
                [id]: newQuantity
            };
        });
    };

    const handleDecrement = (id) => {
        setQuantity((prev) => {
            const newQuantity = Math.max(0, (prev[id] || 0) - 1);
            console.log(`New quantity for product ${id}:`, newQuantity);

            return {
                ...prev,
                [id]: newQuantity
            };
        });
    };

    return (
        <>
            <Header cartCount={cartcout}/>
            <Banner/>
        <div className="most-parent" id="shop_now">
            {/* <div className="cart-div position-relative m-3 mt-2">
                <img src={addtocart} alt="Add to Cart" onClick={cart} className="img-fluid" />
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-circle">
                    {cartcout}
                </span>
            </div> */}

            <input
                type="text"
                className="form-control w-25 m-2 my-3 search-name mt-2"
                placeholder="Search Product Name"
                onChange={filter}
            />

            <aside className="ml-2">
                {/* Category Filter */}
                <div className="card my-3">
                    <a
                        href="/"
                        data-toggle="collapse"
                        data-target="#collapse_category"
                        aria-expanded="true"
                        className="card-header d-flex align-items-center justify-content-between"
                    >
                        <h6 className="title">Filter by Category</h6>
                        <i className="icon-control fa fa-chevron-down"></i>
                    </a>
                    <div id="collapse_category" className="collapse show">
                        <div className="card-body">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="categoryFilter"
                                    value="formals"
                                    id="radioFormals"
                                    onChange={(e) => handleRadioChange(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="radioFormals">
                                    Formals
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="categoryFilter"
                                    value="casual"
                                    id="radioCasual"
                                    onChange={(e) => handleRadioChange(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="radioCasual">
                                    Casual
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Range Filter */}
                <div className="card">
                    <a
                        href="/"
                        data-toggle="collapse"
                        data-target="#collapse_price"
                        aria-expanded="true"
                        className="card-header d-flex align-items-center justify-content-between"
                    >
                        <h6 className="title">Filter by Price</h6>
                        <i className="icon-control fa fa-chevron-down"></i>
                    </a>
                    <div id="collapse_price" className="collapse show">
                        <div className="card-body">
                            <PriceRangeSlider onPriceChange={handlePriceChange} />
                            <p>
                                Selected Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Apply Filters Button */}
                <button type="button" className="btn btn-primary px-5 mt-3 mx-3" onClick={handleFilter}>
                    Apply
                </button>
            </aside>

            {/* Product Listing */}
            <div className="container-fluid imgcard mt-5" >
                <center>
                    <h1 className="mb-5">SHOP BY CATEGORY</h1>
                </center>
                <div className="row mb-4">
                    {datas.length > 0 ? (
                        datas.map((data, index) => (
                            <div className="col-12 col-sm-6 col-md-4 mb-2" key={index}>
                                <div className="card card-product">
                                    <Link className="text-decoration-none text-dark" to={`/view/${data.id}`}>
                                        {data.image ? (
                                            <img
                                                className="img-fluid rounded"
                                                src={`http://localhost:5000/uploads/${data.image}`}
                                                alt={data.name}
                                                style={{ width: "100%", height: "250px" }}
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                        <center>
                                            <div className="card-body text-decoration-none">
                                                <h2 className="text-decoration-none">{data.name}</h2>
                                                <h3 className="text-muted">{data.price}</h3>
                                                <h6  className="card-text text-white badge rounded-pill bg-secondary">{data.category}</h6>
                                            </div>
                                        </center>
                                    </Link>

                                    <div className="ml-5 mb-3">
                                        <button
                                            className="btn btn-outline-secondary mr-2"
                                            onClick={() => handleDecrement(data.id)}
                                        >
                                            -
                                        </button>
                                        {quantity[data.id] || 0}
                                        <button
                                            className="btn btn-outline-secondary ml-2"
                                            onClick={() => handleIncrement(data.id)}
                                        >
                                            +
                                        </button>

                                        <button
                                            className="btn btn-outline-secondary ml-5"
                                            onClick={() => addToCard(data.id, quantity[data.id] || 1)} 
                                        >
                                            Add to cart
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No products found</p>
                    )}
                </div>
            </div>
          </div>
        </>
    );
}

export default Home;
