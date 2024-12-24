const { exec } = require("child_process");
require("dotenv").config();

const API_KEY = process.env.TYPESENSE_API_KEY;
const PORT = process.env.TYPESENSE_PORT;

const command = `docker run -d -d ${PORT}:8108 -v\`pwd\`/typesense-server-data/:/data \typesense/typesense:0.22.0.rcu6 --data-dir /data --api-key=${API_KEY} --listen-port ${PORT} --disable-cors`;

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
