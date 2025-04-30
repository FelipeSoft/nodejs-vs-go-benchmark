const cluster = require('cluster');
const os = require('os');
const express = require('express');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });

} else {
    const app = express();
    app.disable('x-powered-by');

    app.get("/nodejs", (_, response) => {
        response.status(200).json({ message: "ok" });
    });

    app.listen(8080, "127.0.0.1", () => {
        console.log(`Worker ${process.pid} started`);
    });
}
