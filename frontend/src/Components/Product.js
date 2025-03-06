import React, { useEffect, useState } from "react";
// import $ from 'jquery';

import { Link } from "react-router-dom";
import '../Components/css/product.css'

import Header from "./Header";

function Product() {
  const [datas, setDatas] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    category: "",
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const dataGet = () => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => setDatas(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    dataGet();
  }, []);

  const handleInputChange = (e) => {  
    const { name, value } = e.target;
    console.log({ name, value });
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image || "", 
    });
  };
  

  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({ id: "", name: "", price: "", category: "", image: "" });
  };

  const saveProduct = (event) => {
    event.preventDefault(); 
  
    // Validation for "Add Product" (Not for Edit)
    if (!isEditing) {
      if (!formData.name || !formData.price || !formData.category) {
        alert("Name, Price, and Category are required fields!");
        return; 
      }
    }
  
   
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("price", formData.price);
    formDataObj.append("category", formData.category);
  
    if (formData.image instanceof File) {
      formDataObj.append("image", formData.image);
    }
  
    const url = formData.id
      ? `http://localhost:5000/api/product/put/${formData.id}` // Edit product URL
      : "http://localhost:5000/api/product/insert";  // Add product URL
  
    const method = formData.id ? "PUT" : "POST";  // Determine HTTP method
  
    fetch(url, {
      method: method,
      body: formDataObj,
    })
      .then((response) => response.json())
      .then(() => {
        dataGet(); 
        setFormData({ id: "", name: "", price: "", category: "", image: "" });  
        setIsEditing(false); 
  
       
      // Hide modals using Bootstrap classes
      const addModal = document.getElementById("addProductModal");
      const editModal = document.getElementById("editProductModal");

      if (addModal) {
        addModal.classList.remove("show");
        addModal.style.display = "none";
        document.body.classList.remove("modal-open");
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();
      }

      if (editModal) {
        editModal.classList.remove("show");
        editModal.style.display = "none";
        document.body.classList.remove("modal-open");
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();
      }
      })
      .catch((error) => console.error("Error saving product:", error));  
  };
  
  
  
  
  const deleteProduct = (id) => {
    fetch(`http://localhost:5000/api/product/delete/${id}`, {
      method: "DELETE",
    })
      .then(() => dataGet())
      .catch((error) => console.error("Error deleting product:", error));
  };

  return (
    <div className="App">
      <Header />
      <button
        className="btn btn-primary xl add-card"
        data-toggle="modal"
        data-target="#addProductModal"
        onClick={handleAddClick}
      >
        Add Product
      </button>

      {/* Add Product Modal */}
      <div
        className="modal fade"
        id="addProductModal"
        role="dialog"
        aria-labelledby="addProductModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Product</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>
            <form onSubmit={saveProduct} encType="multipart/form-data">
              <div className="modal-body">
                <label>Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <label>Price</label>
                <input
                  name="price"
                  type="text"
                  className="form-control"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                <label>Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">--select--</option>
                  <option value="Formals">Formals</option>
                  <option value="Casual">Casual</option>
                </select>
                <label>Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Add Product
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      <div
        className="modal fade"
        id="editProductModal"
        role="dialog"
        aria-labelledby="editProductModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Product</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>
            <form onSubmit={saveProduct} encType="multipart/form-data">
              <div className="modal-body">
                <label>Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <label>Price</label>
                <input
                  name="price"
                  type="text"
                  className="form-control"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                <label>Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">--select--</option>
                  <option value="Formals">Formals</option>
                  <option value="Casual">Casual</option>
                </select>
                <label>Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {formData.image && (
                  <div>
                    <img
                      src={`http://localhost:5000/uploads/${formData.image}`}
                      alt={formData.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                    <p>Current Image</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {datas.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.price}</td>
              <td>{data.category}</td>
              <td>
                {data.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${data.image}`}
                    alt={data.name}
                    style={{ width: "50px", height: "50px" }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>
                <Link to={`/view/${data.id}`} className="btn btn-info">
                  View
                </Link>
                <button
                  className="btn btn-warning mx-2"
                  data-toggle="modal"
                  data-target="#editProductModal"
                  onClick={() => handleEditClick(data)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteProduct(data.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Product;
