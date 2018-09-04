var mysql = require ("mysql");
var inquirer = require ("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host : "localhost",
    port : "3306",

    user : "root",

    password : "password",
    database : "bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    review();
});

// this function displays the most updated inventory on the console.
function review (){
    var table = new Table({
        head: ['ID', 'NAME', 'DEPARTMENT', 'PRICE', 'STOCK']
      , colWidths: [5, 30, 30, 10, 10],
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' ,             'top-right': '╗', 'bottom': '═' , 'bottom-mid': '╧' ,             'bottom-left': '╚' , 'bottom-right': '╝', 'left': '║' ,           'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
    });
    connection.query("SELECT * FROM products", function(err, data){
        if (err) throw err;
        for (var i=0 ; i < data.length ; i++){
            table.push(
                [data[i].item_id , data[i].product_name, data[i].department_name, data[i].price,  data[i].stock_quantity]
            );
        }
        console.log("\n");
        console.log(table.toString());

        manageProduct();
    });
}

// this function either continues to keep the interaction withh the customer or exits depending on customer's wish
function restart (){

    
}

// this function ends the connection to database
function exit (){
    console.log("Thanks for shopping with us, hope to see you back soon. Goodbye for now!");
    //This will exit out of our command line process
    connection.end();

}

function manageProduct () {
    
    inquirer.prompt([
        {
            type : "input",
            message : "what is the ID of the item you would like to purchase [Quit with Q]",
            name : "userItem"
        }
    ]).then(function(response){    
        if ((response.userItem).toLowerCase() === "q"){
            exit();
        } else if (!isNaN(response.userItem)){
            console.log(" the ID you entered is " + response.userItem);

            if (idAvailable(parseInt(response.userItem))){
                console.log("the id you entered is not available please enter again");
                manageProduct();
            }

        } else {
            console.log(" this input is not acceptable");
            manageProduct();

        } 

    });
} 


function idAvailable(id){
    var checkId = false;
    var ids = [];
    connection.query("SELECT item_id FROM products", function(err, data){
        if (err) throw err;
        for(var i = 0; i < data.length ; i++){
            ids.push(data[i].item_id);
        }
        console.log(ids);
        if(ids.includes(id)) {
            checkId = true;
            console.log("hey");
            return true;
        } else{
            checkId = false;
            return false;
        }
        
    });
    console.log(checkId);
}