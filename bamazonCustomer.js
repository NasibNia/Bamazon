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
        head: ['ID', 'PRODUCT NAME', 'DEPARTMENT NAME', 'UNIT PRICE', 'IN STOCK QUANTITY', 'PRODUCT SALES' ]
      , colWidths: [5, 30, 30, 30, 30, 30],
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' ,             'top-right': '╗', 'bottom': '═' , 'bottom-mid': '╧' ,             'bottom-left': '╚' , 'bottom-right': '╝', 'left': '║' ,           'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
    });
    
    connection.query("SELECT * FROM products", function(err, data){
        if (err) throw err;
        for (var i=0 ; i < data.length ; i++){
            table.push(
                [data[i].item_id , data[i].product_name, data[i].department_name, data[i].price,  data[i].stock_quantity, data[i].product_sales]
            );
        }
        console.log("\n");
        console.log(table.toString());

        manageProduct();
    });
}



function manageProduct () {
    
    inquirer.prompt([
        {
            type : "input",
            message : "what is the ID of the item you would like to purchase [Quit with Q]",
            name : "userItem"
        }
    ]).then(function(response){ 
        
        validateId(response.userItem ,  manageProduct , takeOrder); 

    });
} 

function takeOrder (id){
    inquirer.prompt([
        {
            type: "input",
            message:"How many would you like? [Quit with Q]",
            name : "quantity"
        }
    ]).then(function(response){
        validateQuantity(id , response.quantity , takeOrder ,updateProducts);

    });
}

function updateProducts(id , numbers, updatedSales) {
    var queryString = "UPDATE products SET ? WHERE ?";
    connection.query(queryString,[
        {
             stock_quantity : numbers,
             product_sales  : updatedSales
        },
        {
            item_id : id
        }] , function(err, data){
        if (err) throw err;
        console.log("Wonderful! your purchase completed, Here is an updated list of products:");
        //Let's have a look at our updated table (pulling straight from our database!!!!)
        review() ;
    });

}

function validateId (input , callback1, callback2){
    var options = [];
    // if the input is either q or Q   
    if ((input).toLowerCase() === "q"){
        exit();
    }//check if the id is a number 
    else if (!isNaN(input)){
        // console.log(" the ID you entered is  a number");
        //check if the number user entered exists in the list of item options  
        var querySrt = "SELECT  item_id FROM products" ;
        connection.query(querySrt , function(err, data){
            if (err) throw err;
            // console.log (querySrt);
            // console.log(data);
            for(var i = 0; i < data.length ; i++){
                options.push(parseInt(data[i].item_id));
            }
            if(options.includes(parseInt(input))) {
                // console.log("inside true");
                callback2(parseInt(input));        
            } else{
                // console.log("inside false");                    
                callback1();
            }
        });
    } // if the input is any other than Q or a number  
    else {
        console.log(" This Input Is Not Acceptable, Please Try Again!");
        callback1();

    }
}

function validateQuantity (id , input , callback1 , callback2){
    // if the input is either q or Q   
    if ((input).toLowerCase() === "q"){
        exit();
    }//check if the id is a number 
    else if (!isNaN(input)){
        // console.log(" the ID you entered is  a number");
        //check if the number user entered exists in the list of item options  
        // console.log("id " + id);
        var querySrt = "SELECT  * FROM products WHERE ?" ;
        connection.query(querySrt , 
            {
                item_id : id
            }, 
            function(err, data){
                if (err) throw err;
                // console.log(data);
                var stock = parseInt(data[0].stock_quantity);
                var request = parseInt(input);
                // console.log("stock " + stock);
                // console.log("request "+ request);
                if (request > stock) {
                    console.log("Sorry! This value is more than what we have in stock; Please Try again! ");
                    callback1(id);
                } else{
                    console.log("YAYYYY! we have the number you ordered in our stock");
                    
                    var newQuantity = stock-request;
                    var newsales  = parseFloat(data[0].price) * request + parseFloat(data[0].product_sales);
                    // console.log ("new is" + newQuantity);
                    callback2(parseInt(id),newQuantity , newsales); 
                }
        });
    }
}

// this function ends the connection to database
function exit (){
    console.log("Thanks for shopping with us, hope to see you back soon. Goodbye for now!");
    //This will exit out of our command line process
    connection.end();

}
