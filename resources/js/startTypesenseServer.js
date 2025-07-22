/* eslint-disable */
const { exec } = require("child_process");
require("dotenv").config();

const API_KEY = process.env.TYPESENSE_API_KEY;
const PORT = process.env.TYPESENSE_PORT;

const command = `docker run -d -p 8108:8108 -v/tmp/typesense-data:/data typesense/typesense:28.0.rc30 --data-dir /data --api-key=Hu52dwsas2AdxdE`;


exec(command, (err, stdout, stderr) =>{
    if(!err && !stderr){
        console.warn("Typesense Server is running...")
    }

    if(err){
        console.warn("Error running server: ", err)
    }

    if(stderr){
        console.warn("Error running server: ", stderr)
    }

    if(stdout){
        console.warn("Server output : ", stdout)
    }
})
