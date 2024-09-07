export const mariadbConf = {
    host: Bun.env.MARIADB_HOST,
    port: +Bun.env.MARIADB_PORT!,
    user: Bun.env.MARIADB_USER,
    password: Bun.env.MARIADB_PASSWORD,
    database: Bun.env.MARIADB_NAME,
};

export const pgConf = {
    host: Bun.env.PG_HOST,
    port: +Bun.env.PG_PORT!,
    user: Bun.env.PG_USER,
    password: Bun.env.PG_PASSWORD,
    database: Bun.env.PG_NAME
}

export const dataSourceConf = {
    totalRows: +Bun.env.TOTAL_ROWS!,
    batchSize: +Bun.env.BATCH_SIZE!
}