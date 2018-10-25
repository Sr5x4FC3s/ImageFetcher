const readline          = require('readline');
const childProcess      = require('child_process');
const fs                = require('fs');
const execSync          = childProcess.execSync;
const photosFolder      = './photos';
const util              = require('./utility/helper.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Would you like images resized? (Y/N) : ', (answer) => {
  let yes = false;
  if (answer.toLowerCase() === 'y') {
    yes = true;
    rl.question('What dimensions are the images being resized to? (length x width) --> (3.5" x 2.5" => 366 x 240) : ', (answer) => {
      let dimensions = answer.split('x');
      let height = parseInt(dimensions[0]);
      let width = parseInt(dimensions[1]);
      let fileArray = [];

      //get all the names of the files located in the photos folder and add them to the fileArray
      fs.readdirSync(photosFolder).forEach(file => {
        fileArray.push(file);
      });
      util.resize_photos(fileArray, height, width);
      rl.close();
    });
  } else if (answer.toLowerCase() === 'n') {
    rl.close();
  }
});