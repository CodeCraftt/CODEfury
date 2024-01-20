import React from 'react'
import {Link} from 'react-router-dom';


const Register = () => {
  return (
    <>

    <div className="container mt-5" style={{justifyContent:"flex-start"}}>
  <h1>Register</h1>
  <br /><br /><br /><br />
  <div className="row" style={{display:"flex"}}>
    <div className="col-sm-8" style={{width:"40vw"}}>
      <div className="card">
        <div className="card-body">

          <form action="http://localhost:5000/register" method="POST" style={{color:"black"}}>
            <div className="form-group">
              <label for="email">Email</label>
              <input type="email" className="form-control" name="username" placeholder='Enter email address' />
            </div>
            <div className="form-group">
              <label for="password">Password</label>
              <input type="password" className="form-control" name="password" placeholder='Enter password' />
            </div>
            <button type="submit" className="btn btn-dark">Register</button>
          </form>
          
         <br /> <br />
            <button type="submit" className="btn btn-dark"><Link to="/login" style={{ color: "white", "&:hover": { TextDecoder:"none" } }}>Login</Link></button>


        </div>
      </div>
    </div>

    <div className="col-sm-4" style={{width:"50vw"}}>
      <div className="card social-block" >
        <div className="card-body">
          <a className="btn btn-block btn-social btn-google" href="http://localhost:5000/auth/google" role="button">
            <i className="fab fa-google"></i>
            Sign Up with Google
          </a>
        </div>

      </div>
    </div>

  </div>
</div>
    </>
  )
}

export default Register