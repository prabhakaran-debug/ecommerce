import React, { useEffect, useState } from "react";

import '../Components/css/product.css'

import Header from "./Header";

function User() {
  const [datas, setDatas] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    user_role: "",
   
  });
  const [isEditing, setIsEditing] = useState(false);

  const dataGet = () => {
    fetch("http://localhost:5000/api/user/details")
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


  

const handleEditClick = (user) => {
  setIsEditing(true);
  setFormData({
      id: user.id,
      username: user.username,
      user_role: user.role_name,
  });
};

  

  

  const saveProduct = (event) => {
    event.preventDefault(); 
  console.log(event);
  
    if (!isEditing) {
      if (!formData.username || !formData.user_role ) {
        alert("username and  role are required fields!");
        return; 
      }
    }
  
    const user_id=localStorage.getItem("user_id");
    const formDataObj = new FormData();
    formDataObj.append("username", formData.username);
    formDataObj.append("user_role", formData.user_role);
  
    
    // localStorage.setItem("role_id",formData.user_role)
  
    fetch(`http://localhost:5000/api/user/put/${formData.id}`, {
      method: "PUT",
    headers: {
        "Content-Type": "application/json", 
    },
    body: JSON.stringify({
        username: formData.username,
        user_role: formData.user_role,  
    }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); 
    
  if (data?.user_id ==user_id) {

    localStorage.clear();

    window.location.reload();
  } else {
    console.error("Failed to update user:", data.message);
  }
        dataGet(); 
        setFormData({ id: "", username: "", user_role: ""});  
        setIsEditing(false); 
        
        
       
      const editModal = document.getElementById("editProductModal");


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
              <h4 className="modal-title">Edit User details</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>
            <form onSubmit={saveProduct} encType="multipart/form-data">
              <div className="modal-body">
                <label>username</label>
                <input
                  name="username"
                  type="text"
                  className="form-control"
                  value={formData.username} 
                  onChange={handleInputChange}
                />
                
                <label>user role</label>
                <select
                  name="user_role"
                  className="form-control"
                  value={formData.user_role}
                  onChange={handleInputChange}
                >
                  <option value="">--select--</option>
                  <option value="1">user</option>
                  <option value="2">admin</option>
                </select>
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
            <th>User_ID</th>
            <th>Username</th>
            <th>User_Role</th>
            
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {datas.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.username}</td>
              <td>{data.role_name}</td>
              
              <td>
                
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

export default User;
