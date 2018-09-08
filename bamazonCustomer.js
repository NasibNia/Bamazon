var mysql = require ("mysql");
var inquirer = require ("inquirer");
var Table = require('cli-table');
var chalk = require('chalk'); 


var Customer = function(){


    this.connection = mysql.createConnection({
        host : "localhost",
        port : "3306",
    
        user : "root",
    
        password : "password",
        database : "bamazon"
    });
    
};    
    Customer.prototype.shop = function () {
        this.connection.connect((err)=>{
            if (err) throw err;
            this.review();
        });
    };
    
    
    // this function displays the most updated inventory on the console.
     Customer.prototype.review = function (){
        var table = new Table({
            head: ['ID', 'PRODUCT NAME', 'DEPARTMENT NAME', 'UNIT PRICE', 'IN STOCK QUANTITY', 'PRODUCT SALES' ]
          , colWidths: [5, 20, 20, 15, 20, 15],
          chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' ,             'top-right': '╗', 'bottom': '═' , 'bottom-mid': '╧' ,             'bottom-left': '╚' , 'bottom-right': '╝', 'left': '║' ,           'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
             , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
        });
        
        this.connection.query("SELECT * FROM products", (err, data)=>{
            if (err) throw err;
            for (var i=0 ; i < data.length ; i++){
                table.push(
                    [data[i].item_id , data[i].product_name, data[i].department_name, data[i].price,  data[i].stock_quantity, data[i].product_sales]
                );
            }
            console.log("\n");
            console.log(chalk.blue(table.toString()));
    
            this.manageProduct();
        });
    };
    
    
    
    Customer.prototype.manageProduct = function() {
        
        inquirer.prompt([
            {
                type : "input",
                message : "what is the ID of the item you would like to purchase [Quit with Q]",
                name : "userItem"
            }
        ]).then((response)=>{ 
            
            this.validateId(response.userItem); 
    
        });
    }; 
    
    Customer.prototype.takeOrder = function (id){
        inquirer.prompt([
            {
                type: "input",
                message:"How many would you like? [Quit with Q]",
                name : "quantity"
            }
        ]).then((response)=>{
            this.validateQuantity(id , response.quantity);
    
        });
    };
    
    Customer.prototype.updateProducts = function (id , numbers, updatedSales , request, charged) {
        var queryString = "UPDATE products SET ? WHERE ?";
        this.connection.query(queryString,[
            {
                 stock_quantity : numbers,
                 product_sales  : updatedSales
            },
            {
                item_id : id
            }] , (err, data)=>{
            if (err) throw err;
            console.log(chalk.green('**********************************************************\n')+
                      chalk.bgGreen("     Wonderful! Here is the summary of your purchace!     \n")+
                   chalk.green.bold("                Id            :    "+id+"\n")+
                   chalk.green.bold("                Quantities    :    "+request+"\n")+
                   chalk.green.bold("                Transaction   :   $"+charged+"\n")+
                           chalk.bgCyan("        & Here is an updated list of products:            \n")+ 
                        chalk.cyan.bold('**********************************************************'));

            //Let's have a look at our updated table (pulling straight from our database!!!!)
            this.review() ;
        });
    
    };
    
    Customer.prototype.validateId = function(input){
        var options = [];
        // if the input is either q or Q   
        if ((input).toLowerCase() === "q"){
            this.exit();
        }//check if the id is a number 
        else if (Number.isInteger(parseFloat(input))){

            //check if the number user entered exists in the list of item options  
            var querySrt = "SELECT  item_id FROM products" ;
            this.connection.query(querySrt , (err, data) => {
                if (err) throw err;
                
                for(var i = 0; i < data.length ; i++){
                    options.push(parseInt(data[i].item_id));
                }
                if(options.includes(parseInt(input))) {
                    this.takeOrder(parseInt(input));        
                } else{
                    console.log(chalk.cyan.bold('**********************************************************\n')+
                                 chalk.bgYellow("               This value is not allowed                  \n")+
                                 chalk.bgYellow(" It is either negative or bigger than max ID in our table \n")+
                                 chalk.bgYellow("                   Please Try Again                       \n")+ 
                                chalk.cyan.bold('**********************************************************'));
                   
                    this.manageProduct();
                }
            });
        } // if the input is any other than Q or a number  
        else {
            console.log(chalk.cyan.bold('**********************************************************\n')+
                         chalk.bgYellow("      This Input Is Not Acceptable, Please Try Again      \n")+ 
                        chalk.cyan.bold('**********************************************************'));

            this.manageProduct();
    
        }
    };
    
    Customer.prototype.validateQuantity = function (id , input ){
        // if the input is either q or Q   
        if ((input).toLowerCase() === "q"){
            this.exit();
        }//check if the id is a number 
        else if (Number.isInteger(parseFloat(input))){

            var querySrt = "SELECT  * FROM products WHERE ?" ;
            this.connection.query(querySrt , 
                {
                    item_id : id
                }, 
                (err, data)=>{
                    if (err) throw err;

                    var stock = parseInt(data[0].stock_quantity);
                    var request = parseInt(input);

                    if (request < 0 ){
                        console.log(chalk.cyan.bold('**********************************************************\n')+
                                     chalk.bgYellow("               Negative value is not allowed              \n")+
                                     chalk.bgYellow("                   Please Try Again                       \n")+ 
                                    chalk.cyan.bold('**********************************************************'));
                        this.takeOrder(id);
                        
                    } else if (request > stock) {
                        console.log(chalk.cyan.bold('**********************************************************\n')+
                                     chalk.bgYellow("   Hmmmm! This value is more than what we have in stock!\n")+ 
                                     chalk.bgYellow("                     Please Try again!                  \n")+ 
                                    chalk.cyan.bold('**********************************************************'));

                        this.takeOrder(id);
                    } else{
                        console.log(chalk.cyan.bold('**********************************************************\n')+
                                       chalk.bgCyan("   YAYYYY! we have the number you ordered in our stock\n")+ 
                                    chalk.cyan.bold('**********************************************************'));

                        
                        var newQuantity = stock-request;
                        var charged = parseFloat(data[0].price) * request;
                        var newsales  = charged + parseFloat(data[0].product_sales);
                        this.updateProducts(parseInt(id),newQuantity , newsales , request, charged); 
                    } 
            });
        } else{
            console.log(chalk.cyan.bold('**********************************************************\n')+
                         chalk.bgYellow("      This Input Is Not Acceptable, Please Try Again      \n")+ 
                        chalk.cyan.bold('**********************************************************'));

            this.takeOrder(id);

        }
    };
    
    // this function ends the connection to database
    Customer.prototype.exit = function (){
        console.log(chalk.cyan.bold('**********************************************************\n')+
                      chalk.bgGreen("        Thanks for shopping from Your Store!              \n")+  
                      chalk.bgGreen("             Hope to see you back soon.                   \n")+
                      chalk.bgGreen("                   Goodbye for now!                       \n")+ 
                    chalk.cyan.bold('**********************************************************'));

        //This will exit out of our command line process
        this.connection.end();
    
    };



module.exports = Customer;


