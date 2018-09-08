var mysql = require ("mysql");
var inquirer = require ("inquirer");
var Table = require('cli-table');
var chalk = require('chalk');

var queryStr;
var lowLimit = 300;
var message; 

var Manager = function (){
    this.connection = mysql.createConnection({
        host : "localhost",
        port : "3306",
    
        user : "root",
    
        password : "password",
        database : "bamazon"
    });
};



Manager.prototype.manage = function(){
    this.connection.connect((err)=>{
        if (err) throw err;
        this.initialize();
    });
};



Manager.prototype.initialize = function(){
    queryStr = "SELECT item_id, product_name , product_sales, department_name , price , stock_quantity FROM products";
    message = "Thanks for vising our page!";
    this.review(queryStr , message);
};

// this function displays the most updated inventory on the console.
Manager.prototype.review  = function (str , txt){

    var table = new Table({
        head: ['ID', 'NAME', 'SALES' , 'DEPARTMENT', 'PRICE', 'IN STOCK']
      , colWidths: [5, 30, 10, 30, 10, 10],
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' ,             'top-right': '╗', 'bottom': '═' , 'bottom-mid': '╧' ,             'bottom-left': '╚' , 'bottom-right': '╝', 'left': '║' ,           'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
    });
    this.connection.query(str, (err, data)=>{
        if (err) throw err;
        for (var i=0 ; i < data.length ; i++){
            table.push(
                [data[i].item_id , data[i].product_name, data[i].product_sales , data[i].department_name, data[i].price,  data[i].stock_quantity]
            );
        }
        console.log("\n");
        console.log(chalk.blue.bold(table.toString()));
        this.summary(txt);
        this.restart();
    });
};

Manager.prototype.manageProducts = function() {
    
    inquirer.prompt([
        {
            type: "list",
            name: "userOptions",
            message: "What would you like to do",
            choices: ["View Products for Sale", "View Low Inventory" ,"Add to Inventory", "Add New Product", "Quit"]
        }
    ]).then((answer)=>{
        switch (answer.userOptions) {
            //VIEW
            case "View Products for Sale":    
                this.review(queryStr , "You Viewed Products for Sale\nPress Yes if wish to do more");
                break;
            
            //VIEW
            case "View Low Inventory":
                this.viewLowInvetory();    
                break;
            
            //Update
            case "Add to Inventory":
                this.getItem();
                break;

            //add 
            case "Add New Product":
                this.getDepartments();
                break;   
        
            //QUIT    
            case "Quit":
                this.exit();
                break;

        }
    });
};

Manager.prototype.viewLowInvetory = function (){
    inquirer.prompt([
        {
            type : "input",
            message : "want to see the inventory less than ... (enter the value) ",
            name : "userInputLimit"
        }
    ]).then((response)=>{
        lowLimit = response.userInputLimit;
        message = "You Rreviewed Inventory(s) lower than "+ lowLimit+ "\n'Add to Inventory' if there are items that you are running out of";
        this.review(queryStr + " WHERE products.stock_quantity < " + lowLimit , message);
    });
};

Manager.prototype.addToInventory = function (list,quants,pName,pDepart){
    var itemList = list;
    inquirer.prompt([{
        type: "input",
        name: "itemId",
        message: "\nWhat is the id of the inventory you would like to add to?\n",
    },{
        type : "input",
        name: "newInv",
        message: "\nHow many would you like to add to this inventory?\n",

    }
    ]).then((response)=>{
        var quantsNow = quants[itemList.indexOf(parseInt(response.itemId))];
        var quantsNew = quantsNow + parseInt(response.newInv);
        var prdctName = pName[itemList.indexOf(parseInt(response.itemId))];
        var prdctDep  = pDepart[itemList.indexOf(parseInt(response.itemId))];
        var queryString = "UPDATE products SET ? WHERE ?";
        this.connection.query(queryString,[
            {   
                stock_quantity : quantsNew
                
            },
            {
                item_id : parseInt(response.itemId)
            }
        ], 
            (err, res)=> {
            console.log(chalk.cyan('**********************************************************\n')+
                      chalk.bgCyan("   Here is an updated list of the following inventory:    \n")+ 
                        chalk.cyan('**********************************************************'));
            message = "You added  '" + response.newInv + "' units to the following item\n" + 
            "Id                :    " + response.itemId + "\n"+
            "Name              :    " + prdctName + "\n" +
            "Department        :    " + prdctDep + "\n" +
            "Previous quantity :    " + quantsNow + "\n" +
            "Current  quantity :    " + quantsNew + "\n" ; 
            this.review(queryStr , message) ; 
        }
    );
    });
    
};

Manager.prototype.addNew = function (list){
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
    }]).then((answers)=>{
        var department = answers.depName;
        if(department === "other"){
            inquirer.prompt([
                {
                    type : "input",
                    name : "newDep",
                    message: "what is this 'OTHER' department?"
                }]).then((OtherRes)=>{
                    
                    if(currentDepList.includes((OtherRes.newDep).toLowerCase())){
                        console.log(chalk.yellow('***************************************************************\n')+
                                 chalk.bgYellow("                This Department already exists!                \n")+
                                 chalk.bgYellow("             Item will be added to the existing one            \n")+ 
                                    chalk.yellow('***************************************************************'));
                    } 
                    department = (OtherRes.newDep).toLowerCase();
                    
                    var queryString = "INSERT INTO products SET ?";
                    this.connection.query(queryString, {
                        product_name   : answers.productName,
                        department_name: department,
                        price          : parseFloat(answers.cost).toFixed(2), 
                        stock_quantity : parseInt(answers.quantity),
                        product_sales   : 0
                    });
                    
                    message = "You added a new product to department " + department +  "\n";
                    message += "Product Name     : "+ answers.productName + "\n";
                    message += "Quantities added : "+ parseInt(answers.quantity) + "\n";
                    message += "Selling Price    : "+ parseFloat(answers.cost).toFixed(2), + "\n";

                    this.review(queryStr , message);
                    });
        } else {
            var queryString = "INSERT INTO products SET ?";
            this.connection.query(queryString, {
                product_name   : answers.productName,
                department_name: department,
                price          : parseFloat(answers.cost).toFixed(4), 
                stock_quantity : parseInt(answers.quantity),
                product_sales   : 0
            });
            
            message = "You added a new product to department " + department +  "\n";
            message += "Product Name     : "+ answers.productName + "\n";
            message += "Quantities added : "+ parseInt(answers.quantity) + "\n";
            message += "Selling Price    : "+ parseFloat(answers.cost).toFixed(2), + "\n";

            this.review(queryStr , message);
        }    
    });
};

Manager.prototype.getDepartments = function (crud){
    var depList = [];

    this.connection.query("SELECT DISTINCT department_name from products", (err, data)=>{
        for (var i = 0 ; i < data.length ; i++){
            depList.push(data[i].department_name);
        }

        this.addNew(depList);
    });
};

Manager.prototype.getItem = function(){
    var itemList = [];
    var quant =[];
    var name =[];
    var depart = [];
    this.connection.query("SELECT  * from products", (err, data)=>{
        for (var i = 0 ; i < data.length ; i++){
            
            itemList.push(data[i].item_id);
            name.push(data[i].product_name);
            depart.push(data[i].department_name);
            quant.push(data[i].stock_quantity);
        }
        this.addToInventory(itemList, quant,name,depart);
    });
};


Manager.prototype.restart = function() {
    inquirer.prompt([{
        type: "list",
        name: "continue",
        choices: ["Yes", "No"],
        message: "Would you like to do more?\n"
    }]).then((answers)=> {
        //If we want to manage more Products, we'll rerun our initial prompt
        if (answers.continue === "Yes") {
            this.manageProducts();
            //Otherwise, we'll terminate the process
        } else {
           this.exit();
        }

    });
};

// this function ends the connection to database
Manager.prototype.exit = function(){
    console.log(chalk.green('***************************************************************\n')+
              chalk.bgGreen("        Thanks for using this code to manage Your Store!       \n")+
              chalk.bgGreen("                      Goodbye for now!                         \n")+ 
                chalk.green('***************************************************************'));

    //This will exit out of our command line process
    this.connection.end();
};

Manager.prototype.summary= function(st){
    if (st !== null){
        var table2 = new Table({
            head: ['SUMMARY']
          , colWidths: [100],
          chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' ,             'top-right': '╗', 'bottom': '═' , 'bottom-mid': '╧' ,             'bottom-left': '╚' , 'bottom-right': '╝', 'left': '║' ,           'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
             , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
        });
        table2.push([st]);
        console.log("\n");
        console.log(chalk.green(table2.toString()));
    }
    
};

module.exports = Manager;