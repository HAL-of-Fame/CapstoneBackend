CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL CHECK (POSITION('@' IN email) > 1), 
    password    TEXT NOT NULL,
    username    TEXT UNIQUE NOT NULL,
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    is_admin    BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  image       TEXT,
  description TEXT NOT NULL,
  -- store price in centers with bigint data type
  price       BIGINT NOT NULL
);
CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,  
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE order_details (
  order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1,
  discount    INTEGER,
  PRIMARY KEY (order_id, product_id)
);