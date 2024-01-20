import React from 'react'
import {Link} from 'react-router-dom';


const Login = () => {
  return (<>
  
<div class="container mt-5" style={{justifyContent:"flex-start"}}>
  <h1>Login</h1>
 <br /><br /><br /><br />
  <div class="row">
    <div class="col-sm-8" style={{width:"40vw"}}>
      <div class="card">
        <div class="card-body">
  
          <form action="http://localhost:5000/login" method="POST" style={{color:"black"}}>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" class="form-control" name="username" placeholder='Enter email address'/>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" class="form-control" name="password" placeholder="Enter password"/>
            </div>
            <button type="submit" class="btn btn-dark">Login</button>
          </form>
          <br /><br />
          <button type="submit" className="btn btn-dark"><Link to="/register" style={{ color: "white", "&:hover": { textDecoration: 'none' } }}>Register</Link></button>
        </div>
      </div>
    </div>

    <div class="col-sm-4" style={{width:"50vw"}}>
      <div class="card">
        <div class="card-body">
          <a class="btn btn-block btn-social btn-google" href="http://localhost:5000/auth/google" role="button">
            <i class="fab fa-google "></i>
            Log in with Google
          </a>
        </div>
      </div>
    </div>

  </div>
</div>
</>
  )
}

export default Login