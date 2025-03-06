
import './App.css';
// import Header from '../src/Components/Header';
import Home from  '../src/Components/Home';
import { BrowserRouter, Route, Routes ,Navigate  } from 'react-router-dom';
import Product from './Components/Product';
import Order from './Components/Order';
import Address from './Components/Address';
import View from './Components/view';
import Success from '../src/Components/Success';
import Preview from './Components/Preview';
import Register from './Components/Register';
import Login from './Components/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import react from 'react';
import ForgotPassword from './Components/ForgotPassword';
import Cart from './Components/Cart';
import User from './Components/user';
import  Dashboard from './Components/Dashboard';

function App() {
    const [isAuthenticated, setIsAuthenticated] = react.useState(
        () => JSON.parse(localStorage.getItem("isAuthenticated")) || false
    );

    const roleId = localStorage.getItem("role_id"); 

    react.useEffect(() => {
        localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
    }, [isAuthenticated]);

    return (
        <>
            <BrowserRouter>
                <div className="Container">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Protected Routes */}
                        <Route
                        path="/Product"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                            {roleId === "2" ? <Product /> : <Navigate to="/" />} {/* Only admin (role_id=2) can access */}
                            </ProtectedRoute>
                        }
                        />

                        <Route
                                path="/User"
                                element={
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    {roleId === "2" ? <User /> : <Navigate to="/" />} {/* Only admin (role_id=2) can access */}
                                    </ProtectedRoute>
                                }
                        />
                        <Route
                                path="/Dashboard"
                                element={
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    {roleId === "2" ? <Dashboard /> : <Navigate to="/" />} {/* Only admin (role_id=2) can access */}
                                    </ProtectedRoute>
                                }
                        />

                        <Route
                            path="/Address"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Address component={Cart} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/Order"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Order />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/Success"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Success />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/Preview"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Preview />
                                </ProtectedRoute>
                            }
                        />
                        
                        <Route path="/View/:id" element={<View />} />
                        <Route path="/Register" element={<Register />} />
                        <Route path="/ForgotPassword" element={<ForgotPassword />} />
                        <Route
                            path="/Login"
                            element={<Login setIsAuthenticated={setIsAuthenticated} />}
                        />
                        <Route
                            path="/Cart"
                            element={<Cart component={Address} setIsAuthenticated={setIsAuthenticated} />}
                        />
                        
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    );
}

export default App;



