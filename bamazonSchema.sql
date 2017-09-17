DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products (
	item_id INTEGER(10) AUTO_INCREMENT NOT NULL, 
    product_name VARCHAR(30) NOT NULL, 
    department_name VARCHAR(30) NOT NULL, 
    price INTEGER(10) NOT NULL,
    stock_quantity INTEGER(10),
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Plate", "Home & Kitchen", 6, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cup", "Home & Kitchen", 4, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fork", "Home & Kitchen", 3, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pillow", "Bed & Bath", 20, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blanket", "Bed & Bath", 50, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Chair", "Home & Kitchen", 100, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Table", "Home & Kitchen", 200, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Shampoo", "Health & Beauty", 4, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Soap", "Health & Beauty", 2, 600);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Asprin", "Health & Beauty", 5, 800);
