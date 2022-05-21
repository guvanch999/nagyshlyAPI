
CREATE TABLE cat (
   id serial primary key,
   name TEXT NOT NULL,
   nameRU TEXT NOT NULL,
   image TEXT NOT NULL
);
CREATE TABLE sub (
   id serial primary key,
   name TEXT NOT NULL,
   nameRU TEXT NOT NULL,
   cat_id INT NOT NULL
);
CREATE TABLE product (
   id serial primary key,
   cat_id INT NOT NULL,
   sub_id INT NOT NULL,
   name TEXT NOT NULL,
   nameRU TEXT NOT NULL,
   about TEXT NOT NULL,
   aboutRU TEXT NOT NULL,
   oldprice numeric NOT NULL,
   price numeric NOT NULL,
   discount numeric NOT NULL,
   imagetmb TEXT NOT NULL,
   stock INT NOT NULL
);
CREATE TABLE file (
   id serial primary key,
   type TEXT NOT NULL,
   name TEXT NOT NULL,
   url TEXT NOT NULL,
   product_id INT NOT NULL
);
CREATE TABLE detail (
   id serial primary key,
   elthyzmat numeric NOT NULL,
   jemiarzan numeric NOT NULL,
   adress TEXT NOT NULL,
   tel TEXT NOT NULL,
   email TEXT NOT NULL
);
CREATE TABLE users (
   id serial primary key,
   tel TEXT NOT NULL,
   fullname TEXT NOT NULL,
   f_token TEXT NOT NULL
);
CREATE TABLE verif (
   id serial primary key,
   tel TEXT NOT NULL,
   code TEXT NOT NULL,
   timee bigint NOT NULL
);
CREATE TABLE address (
   id serial primary key,
   user_id INT NOT NULL,
   adress TEXT NOT NULL
);
CREATE TABLE orders (
   id serial primary key,
   user_id INT NOT NULL,
   sene TEXT NOT NULL,
   adress TEXT NOT NULL,
   harytlar TEXT NOT NULL,
   elt TEXT NOT NULL,
   arzan TEXT NOT NULL,
   jemi TEXT NOT NULL,
   peyment TEXT NOT NULL,
   status TEXT NOT NULL,
   isshown int not null
);
CREATE TABLE orderproduct (
   id serial primary key,
   order_id INT NOT NULL,
   count TEXT NOT NULL,
   product_id INT NOT NULL,
   price numeric not null
);
CREATE TABLE rules (
   id serial primary key,
   rule TEXT NOT NULL,
   ruleRU text not null
);
CREATE TABLE banner (
   id serial primary key,
   url TEXT NOT NULL
);
CREATE TABLE admintables (
   id serial primary key,
   username TEXT NOT NULL,
   password TEXT NOT NULL
);
