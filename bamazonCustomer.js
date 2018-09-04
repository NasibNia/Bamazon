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
        
        validate(response.userItem , manageProduct , takeOrder);
        // console.log("checkId before" +checkId);

        // idAvailable(parseInt(response.userItem));
        // console.log("checkId after" +checkId);
        // if the input is either q or Q   
        // if ((response.userItem).toLowerCase() === "q"){
        //     exit();
        // } //check if the id is a number 
        // else if (!isNaN(response.userItem)){
        //     // console.log(" the ID you entered is  a number");

        //     //check if the number user entered exists in the list of item ids
            
        //     console.log(idAvailable(parseInt(response.userItem)));
        //     if (!idAvailable(parseInt(response.userItem), getIds)) {
        //         console.log("the id you entered is not available please try again");
        //         manageProduct();
        //     } // if id is a valide number; here is where all the action happens: 
        //     else {
        //         console.log("good, the id "+ response.userItem+" is valid");
        //         // takeOrder(parseInt(response.userItem));
        //     }

        // } // if the input is any other than Q or a number  
        // else {
        //     console.log(" this input is not acceptable");
        //     manageProduct();

        // } 

    });
} 

function validate(input, callback1 , callback2){
    // if the input is either q or Q   
    if ((input).toLowerCase() === "q"){
        exit();
    }//check if the id is a number 
    else if (!isNaN(input)){
        console.log(" the ID you entered is  a number");

        //check if the number user entered exists in the list of item ids  
            // var checkId = false;
            connection.query("SELECT item_id FROM products", function(err, data){
                if (err) throw err;
                var ids = [];
                for(var i = 0; i < data.length ; i++){
                    ids.push(parseInt(data[i].item_id));
                }
                // console.log(ids);
                // console.log(id);
                if(ids.includes(parseInt(input))) {
                    console.log("inside true");
                    // checkId = true;
                    callback2();        
                } else{
                    console.log("inside false");
                    // checkId = false;
                    callback1();
                } 
            });
            
        // } // if id is a valide number; here is where all the action happens: 
        // else {
        //     callback2(input);
        //     console.log("yayyyyy, inside callback2");
        // }

    } // if the input is any other than Q or a number  
    else {
        console.log(" this input is not acceptable");
        callback1();

    } 
}

// function idAvailable(id, callback){
//     var ids = callback();
//     if(ids.includes(id)) {
//         console.log("inside true");
//         return true;
//     } 
//     return false;
// } 

// function getIds(){
//     var arr = [];
//     connection.query("SELECT item_id FROM products", function(err, data){
//         if (err) throw err;
//         for(var i = 0; i < data.length ; i++){
//             arr.push(parseInt(data[i].item_id));
//         }
        
//     });
//     return arr;
// }


// function idAvailable(id){
//     var checkId = false;
//     connection.query("SELECT item_id FROM products", function(err, data){
//         if (err) throw err;
//         var ids = [];
//         for(var i = 0; i < data.length ; i++){
//             ids.push(parseInt(data[i].item_id));
//         }
//         // console.log(ids);
//         // console.log(id);
//         if(ids.includes(id)) {
//             console.log("inside true");
//             checkId = true;
  
//         } else{
//             console.log("inside false");
//             checkId = false;

//         } 

//     });
// }

function takeOrder (id){
    inquirer.prompt([
        {
            type: "input",
            message:"How many would you like? [Quit with Q]",
            name : "quantity"
        }
    ]).then(function(response){
        validate(response.quantity , takeOrder ,takeOrder);
    });
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