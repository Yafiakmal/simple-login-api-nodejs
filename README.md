# simple-login-api-nodejs

## create file .env

```
PORT = 3000

DB_USER = "postgres"
DB_HOST = "db"
DB_DATABASE = "node-login-db"
DB_PASSWORD = "postgres"
DB_PORT = "5432"

JWT_SECRET = <whatever>
JWT_AT_SECRET = <whatever>
JWT_RT_SECRET = <whatever>

EMAIL_USER = <your gmail>
EMAIL_PASS =  <password app from gmail>

NODE_ENV = "development"

RECAPTCHA_SITEKEY = <you can get from google captcha>
RECAPTCHA_SECRETKEY = <you can get from google captcha>

```

## run docker compose

```shell
docker compose up -f docker-compose.yml
```

## create table

### masuk psql di container

```shell
docker exec -it node-login-db psql -U postgres -d node-login-db
```

tidak perlu membuat database karena docker-compose.yml sudah menginisialisasi environment variable untuk membuat database dan dibuatkan otomatis ketika menjalankan

### buat table berikut

```sql
CREATE TABLE users (
    id_user UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    hpass TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
);
```

go to: http://localhost:3000/
