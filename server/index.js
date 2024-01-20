// jshint esversion:6
require('dotenv').config();
const express =require("express");
const {generateFile}=require('./generate');
const {executeCpp}=require('./execute');

const app=express();
const ejs=require("ejs");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const { v4: uuidv4 } = require('uuid');
const cors=require('cors');

const processString=require('./makestring');

const GoogleStrategy= require('passport-google-oauth20').Strategy;
const findOrCreate=require('mongoose-findorcreate'); 
const session=require('express-session');
const passport=require("passport");
const passportLocalMOngoose=require("passport-local-mongoose");
const { default: mongoose } = require('mongoose');
const { log } = require('console');


mongoose.connect(process.env.MONGO_URI);

app.set('view engine','ejs');
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: 'Main prot',
    resave: false,
    saveUninitialized: false,})); 
  app.use(passport.initialize());
  app.use(passport.session());


const userSchema=new mongoose.Schema({
    email:String,
    password:String,
    googleId:String,
    secret:String
})

const problemSchema=new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: { type: String },
    input: { type: String },
    whoSolved: [{ type: String }],
    output: { type: String },
    constraints: { type: String },
    timelimit: { type: Number, default: 5.0 },
    statement: { type: String, required: true },
    createdBy: { type: String, required: true },
    testcase: [
      {
        input: { type: String },
        output: { type: String },
        explanation: { type: String },
      },
    ],
  }
)

const protestSchema=new mongoose.Schema({
  pid:{type:String,required:true},
  input:{type:String,required:true},
  output:{type:String,required:true}
})

userSchema.plugin(passportLocalMOngoose);
userSchema.plugin(findOrCreate); 


const Users=mongoose.model("user",userSchema);
const Problems=mongoose.model("problem",problemSchema);
const Protest=mongoose.model("test",protestSchema);

passport.use(Users.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });


  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/problems",
  },
  function(accessToken, refreshToken, profile, cb) {

    Users.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));






app.get("/auth/google",
   passport.authenticate('google' , {scope:['profile']})
)

let problemArray;
app.get('/auth/google/problems', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    // res.render('problems',{problem:Problems});
    Problems.find({})
    .then((problems) => {
      problemArray = problems.map((problem) => problem.toObject());
      res.render("problems", { problem: problemArray });
      // Pass the problemArray to the EJS view for rendering
    })
    .catch((err) => {
      console.log(err);

    });
    // 
  });

  
app.get("/login",(req,res)=>{
    res.redirect("http://localhost:3000/login");
})


app.get("/register",(req,res)=>{
    res.redirect("/register");
})

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("http://localhost:3000/");
})


app.get("/problems/:probid",(req,res)=>{
  const probid=req.params.probid;
  Problems.findById(probid).then((item)=>{
    res.render("prob",{prob:item});
  }).catch((err)=>{
    console.log(err);
  })

  // res.render("prob");
})

app.get("/problems/:probid/attempt",(req,res)=>{
  const probid=req.params.probid;
  Problems.findById(probid).then((item)=>{
    res.render("attempt",{prob:item,op:null});
  }).catch((err)=>{console.log(err);})
})

// app.post("/problems/:probid/attempt",async(req,res)=>{
//   const probid=req.params.probid;
//   const lang=req.body.lang;
//   const code=req.body.code;
//   const codeinput=req.body.codeinput;

//   console.log("lang " +lang);
//   console.log("code "+code);
//   console.log("coi "+codeinput);

//   if(code==undefined){
//     return res.status(400).json({success:false,error:"Error code body !!"});
//   }
 
//   // Problems.findById(probid).then((item)=>{
       
//   // }).catch((err)=>{console.log(err);})
//   try{
//     const filePath=await generateFile(lang,code);
//     console.log(filePath);
//     const output=await executeCpp(filePath,codeinput);
//    console.log("index "+output);

//    Problems.findById(probid).then((item)=>{
//       Protest.findOne({pid:item.slug}).then((i)=>{
//         if(processString(output)===processString(i.output)){
//           res.render('result',{prob:item,result:"Submitted"})
//         }
//         else{
//           res.render('result',{prob:item,result:"Wrong"})
//         }
//       }).catch((err)=>{console.log(err);})
//     // res.render("attempt",{prob:item,op:output});
//   }).catch((err)=>{console.log(err);})
//   }catch(error){
//     return res.status(500).json({success:false,error:error});
//   }
// })

app.post("/problems/:probid/attempt", async (req, res) => {
  try {
    const probid = req.params.probid;
    const lang = req.body.lang;
    const code = req.body.code;
    const codeinput = req.body.codeinput;

    if (code == undefined) {
      return res.status(400).json({ success: false, error: "Error code body !!" });
    }

    const item = await Problems.findById(probid);
    const i = await Protest.findOne({ pid: item.slug });

    let my = i.input;
    let myo = i.output;

    let output = "";
    const filePath = await generateFile(lang, code);
    
    const codeInputArray = codeinput.split("\n");
    
    output = await executeCpp(filePath, codeInputArray);
    const opArray = output.split("\n");
    res.render("attempt",{prob:item,op:opArray});
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
});


app.post("/problems/:probid/attempt/result", async (req, res) => {
  try {
    const probid = req.params.probid;
    const lang = req.body.lang;
    const code = req.body.code;
    const codeinput = req.body.codeinput;

    if (code == undefined) {
      return res.status(400).json({ success: false, error: "Error code body !!" });
    }

    const item = await Problems.findById(probid);
    const i = await Protest.findOne({ pid: item.slug });

    let my = i.input;
    let myo = i.output;

    let output = "";
    const filePath = await generateFile(lang, code);
    console.log(filePath);
    console.log("ye hai" + my);
    const codeInputArray = my.split("\n");
    console.log(codeInputArray);
    output = await executeCpp(filePath, codeInputArray);
    console.log("index " + output);

    if (processString(output) === processString(myo)) {
      res.render('result', { prob: item, result: "1"});
    } else {
      res.render('result', { prob: item, result: "0" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
});




// Edit it for make easy 

app.post("/problems/:probid/attempt/result",(req,res)=>{
  // const probid=req.params.probid;
  // Problems.findById(probid).then((item)=>{
  //   res.render("attempt",{prob:item,op:null});



  // }).catch((err)=>{console.log(err);})
  res.send("Sahi hai ");
})



app.post("/register",(req,res)=>{
    Users.register({username:req.body.username, active: false}, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("http://localhost:3000/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                // res.render("problems",{problem:Problems});
                res.render("problems", { problem: problemArray });
            })
        }
          // Value 'result' is set to false. The user could not be authenticated since the user is not active
        });
      });




app.get("/problems",(req,res)=>{
        Users.find({"secret": {$ne: null}}).then((foundUsers)=>{
              // res.render("problems", {problem:Problems});
              res.render("problems", { problem: problemArray });
        }).catch((err)=>{
            console.log(err);
        })
        // res.render("problems");
})

// app.get("/submit",(req,res)=>{
//     if(req.isAuthenticated()){
//         res.render("submit");
//     } 
//     else{
//         res.redirect("/login");
//     }
// })
// app.post("/extra",(req,res)=>{
//     res.redirect("/login");
// })



app.post("/login",(req,res)=>{
    const user=new Users({
        username:req.body.username,
        password:req.body.password
    })   
     req.login(user,function(err){
        if(err){return next(err);}
        // return res.redirect("/users/"+req.user.username);
       else{
        passport.authenticate("local")(req,res,function(){
          // res.render("problems", {problem:Problems});
          res.render("problems", { problem: problemArray });
        })
       }
     });
})

app.listen(5000,()=>{console.log("Server is running on the port 5000");})




