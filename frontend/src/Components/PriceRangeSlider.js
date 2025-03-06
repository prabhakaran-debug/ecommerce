import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Range } from "react-range"; 

const PriceRangeSlider = ({ onPriceChange }) => {
    const [priceRange, setPriceRange] = useState([100, 1000]); 
    

    const handleSliderChange = (values) => {
        setPriceRange(values);
       
       
        
        if (onPriceChange) {
            onPriceChange(values); 
        }
    };




    return (
        <div className="container mt-4">
            <h5>Price Range</h5>
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                    </div>
                   
                    {/* Two-handle Range Slider */}
                    <Range
                        values={priceRange}
                        step={100}
                        min={0}
                        max={15000}
                        onChange={handleSliderChange}
                        renderTrack={({ props, children }) => (
                            <div
                                {...props}
                                style={{
                                    ...props.style,
                                    height: "6px",
                                    width: "100%",
                                    backgroundColor: "#ddd",
                                    borderRadius: "3px",
                                }}
                            >
                                {children}
                            </div>
                        )}
                        renderThumb={({ props, index }) => (
                            <div
                                {...props}
                                style={{
                                    ...props.style,
                                    height: "20px",
                                    width: "20px",
                                    borderRadius: "50%",
                                    backgroundColor: "#007bff",
                                    border: "2px solid white",
                                }}
                            />
                        )}
                    />
                    {/* <p>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</p> */}
                </div>
            </div>
        </div>
    );
};

export default PriceRangeSlider;
