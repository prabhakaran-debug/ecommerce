import React, { useState } from "react";
import "../Components/css/forgotPassword.css";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [inputError, setInputError] = useState({ username: false, newPassword: false, confirmPassword: false });

    const saveUser = (event) => {
        event.preventDefault();
    
        const username = event.target.username.value.trim();
        const newPassword = event.target.newpassword.value.trim();
        const confirmPassword = event.target.confirmpassword.value.trim();
    
        if (!username || !newPassword || !confirmPassword) {
            setInputError({
                username: !username,
                newPassword: !newPassword,
                confirmPassword: !confirmPassword,
            });
            setError("All fields are required.");
            return;
        }
    
        fetch("http://localhost:5000/api/user/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, newPassword, confirmPassword }),
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) {
                    if (response.status === 400) {
                        setInputError({ newPassword: true, confirmPassword: true });
                    } else if (response.status === 404) {
                        setInputError({ username: true });
                    }
                    throw new Error(data.message || "An error occurred");
                }
                return data;
            })
            .then((data) => {
                if (data.success) {
                    alert(data.message); 
                    navigate("/");
                } else {
                    setError(data.message);
                }
            })
            
            .catch((error) => {
                console.error("Error:", error);
                setError(error.message);
            });
    };
    
    
    

    return (
        <div className="forgot-password-page">
            <form onSubmit={saveUser}>
                <h1 className="register-h1">Forgot Password</h1>

                {error && <div className="error-message">{error}</div>}

                <label htmlFor="username" className="reg-label">Email</label>
                <input 
                    type="email" 
                    id="username" 
                    name="username" 
                    className={`form-control ${inputError.username ? "input-error" : ""}`} 
                    placeholder="Enter your email"
                    onChange={() => setInputError({ ...inputError, username: false })}
                />

                <label htmlFor="newpassword" className="reg-label">New Password</label>
                <input 
                    type="password" 
                    id="newpassword" 
                    name="newpassword" 
                    className={`form-control ${inputError.newPassword ? "input-error" : ""}`} 
                    placeholder="Enter a new password"
                    onChange={() => setInputError({ ...inputError, newPassword: false })}
                />

                <label htmlFor="confirmpassword" className="reg-label">Confirm Password</label>
                <input 
                    type="password" 
                    id="confirmpassword" 
                    name="confirmpassword" 
                    className={`form-control mb-3 ${inputError.confirmPassword ? "input-error" : ""}`} 
                    placeholder="Confirm your new password"
                    onChange={() => setInputError({ ...inputError, confirmPassword: false })}
                />

                <Link to="/Login" className="a mx-4">Back to login?</Link>
                <button type="submit" className="btn btn-primary regester-btn">Submit</button>
            </form>
        </div>
    );
}

export default ForgotPassword;
