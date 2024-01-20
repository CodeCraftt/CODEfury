import React from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
    

  return (
    <nav style={styles.navbar}>
        <div style={styles.leftSection}>
   
      <Link to="/" >
      <img src="\imgs\codefury_2.jpg" alt="Logo" style={styles.logo}/>
      </Link>
       <span style={styles.companyName}>CODEfury</span>
     </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: ' #333333',
    // backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '40px', // Adjust the size of the logo as needed
    height: '40px',
    marginRight: '10px',
  },
  companyName: {
    fontSize: '20px',
    color:'white',
    fontWeight: 'bold',
  },
};

export default Navbar;
