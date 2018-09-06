DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE  products(
    item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price FLOAT(10,2),
    stock_quantity INTEGER(20),
    product_sales FLOAT(10,2),
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name , department_name ,  price , stock_quantity , product_sales)
VALUES ("echo plus" , "electronins" ,  99.99 , 920 , 999.9);

INSERT INTO products(product_name ,  department_name ,  price , stock_quantity , product_sales)
VALUES ("cat tree" , "pet supplies" , 69.99 , 1230 , 699.9);

INSERT INTO products(product_name , department_name ,  price , stock_quantity , product_sales)
VALUES ("cat toy" , "pet supplies" , 13.41 , 512 , 1341);

INSERT INTO products(product_name , department_name ,  price , stock_quantity , product_sales)
VALUES ("catit flower fountain" , "pet supplies" , 36.47 , 111 , 364.7);

INSERT INTO products(product_name , department_name ,  price , stock_quantity , product_sales)
VALUES ("Lenovo yoga book" ,"electronins" , 314.00 , 785, 3140);

INSERT INTO products(product_name , department_name ,  price , stock_quantity , product_sales)
VALUES ("adidas shoes" , "sports ", 48.96 , 437 , 4896);

INSERT INTO products(product_name , department_name ,  price , stock_quantity , product_sales)
VALUES ("yoga mat" , "sports ", 19.99 , 5007 , 199.9);

INSERT INTO products(product_name , department_name ,  price , stock_quantity , product_sales)
VALUES ("vitamin C" , "supplements" , 14.99 , 7000 , 1499);

INSERT INTO products(product_name , department_name ,  price , stock_quantity , product_sales)
VALUES ("water bottle" , "sports ", 6.79 , 460 , 67.9);

INSERT INTO products(product_name , department_name ,  price , stock_quantity , product_sales)
VALUES ("organic cashes" , "food" , 21.99 , 896 , 219.9);

SELECT * FROM products;

CREATE TABLE  departments(
    department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50),
    over_head_costs INTEGER(20),
    PRIMARY KEY(department_id)
);

INSERT INTO departments (department_id , department_name ,  over_head_costs)
VALUES ("echo plus" , "electronins" ,  99.99 , 920);

SELECT * FROM departments;



CREATE TABLE sales(
    item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    
    product_sales INTEGER(50),
    
    PRIMARY KEY(item_id)
);

INSERT INTO sales(product_sales)
VALUES (100);

INSERT INTO sales(product_sales)
VALUES (200);

INSERT INTO sales(product_sales)
VALUES (70);

INSERT INTO sales(product_sales)
VALUES (300);

INSERT INTO sales(product_sales)
VALUES (512);

INSERT INTO sales(product_sales)
VALUES (25);

INSERT INTO sales(product_sales)
VALUES (1000);

INSERT INTO sales(product_sales)
VALUES (600);

INSERT INTO sales(product_sales)
VALUES (20);

INSERT INTO sales(product_sales)
VALUES (700);

SELECT * FROM products;
SELECT * FROM sales;

