const express =require('express');
const app=express();
const port=8900;
const bodyParser = require('body-parser');
const mongo=require('mongodb');
const MongoClient=mongo.MongoClient;
const mongoUrl="mongodb://localhost:27017";
var cors=require('cors');
let db;
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
//app.use(cors());
//mongodb://localhost:27017

//mongodb+srv://ashribad:<password>@cluster0.mcepq.mongodb.net/<dbname>?retryWrites=true&w=majority

//resturant
app.get('/resturanthome',(req,res)=>{
    var query={}
    if(req.query.city && req.query.mealtype){
        query={city:req.query.city,"type.mealtype":req.query.mealtype}
    }
    //cityname and mealtype as queryparams
    else if(req.query.cityname && req.query.mealtype){
        query={"city_name":req.query.cityname,"type.mealtype":req.query.mealtype}
    }
   
    else if(req.query.city){
        query={city:req.query.city}
    }
    else if(req.query.mealtype){
        query={"type.mealtype":req.query.mealtype}
    }
    
      //use city name as query
    
    else if(req.query.cityname){
        query={"city_name":req.query.cityname}
   }


    
    db.collection('restaurant').find(query).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    })
})


//resturant on basis of cuisine,sorting.price
app.get('/resturantlist/:city/:mealtype',(req,res)=>{
    var query={}
    var sort={cost:1}
    if(req.query.cuisine && req.query.lcost&&req.query.hcost && req.query.sort){
       query={city:req.params.city,"type.mealtype":req.params.mealtype,'Cuisine.cuisine':req.query.cuisine,cost:{$lt:parseInt(req.query.hcost),$gt:parseInt(req.query.lcost)}}
       sort={cost:parseInt(req.query.sort)}
    }
    else if(req.query.cuisine && req.query.lcost&&req.query.hcost ){
       query={city:req.params.city,"type.mealtype":req.params.mealtype,cost:{$lt:parseInt(req.query.hcost),$gt:parseInt(req.query.lcost)},'Cuisine.cuisine':req.query.cuisine}
    }
    else if(req.query.cuisine && req.query.sort){
       query={city:req.params.city,"type.mealtype":req.params.mealtype,'Cuisine.cuisine':req.query.cuisine}
       sort={cost:parseInt(req.query.sort)}
    }
    else if(req.query.lcost&&req.query.hcost ){
       query={city:req.params.city,"type.mealtype":req.params.mealtype,cost:{$lt:parseInt(req.query.hcost),$gt:parseInt(req.query.lcost)}}
       sort={cost:1}
    }
   else if(req.query.cuisine){
             query={city:req.params.city,"type.mealtype":req.params.mealtype,'Cuisine.cuisine':req.query.cuisine}
    }
   else if(req.query.lcost&&req.query.hcost){
           query={city:req.params.city,"type.mealtype":req.params.mealtype,cost:{$lt:parseInt(req.query.hcost),$gt:parseInt(req.query.lcost)}}
   }
   else if(req.query.sort){
       query={city:req.params.city,"type.mealtype":req.params.mealtype}
         sort={cost:parseInt(req.query.sort)}
   }
   else{
    query={city:req.params.city,"type.mealtype":req.params.mealtype}
    sort={sort:1}
}

db.collection('restaurant').find(query).sort(sort).toArray((err,result)=>{
   if (err) throw err;
        res.send(result)
})
})




//resturant get from id
app.get('/resturantdetail/:id',(req,res)=>{
 
 var query={resturant:req.query.resturant}
 console.log(req.params.id)
 var query={_id:req.params.id}
 db.collection('restaurant').find(query).toArray((err,result)=>{
     if (err) throw err;
     res.send(result)
 })
})

//resturant get from resturant name

app.get('/resturanthomes/:name',(req,res)=>{
 
    var query={resturant:req.query.resturant}
    console.log(req.params.name)
    var query={name:req.params.name}
    db.collection('restaurant').find(query).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    })
})

//assignment

app.get('/resturantho/:city',(req,res)=>{
 var query={resturant:req.query.resturant}
 console.log(req.params.city)
    var query={city:req.params.city}
    db.collection('restaurant').find(query).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
  })
})

//city name as params
app.get('/resturanthomes/:cityname',(req,res)=>{
    var query={resturant:req.query.resturant}
    console.log(req.params.cityname)
    var query = {city_name:req.params.cityname}
    db.collection('restaurant').find(query).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)

    })
})



//citylist
app.get('/city',(req,res)=>{
    db.collection('city').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    })
})

//cuisine
app.get('/cuisine',(req,res)=>{
    db.collection('cuisine').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    })
})

//mealtype
app.get('/mealtype',(req,res)=>{
    db.collection('mealtype').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    })
})


app.get('/allorder',(req,res)=>{
    db.collection('placeorder').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    })
})

//post
//place order
app.post('/placeorder',(req,res)=>{
    //console.log(req.body);
    var data={
        _id:req.body.order_id,
        name:req.body.name,
        contact:req.body.contact,
        email:req.body.email,
        address:req.body.address,
        rest_id:req.body.rest_id,
        quantity:req.body.quantity
    }
    db.collection('placeorder').insert(data,(err,result)=>{
        if (err) throw err;
        console.log('placeorder')
    })
})


MongoClient.connect(mongoUrl,(err,client)=>{
    if (err) console.log(err)
    db=client.db("zomato");
    app.listen(port,(err)=>{
        if (err) throw err;
        console.log(`server is running on ${port}`)
    })
})




