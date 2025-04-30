const cluster = require('cluster');
const os = require('os');
const express = require('express');
const { Worker } = require('worker_threads');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} morreu. Criando novo...`);
        cluster.fork();
    });

} else {
    const app = express();
    app.disable('x-powered-by');

    app.get("/nodejs", (_, response) => {
        setTimeout(() => {
            const worker = new Worker(`
                const { parentPort } = require('worker_threads');
                const data = Buffer.alloc(1024 * 1024);
                parentPort.postMessage(data);
            `, { eval: true });

            worker.once("message", (data) => {
                response.status(200);
                response.setHeader('Content-Type', 'application/octet-stream');
                response.send(data);
            });

            worker.once("error", (err) => {
                response.status(500).json({ error: err.message });
            });
        }, 100);
    });

    app.listen(8080, "127.0.0.1", () => {
        console.log(`Worker ${process.pid} started`);
    });
}