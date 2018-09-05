var mysql = require ("mysql");
var inquirer = require ("inquirer");
var Table = require('cli-table');
var queryStr;
var lowLimit = 300;

var connection = mysql.createConnection({
    host : "localhost",
    port : "3306",

    user : "root",

    password : "password",
    database : "bamazon"
});



connection.connect(function(err){
    if (err) throw err;
    initialize();
});

function initialize(){
    queryStr = "SELECT products.item_id, products.product_name , sales.product_sales, products.department_name , products.price , products.stock_quantity ";
    queryStr += "FROM sales INNER JOIN products ON (products.item_id = sales.item_id)";
    review(queryStr);
}

// this function displays the most updated inventory on the console.
function review (str){

    var table = new Table({
        head: ['ID', 'NAME', 'SALES' , 'DEPARTMENT', 'PRICE', 'IN STOCK']
      , colWidths: [5, 30, 10, 30, 10, 10],
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' ,             'top-right': '╗', 'bottom': '═' , 'bottom-mid': '╧' ,             'bottom-left': '╚' , 'bottom-right': '╝', 'left': '║' ,           'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
    });
    
    connection.query(str, function(err, data){
        if (err) throw err;
        for (var i=0 ; i < data.length ; i++){
            table.push(
                [data[i].item_id , data[i].product_name, data[i].product_sales , data[i].department_name, data[i].price,  data[i].stock_quantity]
            );
        }
        console.log("\n");
        console.log(table.toString());

        restart();
        // manageProduct();
    });
}

function manageProducts() {
    
    inquirer.prompt([
        {
            type: "list",
            name: "userOptions",
            message: "What would you like to do",
            choices: ["View Products for Sale", "View Low Inventory" ,"Add to Inventory", "Add New Product", "Quit"]
        }
    ]).then(function (answer) {
        switch (answer.userOptions) {
            //VIEW
            case "View Products for Sale":    
                review(queryStr);
                break;
            
            //VIEW
            case "View Low Inventory":
                viewLowInvetory();    
                break;
            
            //Update
            case "Add to Inventory":
                addToInventory();
                break;

            //add 
            case "Add New Product":
                getDepartments(addNew);
                break;   
        
            //QUIT    
            case "QUIT":
                exit();
                break;

        }
    });
}

function viewLowInvetory(){
    inquirer.prompt([
        {
            type : "input",
            message : "want to see the inventory less than ... (enter the value) ",
            name : "userInputLimit"
        }
    ]).then(function(response){
        lowLimit = response.userInputLimit;
        review(queryStr + " WHERE products.stock_quantity < " + lowLimit);
    });
}

function addToInventory(){
    
}

function addNew(list){
    var currentDepList = list;
    inquirer.prompt([{
        type: "input",
        name: "productName",
        message: "\nWhat is the name of the product you would like to add\n"
    }, {
        type:"list",
        name: "depName",
        message: "Which department does this product fall into\n",
        choices: ["electronin","pet supplies", "sports", "supplements", "food", "books","other"]
    }, {
        type: "input",
        name: "cost",
        message: "How much does it cost?\n"
    }, {
        type: "input",
        name: "quantity",
        message: "How many do we have? \n"

    }]).then(function(answers){
        var department = answers.depName;
        if(answers.depName === "other"){
            inquirer.prompt([
                {
                    type : "input",
                    name : "newDep",
                    message: "what is the new department"
                }]).then(function(OtherRes){
                    if(currentDepList.includes((OtherRes.newDep).toLowerCase())){
                        console.log("This department already exists");
                        getDepartments(addNew);
                    } else {
                        department = OtherRes.newDep;
                    }
            });
        } 
        var queryString = "INSERT INTO products SET ?";
        connection.query(queryString, {
            product_name   : answers.productName,
            department_name: department,
            price          : parseFloat(answers.cost).toFixed(4), 
            stock_quantity : parseInt(answers.quantity)
        });
        queryString = "INSERT INTO sales SET ?";
        connection.query(queryString, {
            product_sales   : 0
        });
        review(queryStr);
        
    });
}

function getDepartments(crud){
    var depList = [];

    connection.query("SELECT department_name from products", function(err, data){
        for (var i = 0 ; i < data.length ; i++){
            depList.push(data[i].department_name);
        }

    crud(depList);
    });
}


function restart() {
    inquirer.prompt([{
        type: "list",
        name: "continue",
        choices: ["Yes", "No"],
        message: "Would you like to do more?\n"
    }]).then(function(answers) {
        //If we want to manage more Products, we'll rerun our initial prompt
        if (answers.continue === "Yes") {
            manageProducts();
            //Otherwise, we'll terminate the process
        } else {
           exit();
        }

    });
}

// this function ends the connection to database
function exit (){
    console.log("Thanks for using my code to manage your inventory. Goodbye for now!");
    //This will exit out of our command line process
    connection.end();

}