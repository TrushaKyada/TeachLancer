const mongoose = require('mongoose');
mongoose.set("strictQuery", true)

mongoose.connect(process.env.db).then(()=>{
    console.log("Database Connected!")
    console.log("=========================================================================");
}).catch((err)=>{
    console.log("Database Not Connected!")
})

  
