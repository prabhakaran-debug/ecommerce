import React, { useState } from "react";
import "../Components/css/Register.css";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [inputError, setInputError] = useState({ username: false, password: false });

    const saveUser = (event) => {
        event.preventDefault();

        const username = event.target.username.value.trim();
        const password = event.target.password.value.trim();
        

        if (!username || !password) {
            setInputError({
                username: !username,
                password: !password,
            });
            setError("Enter the username and password.");
            return;
        }

        console.log({ username, password });

        fetch("http://localhost:5000/api/user/insert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert("Data saved successfully");
                navigate("/");
            })
            .catch((error) => {
                console.error("Error:", error);
                setError("An error occurred while saving data.");
            });
    };

    return (
        <div className="RegisterDiv">
            <form onSubmit={saveUser}>
                <h1 className="register-h1">Registration Form</h1>
                
                {/* Error Message Div */}
                {error && <div className="error-message">{error}</div>}

                <label htmlFor="username" className="reg-label">Email</label>
                <input 
                    type="email" 
                    id="username" 
                    name="username" 
                    className={`form-control ${inputError.username ? "input-error" : ""}`} 
                    placeholder="Enter The Username"
                    onChange={() => setInputError({ ...inputError, username: false })}
                />

                <label htmlFor="password" className="reg-label">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    className={`form-control inp-2 ${inputError.password ? "input-error" : ""}`} 
                    placeholder="Enter The Password"
                    onChange={() => setInputError({ ...inputError, password: false })}
                />

                <Link to="/Login" className="a-1">Back to login?</Link>
                <button type="submit" className="btn btn-primary regester-btn">Submit</button>
            </form>
        </div>
    );
}

export default Register;
    