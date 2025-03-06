import { Navbar, Nav, Dropdown, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavbarComponent = () => {
      const [role_name, setRole_name] = useState('');
      const role_id = localStorage.getItem('role_id');
  
      useEffect(() => {
          if (role_id) {
              fetch(`http://localhost:5000/api/role/${role_id}`)
                  .then((response) => response.json())
                  .then((data) => {
                      console.log("Role Data:", data);
                      setRole_name(data.role_name); 
                  })
                  .catch((error) => console.error("Error fetching role:", error));
          }
      }, [role_id]);
  return (
    <Navbar expand="lg" bg="light" text="dark" variant="dark">
    <div className="container-fluid">
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Navbar.Brand href="#">
          <img
            src="https://mdbcdn.b-cdn.net/img/logo/mdb-transaprent-noshadows.webp"
            height="15"
            alt="MDB Logo"
            loading="lazy"
          />
        </Navbar.Brand>

        <nav className="me-auto">
          <ul className="hul">
            <li className="hli">
              <Link className="header-a" to="/">Home</Link>
            </li>
            <>
              <li className="hli">
                <Link className="header-a" to="/address">Address</Link>
              </li>
              <li className="hli">
                <Link className="header-a" to="/order">My order</Link>
              </li>
            </>
            {role_name === "admin" && (
              <>
                <li className="hli">
                  <Link className="header-a" to="/product">Products</Link>
                </li>
                <li className="hli">
                  <Link className="header-a" to="/user">Users</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </Navbar.Collapse>

      <div className="d-flex align-items-center">
        <i className="fas fa-shopping-cart me-3"></i>

        <Dropdown align="end">
          <Dropdown.Toggle variant="link" id="dropdown-notifications">
            <i className="fas fa-bell"></i>
            <Badge bg="danger">1</Badge>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">Some news</Dropdown.Item>
            <Dropdown.Item href="#">Another news</Dropdown.Item>
            <Dropdown.Item href="#">Something else here</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown align="end">
          <Dropdown.Toggle variant="link" id="dropdown-avatar">
            <img
              src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
              className="rounded-circle"
              height="25"
              alt="User Avatar"
              loading="lazy"
            />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">My profile</Dropdown.Item>
            <Dropdown.Item href="#">Settings</Dropdown.Item>
            <Dropdown.Item href="#">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  </Navbar>
);
};

export default NavbarComponent;
