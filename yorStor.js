var Customer = require ("./bamazonCustomer.js");
var Manager = require ("./bamazonManager.js");
var inquirer = require ("inquirer");
//Bringing in the chalk and cFonts to change the color in terminal
var chalk = require('chalk'); 
var CFonts = require('cfonts');

//display the game header 
cFontDisplay('YORSTOR','block');
cFontDisplay("======================", 'chrome');
cFontDisplay("Painless Shopping",'3d');
cFontDisplay("======================", 'chrome');

// function to show str in fun formats provided by CFont.
function cFontDisplay (str , format){
    CFonts.say(str, {
        font: format,              // define the font face
        align: 'center',              // define text alignment
        colors: ['blue','cyan','magenta'],         // define all colors
        background: 'transparent',  // define the background color, you can also use        `backgroundColor` here as key
        letterSpacing: 0,           // define letter spacing
        lineHeight: 0,              // define the line height
        space: false,                // define if the output text should have empty lines on top and on the bottom
        maxLength: '0',             // define how many character can be on one line
    });
}



function start(){
    var customer = new Customer();
    var manager  = new Manager();
    inquirer.prompt([
        {
            type : "list",
            message : "Welcome to your store; Please Select one to continue",
            choices : [ "I am a customer!", "I am a Manager in this store!"],
            name : "character"

        }
        ]).then(function(response){
            switch (response.character){
                case "I am a Manager in this store!":
                    manager.manage();
                    break;
                case "I am a customer!":
                    customer.shop();
                    break;
            }
    });

}
start();


