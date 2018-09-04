DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price FLOAT(10,2),
    stock_quantity INTEGER(20),
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name , department_name ,  price , stock_quantity)
VALUES ("echo plus" , "electronins" ,  99.99 , 920);

INSERT INTO products(product_name ,  department_name ,  price , stock_quantity)
VALUES ("cat tree" , "pet supplies" , 69.99 , 1230);

INSERT INTO products(product_name , department_name ,  price , stock_quantity)
VALUES ("cat toy" , "pet supplies" , 13.41 , 512);

INSERT INTO products(product_name , department_name ,  price , stock_quantity)
VALUES ("catit flower fountain" , "pet supplies" , 36.47 , 111);

INSERT INTO products(product_name , department_name ,  price , stock_quantity)
VALUES ("Lenovo yoga book" ,"electronins" , 314.00 , 785);

INSERT INTO products(product_name , department_name ,  price , stock_quantity)
VALUES ("adidas shoes" , "sports ", 48.96 , 437);

INSERT INTO products(product_name , department_name ,  price , stock_quantity)
VALUES ("yoga mat" , "sports ", 19.99 , 5007);

INSERT INTO products(product_name , department_name ,  price , stock_quantity)
VALUES ("vitamin C" , "supplements" , 14.99 , 7000);

INSERT INTO products(product_name , department_name ,  price , stock_quantity)
VALUES ("water bottle" , "sports ", 6.79 , 460);

INSERT INTO products(product_name , department_name ,  price , stock_quantity)
VALUES ("organic cashes" , "food" , 21.99 , 896);



SELECT * FROM products;