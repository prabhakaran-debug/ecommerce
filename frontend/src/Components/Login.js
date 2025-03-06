import React, { useState } from "react";
import "../Components/css/Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login({ setIsAuthenticated }) {
    const [error, setError] = useState("");
    const [inputError, setInputError] = useState({ username: false, password: false });
    const navigate = useNavigate();

    const saveUser = async (event) => {
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

        try {
            const response = await fetch("http://localhost:5000/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();
            console.log(result);

            if (response.status === 200 && result.token) {
                setIsAuthenticated(true);
                localStorage.setItem("token", result.token);
                localStorage.setItem("role_id",result.role_id)
                localStorage.setItem("username",result.username)
                localStorage.setItem("user_id",result.user_id)
                navigate("/");
            } else if (response.status === 401) {
                setError(result.error);
                setInputError({  password: true });
            } else {
                console.error("Unexpected error:", result);
                setError(result.error || "An unexpected error occurred.");
                setInputError({ username: true });

            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please check your network connection.");
        }
    };

    return (
        <>
            <div className="login-div">
                <form onSubmit={saveUser}>
                    <h1 className="login-h1">Login</h1>
                    {error && <div className="error-message mt-4">{error}</div>}

                    <label htmlFor="username" className="login-label">Email</label>
                    <input 
                        id="username" 
                        type="email"  
                        name="username" 
                        className={`form-control ${inputError.username ? "input-error" : ""}`} 
                        placeholder="Enter The Username"
                        onChange={() => setInputError({ ...inputError, username: false })}
                    />

                    <label htmlFor="password" className="login-label">Password</label>
                    <input 
                        id="password"  
                        type="password" 
                        name="password" 
                        className={`form-control input-2 ${inputError.password ? "input-error" : ""}`} 
                        placeholder="Enter The Password"
                        onChange={() => setInputError({ ...inputError, password: false })}
                    />

                    <Link className="a-tag" to="/Register">Create an account?</Link>
                    <Link className="a-tag-2" to="/ForgotPassword">Forgot Password?</Link>
                    <button type="submit" className="btn btn-primary regester-btn">Submit</button>
                </form>
            </div>
        </>
    );
}

export default Login;
