import React, { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import Animation from '../Animation.json';
import { Link } from "react-router-dom";

const Success = () => {
    const [paymentId, setPaymentId] = useState(null);
    const [status, setStatus] = useState(null);
    const [orderId, setOrderId] = useState(localStorage.getItem("orderId") || null);
    const [message, setMessage] = useState("");

    const urlParams = new URLSearchParams(window.location.search);
    const totalQuantity = urlParams.get('total_quantity');
    const totalPrice = urlParams.get('total_price');
    const currentdate = urlParams.get('date');

    // Fetch payment details and ensure state updates properly
    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const sessionId = urlParams.get("session_id");

                if (sessionId) {
                    const response = await axios.post(
                        "http://localhost:5000/get-payment-intent",
                        { sessionId }
                    );

                    const { payment_intent, status } = response.data.session;
                    console.log("Fetched Payment ID:", payment_intent);
                    console.log("Fetched Status:", status);
                    setPaymentId(payment_intent);
                    setStatus(status);
                }
            } catch (error) {
                console.error("Error fetching payment details:", error);
            }
        };

        fetchPaymentDetails();
    }, []); // Runs only once when component loads

    // Logs only after state updates
    useEffect(() => {
        console.log("Updated Order ID:", orderId);
        console.log("Updated Status:", status);
        console.log("Updated Payment ID:", paymentId);
        console.log("Updated date :", currentdate);
    }, [orderId, status, paymentId]);

    // Ensures data is inserted only when values are set
    useEffect(() => {
        if (orderId && status && paymentId) {
            console.log("Inserting payment details...");
            fetch("http://localhost:5000/api/payment/insert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    order_id: orderId,
                    status,
                    payment_id: paymentId,
                    quantity: totalQuantity,
                    price: totalPrice,
                    currentdate
                }),
            })
            .then(response => response.json())
            .then(data => console.log("Payment Insert Response:", data))
            .catch(error => console.error("Error inserting payment details:", error));
        }
    }, [orderId, status, paymentId]); // ✅ Runs only when all values are set

    useEffect(() => {
        if (orderId && status) {
            const updateOrderStatus = async () => {
                try {
                    await fetch(`http://localhost:5000/api/order/put/${orderId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ status }),
                    });
                } catch (error) {
                    console.error("Error updating order status:", error);
                }
            };

            const timer = setTimeout(updateOrderStatus, 2000);
            return () => clearTimeout(timer);
        }
    }, [orderId, status]);

    useEffect(() => {
        if (orderId) {
            fetch(`http://localhost:5000/api/order/${orderId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    setMessage(data.message);
                    console.log("Delete success:", data.message);
                })
                .catch(error => {
                    setMessage(`Error: ${error.message}`);
                    console.error("Error deleting from cart:", error);
                });
        }
    }, [orderId]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '90vh',
                backgroundColor: '#f4f4f4',
            }}
        >
            <Lottie
                animationData={Animation}
                loop={false}
                autoplay={true}
                style={{ width: 400, height: 400 }}
            />
            <h2 style={{ color: '#4caf50' }}>Payment Successful!</h2>
            <p>Your payment has been processed successfully.</p>
            <table style={{ width: 'auto', alignItems: "end" }}>
                <tbody>
                    <tr>
                        <th>Payment ID</th>
                        <td style={{ paddingLeft: '20px' }}>{paymentId || "N/A"}</td>
                    </tr>
                    <tr>
                        <th>Price</th>
                        <td>{totalPrice || "N/A"}</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>{status || "N/A"}</td>
                    </tr>
                    <tr>
                        <th>Order ID</th>
                        <td>{orderId || "N/A"}</td>
                    </tr>
                </tbody>
            </table>
            <Link to="/" className="btn btn-outline-primary m-3">Back to Home</Link>
        </div>
    );
};

export default Success;
