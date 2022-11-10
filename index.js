const express=require('express')
const app=express();
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.port || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());

app.get('',(req,res)=>{
    res.send("travelserver is running")
})

const uri =`mongodb+srv://${process.env.Travel_Name}:${process.env.Travel_Key}@cluster0.tasnahm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const travelData=client.db("travel").collection("travelservices");
        const reviewdata=client.db('travel').collection('reviewdata');
         
        app.get('/services',async(req,res)=>{
            const query={}
            const cursor=travelData.find(query)
            const services=await cursor.toArray()
            res.send(services);
        })
        app.post('/threeservices',async(req,res)=>{
            const review=req.body
            const result=await travelData.insertOne(review)
            res.send(result)
        })
        app.get('/services/:id',async(req,res)=>{
            const id=req.params.id
            const query={ _id:ObjectId(id)}
            const fixedService=await travelData.findOne(query)
            res.send(fixedService)
        })

        app.get('/threeservices',async(req,res)=>{
            const query={}
            const cursor=travelData.find(query)
            const newservice=await cursor.limit(3).toArray()
            res.send(newservice);

        })

        app.post('/review',async(req,res)=>{
            const review=req.body
            const result=await reviewdata.insertOne(review)
            res.send(result)
        })
        app.get('/review',async(req,res)=>{
            const query={}
            const cursor=reviewdata.find(query)
            const allreview=await cursor.toArray()
            res.send(allreview)
        })

        app.delete('/review/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const dresult=await reviewdata.deleteOne(query)
            res.send(dresult)
           }) 
          
      

    }
    finally{

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`travel server running on ${port}`)
})