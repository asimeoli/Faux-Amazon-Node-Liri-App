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
    catalog();
});

//First display all of the items for sale
function catalog() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;
        console.table(results);
        userInput(results);
    });
}

function userInput(results) {
    inquirer.prompt([{
            type: "input",
            message: "What is the ID of the product for purchase?\n",
            name: "productId",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            message: "How many units for purchase?\n",
            name: "productAmt",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }

        }
    ]).then(function(answer) {
        var chosenItem;
        var chosenAmt = parseInt(answer.productAmt);
        for (var i = 0; i < results.length; i++) {
            if (results[i].item_id == answer.productId) {
                chosenItem = results[i];
                break;
            }
        }
        if (chosenItem.stock_quantity >= chosenAmt) {
            var newQuantity = chosenItem.stock_quantity - chosenAmt;
            connection.query(
                "UPDATE products SET ? WHERE ?", [{
                    stock_quantity: newQuantity
                }, {
                    item_id: chosenItem.item_id
                }],
                function(error) {
                    if (error) throw error;
                    var totalAmt = chosenAmt * chosenItem.price;
                    console.log("Your total is " + totalAmt);
                    upNext();
                }
            );
        } else {
            console.log("------------------------------------------------")
            console.log("There are not enough of item number " + chosenItem.item_id + " in stock to fill your order. Please try again.\n");
            console.log("------------------------------------------------")
            catalog();
        }
    });
}

function upNext() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do now?\n",
        name: "toDo",
        choices: ["Shop-Again", "Exit"]

    }]).then(function(answer) {
        switch (answer.toDo) {
            case "Shop-Again":
                catalog();
                break;

            case "Exit":
                exit();
                break;
        }
    });

    function exit() {
        console.log("Shopping Complete\n");
        connection.end();
    }
}