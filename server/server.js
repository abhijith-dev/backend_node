const express=require('express');
const app=express();
var cors=require('cors')
var web3=require('web3')
var mongo=require('mongoose')
const dotenv = require('dotenv');
var bodyparser=require('body-parser')
dotenv.config()
var corsOptions = {
    
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204      
}
app.use(cors(corsOptions));
//mongodb
mongo.connect('mongodb://127.0.0.1:27017/ProductAuthentication',{ useUnifiedTopology: true,useNewUrlParser: true },function(err){
    if(!err){
        console.log('db connected')
    }
    else{
        console.log('Unable to connect to db')
    }
});
var CompanyScheme=new mongo.Schema({
  c_name:String,
  c_id:String,
  contacts:{
    email:String,
    phno:String
  },
  c_location:String,
  address:String,
  dis_id:String,
  ret_id:String,
  data:Date 
});
var DistributerScheme=new mongo.Schema({
  d_name:String,
  dis_id:String,
  contacts:{
    email:String,
    phno:String
  },
  d_location:String,
  address:String,
  data:Date 
});
var RetailerScheme=new mongo.Schema({
  r_name:String,
  ret_id:String,
  contacts:{
    email:String,
    phno:String
  },
  r_location:String,
  address:String,
  data:Date 
});
var ProductScheme=new mongo.Schema({
  name:String,
  p_id:String,
  c_id:String,
  p_image:String,
  p_desc:String,
  mrp:String,
  data:Date 
});
var Company=mongo.model('Company',CompanyScheme);
var Product=mongo.model('Product',ProductScheme);
var Distributer=mongo.model('Distributer',DistributerScheme);
var Retailer=mongo.model('Retailer',RetailerScheme);

app.get('/addcompany/:c_name/:c_id/:c_email/:c_phno/:c_location/:c_address',(req,res)=>{
   var company_added=Company({
    c_name:req.params.c_name,
    c_id:req.params.c_id,
    contacts:{
      email:req.params.c_email,
      phno:req.params.c_phno
    },
    c_location:req.params.c_location,
    address:req.params.c_address,
    dis_id:"dis123456",
    ret_id:"ret123456",
    data:Date.now()
  });
  company_added.save((err)=>{
    if(!err){
      res.send("company added successfully")
    }
    else{
      res.send("something went wrong......")
    }
  })
})
app.post('/login',bodyparser.json(),(req,res)=>{
  console.log(req.body)
  return res.send({
    status:true
  })
})
app.listen(3000,(err)=>{
    if(!err){
        console.log("server running...")
    }
})