import React from 'react'
import "./home.css";
import {Link} from "react-router-dom";
import './home.css'

const home = () => {
  return (

<div class="container">
<h2>Welcome to our amazing website!!</h2>
<img class="logo" src="imgs/codefury_2.jpg" alt="Logo" />
<p class="message"> For explore more please introduce your self with our head 😎</p>
<div class="button-container">
  <Link class="btn btn-light ex" to="/register">Sign Up</Link> 
  <Link class="btn btn-light ex" to="/login">Login</Link>
</div>
</div>
  )
}

export default home