import React from "react";
import "./css/banner.css";

const Banner = () => {
    return (
        <section className="banner">
            <div className="banner-content">
                <div className="container m-auto">
                    <div className="row d-flex justify-content-end align-items-center">
                        <div className="col-md-6 text-md-start text-center">
                            <div className="title">
                                <h2 className="fw-bold">
                                    Limited Time Offer:<br /> Save Up to 50% on Bestsellers!
                                </h2>
                                <p className="text-muted">
                                    Shop Now and Enjoy Free Shipping on Orders Over ₹500!
                                </p>
                                <button
                                    className="btn btn-primary px-4 py-2 mt-2"
                                    aria-label="Shop Now"
                                    onClick={() => document.getElementById("shop_now")?.scrollIntoView({ behavior: "smooth" })}
                                >
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
