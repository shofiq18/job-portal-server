const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors({
  origin: ['http://localhost:5173'], 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// verify token 
 const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  
  if(!token) {
    return res.status(401).send({massage: 'unathorized access'})

  }

  // verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(err) {
        return res.status(401).send({massage: 'unathorized access '});
      }
      
      next();
    })




  
 }






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5gtpi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

//  job portal get data apis

const jobsCollection = client.db('jobPortal').collection('jobs');
const jobApplicationCollection = client.db('jobPortal').collection('job_applications')

// Auth releted apis

    app.post('/jwt', async (req, res) => {
      const  user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '1h'});
      res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
      })
      .send({success:true});

    })

    app.post('/logout', (req, res) => {
      res
      .clearCookie('token', {
        httpOnly: true, 
        secure: false
      })
      .send({success:true})
    })







     app.get('/jobs',    async (req, res) => {
      
        const cursor = jobsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
     })

    //  get Job detail data apis

    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query  = {_id: new ObjectId(id)}
      const result = await jobsCollection.findOne(query);
      res.send(result);
    })

    // job application apis

    app.get('/job-application',verifyToken,  async (req, res) => {
      const email = req.query.email;
      const query = {application_email: email}
      const result = await jobApplicationCollection.find(query).toArray();
      for(const application of result) {
        console.log(application.job_id)
        const query1 = {_id: new ObjectId (application.job_id)}
        const job = await jobsCollection.findOne(query1);

        if(job){
          application.title = job.title;
          application.company = job.company;
          application.company_logo = job.company_logo; 
        }


      }
        
      res.send(result);
    })

    app.post('/job-applications', async (req, res) => {
      const application = req.body;
      const result = await jobApplicationCollection.insertOne(application);
      res.send(result);
    })





  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('job portal successfully show my job server')
})

app.listen(port,  () => {
    console.log (`server seccessfully running on port: ${port}`)
})