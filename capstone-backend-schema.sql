CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL CHECK (POSITION('@' IN email) > 1), 
    password    TEXT NOT NULL,
    username    TEXT UNIQUE NOT NULL,
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    is_admin    BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE posts (
  id          SERIAL PRIMARY KEY,
  caption     VARCHAR(140) NOT NULL,
  user_id     INTEGER NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY  (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE ratings (
  rating      INTEGER NOT NULL CHECK (rating > 0 AND rating <= 5),
  post_id     INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
  --the primary key makes it so that a user_id can't create more than one rating for that same post
);


CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  image       TEXT,
  description TEXT NOT NULL,
  -- store price in centers with bigint data type
  price       BIGINT NOT NULL
);

<<<<<<< HEAD
CREATE TABLE cart (
  id          SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL, 
  --stores the ID of the person using the cart
  bill        INTEGER NOT NULL DEFAULT 0

);
CREATE TABLE cart_details (
  card_id    INTEGER NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (card_id, product_id)
);

--orders consists of all of the orders made by users present in our application
--once a user checkout the cart items will be converted into an order and cart will be emptied
=======
>>>>>>> dc6f52ab77bc0b46f414248862cbf5130ef3a6e3
CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,  
  bill        INTEGER NOT NULL DEFAULT 0
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE orders_details (
  orders_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (orders_id, product_id)
);