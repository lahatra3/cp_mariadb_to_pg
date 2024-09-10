import { parentPort, workerData } from 'worker_threads';
import { createPool } from "mariadb";
import { Pool } from "pg";
import { mariadbConf, pgConf } from "./config";

const mariadbPool = createPool(mariadbConf);
const pgPool = new Pool(pgConf);

const copyData = async (offset: number, limit: number): Promise<void> => {
    const mariadbConn = await mariadbPool.getConnection();
    const pgConn = await pgPool.connect();

    try {
        const selectQueryStr: string = `SELECT * FROM ${Bun.env.MARIADB_TABLE} LIMIT ${limit} OFFSET ${offset}`;
        const resultSet = mariadbConn.queryStream(selectQueryStr);

        await pgConn.query('BEGIN');

        for await (const row of resultSet) {
            const keys = Object.keys(row);
            const values = Object.values(row);
            const insertQueryStr = `INSERT INTO ${Bun.env.PG_TABLE} (${keys.join(', ')})
            VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')})`;
            await pgConn.query(insertQueryStr, values);
        }

        await pgConn.query('COMMIT');
        parentPort?.postMessage({ offset, limit, success: true });
    } catch(error) {
        await pgConn.query('ROLLBACK');
        console.error('Error in worker: ', error);
        parentPort?.postMessage({ offset, limit, success: false, error });
    } finally {
        mariadbConn.release();
        pgConn.release();
    }
}

copyData(workerData.offset, workerData.limit).finally(() => {
    mariadbPool.end();
    pgPool.end();
});
