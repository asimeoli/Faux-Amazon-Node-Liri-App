var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    catalog();
});

//First display all of the items for sale
function catalog() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
}

//Message:
//1) ID of item for purchase
//2) Units for purchase

//Order placed
//1)Check for product >= amt for purchase
//--if not "insufficient quantity", and end order.
//2)If there is enough 
//--update SQL DB to show new quantity
//--show customer total cost of purchase