var inquirer = require("inquirer");
var mysql = require("mysql");
var consoledottable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazonDB"
});

connection.connect(function(error) {
    if (error) throw error;
    console.log("connected as id " + connection.threadId + "\n");
    managerView();
});

function managerView() {
    inquirer.prompt([{
        type: "list",
        message: "Please select a task:",
        name: "managerTask",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }]).then(function(answer) {
        switch (answer.managerTask) {

            case "View Products for Sale":
                catalog();
                break;

            case "View Low Inventory":
                lowInventoryCatalog();
                break;

            case "Add to Inventory":
                addToInventory();
                break;

            case "Add New Product":
                addNewProduct();
                break;
            case "Exit":
                exit();
                break;
        }
    });
}

function catalog() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;
        console.table(results);
        managerView();
    });
}

function printEntry(product) {
    connection.query("SELECT * FROM products WHERE ?", [{
        product_name: product
    }], function(error, results) {
        if (error) throw error;
        console.table(results);
        managerView();
    });
}

function exit() {
    console.log("Good-Bye");
    connection.end();
}

function lowInventoryCatalog() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(error, results) {
        if (error) throw error;
        console.table(results);
        managerView();
    });
}

function addToInventory() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;
        inquirer.prompt([{
            name: "productName",
            type: "list",
            message: "Please select a product for inventory update",
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].product_name);
                }
                return choiceArray;
            }

        }, {
            name: "amount",
            type: "input",
            message: "What is the quantity you would like to add?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }]).then(function(answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].product_name == answer.productName) {
                    chosenItem = results[i];
                    break;
                }
            }
            var addAmount = parseInt(answer.amount);
            if (addAmount > 0) {
                var newAmount = addAmount + chosenItem.stock_quantity;
                connection.query(
                    "UPDATE products SET ? WHERE ?", [{
                        stock_quantity: newAmount
                    }, {
                        item_id: chosenItem.item_id
                    }],
                    function(error) {
                        if (error) throw error;
                        console.log("--------------------");
                        console.log("Stock added!");
                        console.log("--------------------");
                        printEntry(chosenItem.product_name);
                    })
            }

        });
    })
}

function addNewProduct() {
    inquirer.prompt([{
        name: "product_name",
        type: "input",
        message: "What is the product you would like to add?"
    }, {
        name: "department_name",
        type: "input",
        message: "What is the department you would like to the product to?"
    }, {
        name: "price",
        type: "input",
        message: "What is price of the product?",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }, {
        name: "stock_quantity",
        type: "input",
        message: "What is the quantity you would like to add?",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }]).then(function(answer) {
        connection.query(
            "INSERT INTO products SET ?", {
                product_name: answer.product_name,
                department_name: answer.department_name,
                price: answer.price,
                stock_quantity: answer.stock_quantity
            },
            function(error) {
                if (error) throw error;
                console.log("Your new product was created successfully!");
                managerView();
            });
    });
}