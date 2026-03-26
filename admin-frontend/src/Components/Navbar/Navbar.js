import React from "react";
import "./Navbar.css"; // Optional: Create a separate CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">{/* <h1>App </h1> */}</div>
      <div className="navbar-right">
        <span className="username">VirtuElite</span>
        {/* <img 
                    src="https://th.bing.com/th/id/R.6b0022312d41080436c52da571d5c697?rik=ejx13G9ZroRrcg&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fuser-png-icon-young-user-icon-2400.png&ehk=NNF6zZUBr0n5i%2fx0Bh3AMRDRDrzslPXB0ANabkkPyv0%3d&risl=&pid=ImgRaw&r=0" 
                    alt="User Icon" 
                    className="user-icon" 
                /> */}
      </div>
    </nav>
  );
};

export default Navbar;
