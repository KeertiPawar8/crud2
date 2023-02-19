const express = require("express");
require("dotenv").config()
const {connection} = require("./db") 
const {userRouter} = require("./routes/user.routes")
const {noteRouter} = require("./routes/Note.route")
const {authenticate}= require("./middlewares/authenticate.middleware")
const cors = require("cors")
const swaggerUI =  require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")








 
const app = express()
app.use(cors())
app.use(express.json())


const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Learning swagger for first time.",
            version:"1.0.0"
        },
        servers:[
            {
                url:"http//localhost:8080"
            }
         ]
    },
    apis:["./routes/*.js"]
}

const swaggerSpec  = swaggerJsDoc(options)
app.use("/docs",swaggerUI.serve,swaggerUI.setup(swaggerSpec))

app.get("/",(req,res)=>{
    res.send({"msg":"HOME PAGE"})
})

app.use("/users",userRouter)
app.use(authenticate)
app.use("/notes",noteRouter)



app.listen(process.env.port,async()=>{

    try{
           await connection 
        console.log(`Server is running at port ${process.env.port}`)
    }
    catch(err){
        console.log(err.message)
    }
})