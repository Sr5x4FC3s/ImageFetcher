const readline          = require('readline');
const axios             = require('axios');
const childProcess      = require('child_process');
const utility           = require('./utility/helper.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter cards you want searched; enter the exact name as it appears on the card for best results. Separate entries with a colon. ie: ":"...', async (answer) => {
  let searchValues = answer;
  let connection = utility.startServer();
  
  //force time out to wait for server init
  setTimeout(() => {utility.server_request(searchValues)}, 500);

  rl.close();
});
