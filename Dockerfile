FROM oven/bun:slim AS app_builder

WORKDIR /app

COPY package.json bun.lockb tsconfig.json ./
COPY main.ts worker.ts config.ts ./

RUN bun install --production \
    && bun build \ 
    --compile --minify ./main.ts ./worker.ts ./config.ts \
    --target=bun-linux-x64 \
    --outfile=cp_mariadb_to_pg


FROM oven/bun:slim

WORKDIR /app

COPY --from=app_builder /app/cp_mariadb_to_pg ./

CMD [ "/app/cp_mariadb_to_pg" ]
