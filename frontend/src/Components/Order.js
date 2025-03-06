import React, { useEffect, useState } from "react";
import Header from "./Header";
import { jsPDF } from "jspdf";
import Pagination from "./Pagination"; // Assuming this is a custom pagination component.
import { Pagination as BootstrapPagination } from "react-bootstrap";

function Order() {
  const [orderdata, setOrderdata] = useState([]);
  const [orderIds, setOrderIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState([]);
  const [date, setDate] = useState([]);
  const user_id = localStorage.getItem("user_id");

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);

  // Fetch order data
  useEffect(() => {
    const url = `http://localhost:5000/api/order?user_id=${user_id}`;

    fetch(url)
      .then((response) => response.json())
      .then((orderdata) => {
        if (!Array.isArray(orderdata)) {
          throw new Error("Invalid order data format");
        }
        setOrderdata(orderdata);
        setOrderIds(orderdata.map((order) => order.id));
        setStatus(orderdata.map((order) => order.status));
        setDate(orderdata.map((order) => new Date(order.date).toISOString().slice(0, 10)));
      })
      .catch((error) => console.error("Error fetching order data:", error.message));
  }, [user_id]);

  // Fetch product data
  useEffect(() => {
    if (orderIds.length > 0) {
      fetch("http://localhost:5000/api/order-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds, status, date }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!Array.isArray(data)) {
            throw new Error("Invalid product data format");
          }
          setProducts(data);
        })
        .catch((error) => console.error("Error fetching product data:", error.message));
    }
  }, [orderIds]);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentOrders = products.slice(firstPostIndex, lastPostIndex);

  // Generate invoice PDF
  const generateInvoice = (order) => {
    const doc = new jsPDF();
    const marginLeft = 10;
    let y = 20;

    doc.setFontSize(22).text("E-COMMERCE", 105, y, { align: "center" });
    y += 10;

    doc.setFontSize(16).text("Order Receipt", 105, y, { align: "center" });
    y += 20;

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId}`, marginLeft, y);
    y += 10;
    doc.text(`Order Date: ${order.date}`, marginLeft, y);
    y += 10;
    doc.text(`Status: ${order.status}`, marginLeft, y);
    y += 10;

    doc.text("Delivery Address:", marginLeft, y);
    y += 10;
    const address = order.address?.[0] || {};
    const fullAddress = [
        address.houseNo, address.street, address.city, 
        address.state, address.country
    ].filter(Boolean).join(", ") || "N/A";
    doc.text(fullAddress, marginLeft, y);
    y += 20;

    doc.text("Products:", marginLeft, y);
    y += 10;
    let totalPrice = 0;

    order.products.forEach((product, index) => {
      const price = parseFloat(product.price) || 0;
      totalPrice += price;
  
      const imagePath = `http://localhost:5000/uploads/${product.image}`;
  
      if (product.image) {
          doc.addImage(imagePath, 'JPEG', marginLeft, y, 50, 50);
          y += 55;
      }
  
      const text = `${index + 1}. ${product.name} - ₹${price.toFixed(2)}`;
      const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  
      if (y + 15 > doc.internal.pageSize.height) {
          doc.addPage();
          y = 20;
      }
  
      doc.text(text, marginLeft, y);
      y += 15;
  });

  // Total Price
  y += 10;
  doc.text(`Total Price: ₹${totalPrice.toFixed(2)}`, marginLeft, y);

  // Save PDF
  doc.save(`Invoice_${order.orderId}.pdf`);
};

  return (
    <>
      <Header />
      <div className="container">
        <center>
          <h4 className="p-3">Order Page</h4>
        </center>

        {Array.isArray(products) && products.length > 0 ? (
          currentOrders.map((order) => (
            <div key={order.orderId} className="card mb-3">
              <div className="card-header d-flex justify-content-between">
                <h4>Order: {order.orderId}</h4>
              </div>

              <div className="card-body d-flex justify-content-between">
                <div className="col-md-6">
                  {Array.isArray(order.products) ? (
                    order.products.map((product, index) => (
                      <div key={index} className="row mb-3 d-flex">
                        <div className="col-4 p-2">
                          <img
                            className="img-fluid"
                            src={`http://localhost:5000/uploads/${product.image}`}
                            alt={product.name}
                            style={{ width: "65%", height: "120px", objectFit: "cover" }}
                          />
                        </div>
                        <div className="col-5 p-2">
                          <h4 className="card-title text-capitalize">{product.name}</h4>
                          <h5 className="card-text text-muted">Price: ₹{product.price}</h5>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No products available</p>
                  )}
                </div>

                <div className="col-md-6">
                  <div className="card-body">
                    <h5><strong>Order Date:</strong> {order.date}</h5>
                    <h5><strong>Status: </strong>{order.status}</h5>
                  </div>

                  <div className="card-body">
                    <h5>Delivery Address:</h5>
                    {order.address && order.address.length > 0 ? (
                      order.address.map((addr, idx) => (
                        <div key={idx}>
                          <p>
                            <strong>House No:</strong> {addr.houseNo}, {addr.street},<br />
                            <strong>City:</strong> {addr.city}, <strong>State:</strong> {addr.state}, <strong>Country:</strong> {addr.country}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No address available</p>
                    )}
                  </div>

                  <button className="btn btn-primary ml-3" onClick={() => generateInvoice(order)}>
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No orders available</p>
        )}

        {/* Pagination */}
        <Pagination
          totalOrders={products.length}
          ordersPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </>
  );
}

export default Order;
