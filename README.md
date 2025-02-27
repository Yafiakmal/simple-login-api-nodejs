# simple-login-api-nodejs

## run docker compose 
```shell
docker compose up -f docker-compose.yml
```

## create table
### masuk psql di container
```shell
docker exec -it node-login-db psql -U postgres -d node-login-db
```
tidak perlu membuat database karena docker-compose.yml sudah menginisialisasi env dan dibuatkan otomatis

### buat table berikut
```sql
CREATE TABLE users (
    id_user UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    hpass TEXT NOT NULL,
    verification_code VARCHAR(255),
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


## menjalankan server
```shell
docker exec -it node-login-app bash
npm install
```
go to http://localhost:3000/