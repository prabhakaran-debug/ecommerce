// import { get } from "jquery";
import React, { useEffect, useState } from "react";
import {   useNavigate, useParams } from "react-router-dom";
 import '../Components/css/view.css'
// import PaymentButton from "./Paymentbutton";


function View(){
  const [product,setProduct]=useState('');
  const {id}=useParams();
  const navigate = useNavigate();
  const data = () => {
    fetch(`http://localhost:5000/api/product/${id}`)
    .then((Response)=> Response.json())
    .then(productdata=>{
      console.log(productdata)
      setProduct(productdata)
    })
  }
    useEffect(()=>{
       data()
       
    });
    const pidData = () =>{
      navigate('/address',{state:{product_id:product.id}})
      console.log("product_id :"+product.id)
    }


    return(
    <div className="viewdiv">
         <h2>Product Details</h2>
         <img
                    src={`http://localhost:5000/uploads/${product.image}`}
                    alt={product.name}
                    style={{ width: "300px", height: "200px" }}
         />         <p><strong>Product id  : </strong>{product.id}</p>
         <p><strong>product Name  : </strong>{product.name}</p>
         <p><strong>product Price  : </strong>{product.price}</p>
         <p><strong>product Category  : </strong>{product.category}</p>

        
         <button className="btn btn-primary" onClick={pidData}>Next</button>
    </div>
       )
}
export default View