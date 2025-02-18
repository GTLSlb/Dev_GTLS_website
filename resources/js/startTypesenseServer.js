const { exec } = require("child_process");
require("dotenv").config();

const API_KEY = process.env.TYPESENSE_API_KEY;
const PORT = process.env.TYPESENSE_PORT;

const command = `docker run -d -p 8108:8108 -v/tmp/typesense-data:/data typesense/typesense:28.0.rc30 --data-dir /data --api-key=Hu52dwsas2AdxdE`;


exec(command, (err, stdout, stderr) =>{
    if(!err && !stderr){
        console.log("Typesense Server is running...")
    }

    if(err){
        console.log("Error running server: ", err)
    }

    if(stderr){
        console.log("Error running server: ", stderr)
    }

    if(stdout){
        console.log("Server output : ", stdout)
    }
})
