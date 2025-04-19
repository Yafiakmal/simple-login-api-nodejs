# simple-login-api-nodejs

## create file .env in app/
1. you have to add this environment variable first in ./app/.env

2. get your _password app_ in google account management and fill it to EMAIL_USER and EMAIL_PASS variable.

```
PORT = 3000

DB_USER = "postgres"
DB_HOST = "db"
DB_DATABASE = "node-login-db"
DB_PASSWORD = "postgres"
DB_PORT = "5432"

EMAIL_USER = <your gmail>
EMAIL_PASS =  <password app from gmail>

NODE_ENV = "development"

JWT_SECRET = "nggoemail"
JWT_AT_SECRET = "pokokepokok"
JWT_RT_SECRET = "pokokepokok2"

JWT_SECRET_TIME = 180000 #3 * 60 * 1000
JWT_AT_SECRET_EXPIN = 300 #5 * 60 * 1000
JWT_RT_SECRET_EXPIN = 604800# 604800000 #7 * 24 * 60 * 60 * 1000

RECAPTCHA_SITEKEY = <you can get from google captcha>
RECAPTCHA_SECRETKEY = <you can get from google captcha>

```

## run docker compose

compose nya akan menjalankan 2 container yaitu database postgres dan server express.
```shell
sudo docker compose up -f docker-compose.yml
```

## create table

### in to psql in container

```shell
sudo docker exec -it node-login-db psql -U postgres -d node-login-db
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

## Accessing some api with postman

### POST http://localhost:3000/auth/register
api ini membutuhkan body:
```json
{
    "username": "yourname",
    "email":"youremail@gmail.com",
    "password":"yourpassword"
}
```

contoh response jika berhasil
```json
{
    "status": "success",
    "data": [
        {
            "verify_code": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InlhZmlha21hbEBnbWFpbC5jb20iLCJpYXQiOjE3NDUwNTY2NTEsImV4cCI6MTc0NTIzNjY1MX0.mBmlEqEB4ILBdb1vIqDmLfs1au7slNfuuNB2IG1wtXk"
        }
    ],
    "message": "Succesfully registered, Please verify your email yafiakmal@gmail.com to complete registration."
}
```

data verify_code bisa digunakan untuk pengujian api /auth/verify/:token, jika tidak ingin menggunakan email asli.

### GET http://localhost:3000/auth/verify/:token
api ini tidak perlu body.

contoh response jika berhasil
```json
{
    "status": "success",
    "data": [
        {
            "email": "yafiakmal@gmail.com"
        }
    ],
    "message": "Your Email, Verified Successfuly."
}

```

### POST http://localhost:3000/auth/login

### GET http://localhost:3000/auth/protected

### POST http://localhost:3000/auth/logout

### POST http://localhost:3000/auth/refresh

### POST http://localhost:3000/auth/remove

### GET http://localhost:3000/user
