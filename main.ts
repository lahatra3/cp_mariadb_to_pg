import { availableParallelism } from 'os';
import { Worker } from 'worker_threads';
import { dataSourceConf } from './config';


const totalRows: number = dataSourceConf.totalRows;
const limit: number = dataSourceConf.batchSize;

const runWorkers = async (): Promise<void> => {
    const numCpus: number = availableParallelism();
    const workers: Array<Worker> = [];
    let offset = 0;

    const setOffset = (value: number): void => {
        offset = value + limit;
    }

    const spawnWorker = (core: number) => {
        const worker: Worker = new Worker(new URL("./worker.js", import.meta.url), { workerData: { offset, limit } });
        workers.push();
    
        worker.on('message', (message) => {
            console.log(`Worker ${core} processed ${message.limit} rows starting from offset ${message.offset} \nSuccess: ${message.success} ... \n`);

            if (message.success) {
                if (offset < totalRows) {
                    spawnWorker(core);
                    setOffset(offset);
                }
            }
        });
    
        worker.on('error', (error) => {
            console.error(`Worker ${core} error:`, error);
        });
    
        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker ${core} stopped with exit code ${code} ...`);
            }
        });
    }

    for (let core = 0; core < numCpus; core++) {
        spawnWorker(core);
        setOffset(offset);
    }
}

runWorkers().catch((error) => {
    console.error('Error running workers: ', error);
});
