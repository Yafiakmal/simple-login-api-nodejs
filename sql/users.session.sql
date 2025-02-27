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

-- INSERT DATA
INSERT INTO users (username, email, hpass, verification_code, is_verified)
VALUES ('yafiakmal', 'yafiakmal45@gmail.com', 'hashed password', 'vercode1234', 'true');

INSERT INTO users (username, email, hpass, verification_code, is_verified)
VALUES ('yafiakmal2', 'yafiakmal46@gmail.com', 'hashed password', 'vercode1234', 'true');
-- DELETE DATA
DELETE FROM users WHERE username = 'yafiakmal';
TRUNCATE TABLE users;

-- UPDATE DATA
UPDATE users 
SET email = 'bobmarley@example.com' 
WHERE username = 'yafiakmal';

-- READ DATA
SELECT email FROM users WHERE username = 'yafiakmal';

-- CHANGE TABLE STRUCTURE
ALTER TABLE users ALTER COLUMN id_user SET DEFAULT uuid7();



-- DELETE TABLE
-- Gunakan DELETE jika ingin menghapus sebagian data atau tetap mempertahankan auto-increment ID.
-- Gunakan TRUNCATE jika ingin menghapus semua data dengan lebih cepat.
-- Gunakan TRUNCATE ... RESTART IDENTITY jika ingin menghapus semua data dan mengatur ulang ID.
DELETE FROM users;
TRUNCATE TABLE users cascade;
TRUNCATE TABLE users RESTART IDENTITY;
