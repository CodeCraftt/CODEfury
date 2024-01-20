import React from 'react'
import {BrowserRouter ,Route,Routes} from "react-router-dom";
import "./App.css";
import Home from './components/home/home';
import Register from './components/register/Register';
import Login from './components/login/Login';
import Problem from './components/problems/Problem';

const App = () => {
  return (
    <>
    <BrowserRouter >
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/problems' element={<Problem/>}/>
    </Routes>
    </BrowserRouter>

     {/* <div style={{ backgroundColor: "#282c34", height: "100%" }}> */}
      {/* <BrowserRouter>
        <Switch>
          <Route exact path="/home" component={home} />
          <Route exact path="/register" component={Register} /> */}
          {/* <Route exact path="/problemset" component={ProblemSet} />
          <Route exact path="/problem/:id" component={Problem} />
          <Route exact path="/addproblem" component={AddProblem} />
          <Route exact path="/usersubmission" component={UserSubmission} />
          <Route exact path="/nocontent" component={NoContent} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/signup" component={SignUp} /> */}
          {/* <Redirect from="/" exact to="/home" />
        </Switch>
      </BrowserRouter> */}
    {/* </div> */}
      </>
  )
}

export default App