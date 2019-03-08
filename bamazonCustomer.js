var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MyMySQL93!@'
});

connection.connect(err => {
    if(err) throw err;
    console.log("Connected to MySQL database.");

    connection.query("SELECT `item_id`, `product_name`, `price` FROM `bamazon`.`products`;", (err, res) => {
        console.table(res);
        inquirer.prompt([
            {
                name: 'item',
                type: 'input',
                message: 'Please enter the ID of the item you wish to buy'
            },
            {
                name: 'amount',
                type: 'input',
                message: 'Please enter the amount you wish to buy'
            }
        ]).then(response => {
            connection.query(`SELECT \`stock_quantity\`, \`price\` FROM \`bamazon\`.\`products\` WHERE \`item_id\` = ${response.item}`, (err, res) => {
                if(parseInt(response.amount) > res[0].stock_quantity) return console.log("ERROR: Not enough product in stock. Please try again later.");
            
                connection.query(`UPDATE \`bamazon\`.\`products\` SET \`stock_quantity\` = ${res[0].stock_quantity -= parseInt(response.amount)} WHERE \`item_id\` = ${response.item}`, (err) => {
                    if(err) throw err;
                })
                console.log(`Purchase complete! The total cost was ${res[0].price * parseInt(response.amount)}`);
            });
        })
    })
})