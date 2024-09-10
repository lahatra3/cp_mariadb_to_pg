# cp_mariadb_to_pg

### To install dependencies:

```bash
bun install
```

### To run:

```bash
bun run main.ts
```

### To compile standalone executable

- **For linux**

```bash
bun build --compile --minify ./main.ts ./worker.ts ./config.ts  --target=bun-linux-x64 --outfile=cp_mariadb_to_pg
```

- **For windows**

```bash
bun build --compile --minify ./main.ts ./worker.ts ./config.ts  --target=bun-windows-x64 --outfile=cp_mariadb_to_pg
```

Before running this application, don't forget to create `.env` file from template `.env.template`

### To run with docker

- **Documentation**
    https://hub.docker.com/r/lahatra3/cp_mariadb_to_pg

- **From docker hub**

    - **Pull image**

    ```bash
    docker pull lahatra3/cp_mariadb_to_pg
    ```
    
    - **Run container**

    ```bash
    docker run --rm --env-file=".env" -it cp_mariadb_to_pg
    ```

- **From source code**

    - **Build image**

    ```bash
    docker build -t cp_mariadb_to_pg .
    ```

    - **Run container**

    ```bash
    docker run --rm --env-file=".env" -it cp_mariadb_to_pg
    ```

This project was created using `bun init` in bun v1.1.26. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
