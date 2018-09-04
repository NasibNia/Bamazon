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



function manageProduct () {
    
    inquirer.prompt([
        {
            type : "input",
            message : "what is the ID of the item you would like to purchase [Quit with Q]",
            name : "userItem"
        }
    ]).then(function(response){ 
        
        validate(response.userItem , "item_id", manageProduct , takeOrder); 

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
        validate(response.quantity , "stock_quantity" , takeOrder ,findProduct(id,parseInt(response.quantity)));

    });
}

function findProduct (id , buyerOrder) {
    var queryString = "SELECT * FROM products WHERE ? ";
    connection.query(queryString,
        {
            item_id : id
        } , function(err, data){
        if (err) throw err;
        
        var onStockNumbers = parseInt(data.stock_quantity);
        
        if (buyerOrder <= onStockNumbers) {
            console.log("congrats, you are about to buy " + buyerOrder + "of item id " + id + "( " + data.product_name + " )\n");
            var updatedNumbers = onStockNumbers - buyerOrder; 
            updateProducts(id , updatedNumbers);
        } else {
            console.log ("sorry we do not have the number you asked in the stock, please enter a valid number");
            takeOrder(id);
        }
    });
}

function updateProducts(item , numbers) {
    var queryString = "UPDATE products SET ? WHERE ?";
    connection.query(queryString,[
        {
             stock_quantity : numbers
        },
        {
            item_id : item
        }] , function(err, data){
        if (err) throw err;
        console.log("great! your purchase completed, Here is an updated list of products:");
        //Let's have a look at our updated table (pulling straight from our database!!!!)
        review() ;
    });

}


function validate(input, category , callback1 , callback2){
    var options = [];
    var variable;
    if(category === "item_id"){
        variable = "item_id";
    } else if (category === "stock_quantity"){
        variable = "stock_quantity";
    }
    
    // if the input is either q or Q   
    if ((input).toLowerCase() === "q"){
        exit();
    }//check if the id is a number 
    else if (!isNaN(input)){
        // console.log(" the ID you entered is  a number");
        //check if the number user entered exists in the list of item options  
            var querySrt = "SELECT " + variable + " FROM products" ;
            connection.query(querySrt , function(err, data){
                if (err) throw err;
                console.log (querySrt);
                // console.log(data);
                for(var i = 0; i < data.length ; i++){
                    options.push(parseInt(data[i][variable]));
                }
                // console.log(options);
                // console.log(input);
                if(category === "item_id"){
                    if(options.includes(parseInt(input))) {
                        console.log("inside true");
                        callback2();        
                    } else{
                        console.log("inside false");                    
                        callback1();
                    } 
                } else {
                    if(parseInt(input) > 0 ) {
                        console.log("this value is more than what we have in stock ");
                        callback2();
                    } else{
                        console.log("great! we have this amount in our stock");
                        callback1();
                    }
                }
                
            });    

    } // if the input is any other than Q or a number  
    else {
        console.log(" this input is not acceptable");
        callback1();

    } 
}





// this function ends the connection to database
function exit (){
    console.log("Thanks for shopping with us, hope to see you back soon. Goodbye for now!");
    //This will exit out of our command line process
    connection.end();

}

// this function either continues to keep the interaction withh the customer or exits depending on customer's wish
function restart (){

    
}