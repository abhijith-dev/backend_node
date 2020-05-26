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
  c_id:String,
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
  c_id:String,
  address:String,
  data:Date 
});
var ProductScheme=new mongo.Schema({
  name:String,
  p_id:String,
  c_id:String,
  p_desc:String,
  mrp:String,
  data:Date, 
  d_status:Boolean,
  r_status:Boolean
});
var Company=mongo.model('Company',CompanyScheme);
var Product=mongo.model('Product',ProductScheme);
var Distributer=mongo.model('Distributer',DistributerScheme);
var Retailer=mongo.model('Retailer',RetailerScheme);

app.get('/addcompany/:c_name/:c_id/:c_email/:c_phno/:c_location/:c_address',(req,res)=>{
   var d_id=Math.floor(Math.random()*10000).toString();
   var r_id=Math.floor(Math.random()*10000).toString();
   var D_id=req.params.c_name+"_dis_"+d_id;
   var R_id=req.params.c_name+"_ret_"+r_id;
   var company_added=Company({
    c_name:req.params.c_name,
    c_id:req.params.c_id,
    contacts:{
      email:req.params.c_email,
      phno:req.params.c_phno
    },
    c_location:req.params.c_location,
    address:req.params.c_address,
    dis_id:D_id,
    ret_id:R_id,
    data:Date.now()
  });
  company_added.save((err)=>{
    if(!err){
      res.send({
        d_id:D_id,
        r_id:R_id
      })
    }
    else{
      res.send("something went wrong......")
    }
  })
})
app.get('/addproduct/:p_name/:p_id/:c_id/:p_desc/:mrp',(req,res)=>{
  var add_product=Product({
    name:req.params.p_name,
    p_id:req.params.p_id,
    c_id:req.params.c_id,
    p_desc:req.params.p_desc,
    mrp:req.params.mrp,
    data:Date.now()
  })
 add_product.save((err)=>{
   if(!err){
     res.send("product added..")
   }
   else{
     res.send("something went wrong....")
   }
 })   
});
app.get('/add_dis/:d_name/:d_id/:c_id/:email/:phno/:d_location/:address',(req,res)=>{
  Company.find({
    dis_id:req.params.d_id,
    c_id:req.params.c_id
  },(err,data)=>{
    if(data.length>0){
     var add_dis=Distributer({
        d_name:req.params.d_name,
        dis_id:req.params.d_id,
        contacts:{
          email:req.params.email,
          phno:req.params.phno
        },
        c_id:req.params.c_id,
        d_location:req.params.d_location,
        address:req.params.address,
        data:Date.now() 
      })
      add_dis.save((err)=>{
        res.send("distributor added..")
      })
    }
    else{
      res.send("error")
    }
  })
})
app.get('/add_ret/:r_name/:r_id/:c_id/:email/:phno/:r_location/:address',(req,res)=>{
  Company.find({
    ret_id:req.params.r_id,
    c_id:req.params.c_id
  },(err,data)=>{
    if(data.length>0){
     var add_dis=Retailer({
        r_name:req.params.r_name,
        ret_id:req.params.r_id,
        contacts:{
          email:req.params.email,
          phno:req.params.phno
        },
        r_location:req.params.r_location,
        c_id:req.params.c_id,
        address:req.params.address,
        data:Date.now() 
      })
      add_dis.save((err)=>{
        res.send("retailer added..")
      })
    }
    else{
      res.send("error")
    }
  })
})
app.get('/dis_very/:dis_id',(req,res)=>{
   Distributer.find({
     dis_id:req.params.dis_id
   },(err,data)=>{
     if(data.length>0){
      return res.send({
         status:true
       })
     }
     else{
      return res.send({
        status:false
      })
     }
   })
})
app.get('/ret_very/:ret_id',(req,res)=>{
  Retailer.find({
    ret_id:req.params.ret_id
  },(err,data)=>{
    if(data.length>0){
     return res.send({
        status:true
      })
    }
    else{
     return res.send({
       status:false
     })
    }
  })
})
app.get('/dis_verified/:p_id',(req,res)=>{
  var options = { multi: true };
  Product.update({
    p_id:req.params.p_id
  },{
    d_status:true
  },options,(err,no)=>{
    res.send("success")
  })
   
})
app.get('/ret_verified/:p_id',(req,res)=>{
  var options = { multi: true };
  Product.update({
    p_id:p_id
  },{
    r_status:true
  },options,(err,no)=>{
    res.send("success")
  })
   
})

//user when scan the barcode to get product details
app.get('/user_portal/:p_id',(req,res)=>{
  var details=[]
  Product.find({
    p_id:req.params.p_id
  },(err,data)=>{
    Company.find({
      c_id:data[0].c_id
    },(err,c_data)=>{
      details.push({
        "c_name":c_data[0].c_name,
        "c_email":c_data[0].contacts.email,
        "c_phno":c_data[0].contacts.phno,
        "c_location":c_data[0].c_location,
        "c_address":c_data[0].address,
        "c_date":c_data[0].data
      })
      Distributer.find({
        c_id:c_data[0].c_id
    },(err,d_data)=>{
      details.push({
        "d_name":d_data[0].d_name,
        "d_email":d_data[0].contacts.email,
        "d_phno":d_data[0].contacts.phno,
        "d_location":d_data[0].d_location,
        "d_address":d_data[0].address,
        "d_date":d_data[0].data
      })
      Retailer.find({
        c_id:d_data[0].c_id
      },(err,r_data)=>{
        details.push({
          "r_name":r_data[0].r_name,
          "r_email":r_data[0].contacts.email,
          "r_phno":r_data[0].contacts.phno,
          "r_location":r_data[0].r_location,
          "r_address":r_data[0].address,
          "r_date":r_data[0].data  
        })
        res.send(details)
      })
    })
    })
   })
})
app.listen(3000,(err)=>{
    if(!err){
        console.log("server running...")
    }
})
