<!-- Put the name of the project after the # -->
<!-- the # means h1  -->
# YORSTORE!

<!-- Put a description of what the project is -->


This fun project is my second project in the beautiful land of node.js, the powerful package that enables us to run javascript outside of browsers. The app is called "YORSTORE" and serves both ends of a ratil store ; "the costumer" and the "store managers", providing different features to meet their specific needs. 

## Where to start?

YORSTORE is a command line interface application. That means in order to run it both terminal and node.js are necessary.
Assuming both of these are installed on the machine;
- the first step toward using the application is to clone down the application from github, opening terminal and going to that directory, and install the list of dependencies (that are previously made in the json package) by typing the following comamand in terminal:

npm install 

this command will look into the json package (that is located in working directory) and automatically installs all the dependecies.
- Now YORSTORE is ready to use; to do so simply type the following command in your terminal

node YOURSTORE.js

- Sit tight and enjoy the ride; YOURSTORE guids you through the rest of journey by popping questions back and forth.

## What happens in the customer journey:

On the costumer side; YORSTORE provides the following features:

- Updated list of invetories at real time
- The chance of requesting certain amounts for shopping
- Validating the purchace request
- Updating the inventory after each purchace and providing the details to the customer
- Option to quit the shopping experience at any time!

## More details from the backend:

The customer side interface provide a table with the most recent data trakced in real time. the table has the following colomns:
* ID 
    * which is unique to any product name and in case , for whatever reason, there are two different stack labeled under the same name each of them still have a different unique id.
* Product Name
* Department Name
* Unit Price
* In Stock Quantity
* Product Sales
    * Which is an indicator of how much of revenue has been made so far from that sepecific item; the revenue is  the number of sold units * the unit price

The table would be provided for the customer review, followed by this question:

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) `what is the ID of the item you would like to purchase [Quit with Q]`

- typing q/Q (The validation setting in the code is so that input is case insensititve) will prints the following on the console, ending the purchace experience:

- ![#c5f015](https://placehold.it/15/c5f015/000000?text=+) ` How many would you like? [Quit with Q]`





![costumer](costumer.gif)






The application has capability of searching songs through spotify API, movies through OMDB API, and concerts through Bandsintown API. There are couple of modules that are required for the app to function properly. All of these dependecies are listed at the begining of the code using the keyword 'require' and  would need to be installed if are not provided under the name "node_modules"

To ask Liri for a specific task, user would need to provide the right command in the terminal. 

For instance, proper command for searching a song named "nothing else matters" would be:
"node Liri.js spotify-this-song nothing else matters"

proper command for searching a movie named "mean girls" would be:
"node Liri.js movie-this mean girls"

proper command for searching a concert from "katy perry" would be:
"node Liri.js concert-this katy perry"

Also, there is another command as "node Liri.js do-as-it-says " that goes through the text file "random.txt" and takes its content as "action" and "search item".

Liri would take the search name and will send the search name to the appropriate searchh channel, depending on the requested action. If the provided name includes more than one word, the code concatenates them into a api-searchable  format.

There are defaults provided for "spotify-this-song" and "movie-this" in case that only the action is provided and not the search name.

Finally it will get back to the user by providing the results search the console.

Also, in this project I used "inquirer" to interact with user through promp method. This package is used to provide user a list of acceptable actions in cases that no right input is provided.

I also used fs package (file system) to read text file (random.txt when the action "do-what-it-says" is asked by user).
I also created a text file named log.txt that will be updated through fs.append method. This text file will keep a record of any command that is typed to the console.log.

Other packages that are used in this project include "moment.js" to print out the concert date to a specific format, "request" to grab data from the OMDB API and the Bands In Town API , "dotEnv" to load environment variables from a .env file into process.env, and " Node Spotify API " which is a simple to use API library for the Spotify REST API. 

# Link to deployed site
<!-- make a link to the deployed site --> 
<!-- [What the user will see](the link to the deployed site) -->


This program is not deployed and is run on the console.


# Images
<!-- take a picture of the image and add it into the readme  -->
<!-- ![image title](path or link to image) -->
![bot](bot.jpg)



# technology used
<!-- make a list of technology used -->
<!-- what you used for this web app, like html css -->

<!-- 
1. First ordered list item
2. Another item
⋅⋅* Unordered sub-list. 
1. Actual numbers don't matter, just that it's a number
⋅⋅1. Ordered sub-list
4. And another item. 
-->
- javascript
- node.js
- API calls
- promise functions
- call backs
- error handling
- moment.js
- node dotEnv
- node request
- Node Spotify API
- fs (file system)
- inquirer (.prompt)
- npm
- node modulus



# code snippets
<!-- put snippets of code inside ``` ``` so it will look like code -->
<!-- if you want to put blockquotes use a > -->

This block of the code shows the process of collecting inputs from the user and providing appropriate logic channels based on the validation analysis of those input as the following:

1) If neither action nor the search item is provided by the user, Liri will provide the list of actions to the user and also asks to enter a search item later on.
2) If the action is provided, Liri checks to see if it is among the acceptable ones; if so and if the asked request is  "concert this" Liri asks user to enter a search item. If action is either "spotify-this-song" or "movie-this" it will provide a default for the searchName. Then, it calls for the appropriate searching action.
3)If both action and search item are provided and action is in the acceptable list, then Liri calls for the appropriate channel of search.

```

function getInput (){
    
    var data =  process.argv;
    for(var i = 2 ; i < data.length ; i++) {
        newLog = newLog + " " + data[i];
    } 
    updateLog(newLog);

    if (data.length === 2 ){
        askForAction();
    } 
    else if (data.length === 3){
        action = data[2];
        if (validate (action)){
            console.log("you didn't enter a search item for the action, default would be used if applicable");

            if (action === "spotify-this-song"){
                searchName = "The+Sign";
            }
            if (action === "movie-this"){
                searchName = "Mr.+Nobody";
            }  
        } else {
            console.log ("seems that the action you asked is not among our list of acceptable actions");
            askForAction();
        }    
    } else {
        action = data[2];
        searchName = data[3];
        for(var i = 4; i < data.length ; i++){
            searchName = searchName + " " + data[i];
        }
        console.log("searchName  is     " , searchName);
    }  
    return searchName;
}


```


# Learning points
<!-- Learning points where you would write what you thought was helpful -->
- javascript
- node.js
- API calls
- promise functions
- call backs
- error handling
- moment.js
- node dotEnv
- node request
- Node Spotify API
- working with fs (file system)
- working with inquirer (.prompt)
- npm init -y
- npm install
- node modulus




# Author 
<!-- make a link to the deployed site and have your name as the link -->
Nasibeh Nourbakhshnia
(www.linkedin.com/in/nasibehnourbakhshnia)

# License
