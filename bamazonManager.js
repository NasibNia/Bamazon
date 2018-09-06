var mysql = require ("mysql");
var inquirer = require ("inquirer");
var Table = require('cli-table');
var queryStr;
var lowLimit = 300;
var message; 

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
    queryStr = "SELECT item_id, product_name , product_sales, department_name , price , stock_quantity FROM products";
    message = null;
    review(queryStr , message);
}

// this function displays the most updated inventory on the console.
function review (str , txt){

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
        summary(txt);
        restart();
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
                review(queryStr , "You Viewed Products for Sale\nPress Yes if wish to do more");
                break;
            
            //VIEW
            case "View Low Inventory":
                viewLowInvetory();    
                break;
            
            //Update
            case "Add to Inventory":
                getItem(addToInventory);
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
        message = "You Rreviewed the Low Inventory";
        review(queryStr + " WHERE products.stock_quantity < " + lowLimit , message);
    });
}

function addToInventory(list,quants){
    var itemList = list;
    // console.log(quants);
    inquirer.prompt([{
        type: "input",
        name: "itemName",
        message: "\nWhat is the id of the inventory you would like to add to?\n",
        // choices : itemList
    },{
        type : "input",
        name: "newInv",
        message: "\nHow many would you like to add to this inventory?\n",

    }
    ]).then(function(response){
        // var newValue = response.listOfItems[4]+ response.newInv;
        var quantsNow = quants[itemList.indexOf(parseInt(response.itemName))];
        var quantsNew = quantsNow + parseInt(response.newInv);
        var queryString = "UPDATE products SET ? WHERE ?";
        connection.query(queryString,[
            {   
                stock_quantity : quantsNew
                
            },
            {
                item_id : parseInt(response.itemName)
            }
        ], 
        function(err, res) {
            console.log("Here is an updated list of the inventories:");
            message = "You added " + response.newInv + "to the item with the id " + response.itemName ; 
            review(queryStr , message) ; 
        }
    );
    });
    
}

function addNew(list){
    var currentDepList = list;
    currentDepList.push("other");
    inquirer.prompt([{
        type: "input",
        name: "productName",
        message: "\nWhat is the name of the product you would like to add\n"
    }, {
        type: "input",
        name: "cost",
        message: "How much does it cost?\n"
    }, {
        type: "input",
        name: "quantity",
        message: "How many do we have? \n"

    }, {
        type:"list",
        name: "depName",
        message: "Which department does this product fall into\n",
        choices: currentDepList
    }]).then(function(answers){
        var department = answers.depName;
        if(department === "other"){
            inquirer.prompt([
                {
                    type : "input",
                    name : "newDep",
                    message: "what is this 'OTHER' department?"
                }]).then(function(OtherRes){
                    // console.log("currentDepList "  + currentDepList);
                    // console.log("OtherRes.newDep " + OtherRes.newDep);
                    // console.log(currentDepList.includes((OtherRes.newDep).toLowerCase()));
                    if(currentDepList.includes((OtherRes.newDep).toLowerCase())){
                        console.log("Department already exists");
                    } 
                    department = (OtherRes.newDep).toLowerCase();
                    
                    var queryString = "INSERT INTO products SET ?";
                    connection.query(queryString, {
                        product_name   : answers.productName,
                        department_name: department,
                        price          : parseFloat(answers.cost).toFixed(2), 
                        stock_quantity : parseInt(answers.quantity),
                        product_sales   : 0
                    });
                    
                    // console.log("Product added!");
                    message = "You added a new product to department " + department +  "\n";
                    message += "Product Name     : "+ answers.productName + "\n";
                    message += "Quantities added : "+ parseInt(answers.quantity) + "\n";
                    message += "Selling Price    : "+ parseFloat(answers.cost).toFixed(2), + "\n";

                    review(queryStr , message);
                    });
        } else {
            var queryString = "INSERT INTO products SET ?";
            connection.query(queryString, {
                product_name   : answers.productName,
                department_name: department,
                price          : parseFloat(answers.cost).toFixed(4), 
                stock_quantity : parseInt(answers.quantity),
                product_sales   : 0
            });
            
            // console.log("Product added!");
            message = "You added a new product to department " + department +  "\n";
            message += "Product Name     : "+ answers.productName + "\n";
            message += "Quantities added : "+ parseInt(answers.quantity) + "\n";
            message += "Selling Price    : "+ parseFloat(answers.cost).toFixed(2), + "\n";

            review(queryStr , message);
        }    
    });
}

function getDepartments(crud){
    var depList = [];

    connection.query("SELECT DISTINCT department_name from products", function(err, data){
        for (var i = 0 ; i < data.length ; i++){
            depList.push(data[i].department_name);
        }

    crud(depList);
    });
}

function getItem(crud){
    var itemList = [];
    var quant =[];
    connection.query("SELECT  * from products", function(err, data){
        for (var i = 0 ; i < data.length ; i++){
            // itemList.push(data[i].product_name);
            
            itemList.push(data[i].item_id);
            // itemList[i].push(data[i].product_name);
            // itemList[i].push(data[i].department_name);
            // itemList[i].push(data[i].price);
            quant.push(data[i].stock_quantity);
        }
    crud(itemList, quant);
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
function exit(){
    console.log("Thanks for using my code to manage your inventory. Goodbye for now!");
    //This will exit out of our command line process
    connection.end();
}

function summary(st){
    console.log(st);
    if (st !== null){
        var table2 = new Table({
            head: ['SUMMARY']
          , colWidths: [50],
          chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' ,             'top-right': '╗', 'bottom': '═' , 'bottom-mid': '╧' ,             'bottom-left': '╚' , 'bottom-right': '╝', 'left': '║' ,           'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
             , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
        });
        table2.push([st]);
        console.log("\n");
        console.log(table2.toString());
    }
    
}