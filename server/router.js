const express = require('express');
const routes = express.Router();
const axios = require('axios');
const util = require('../utility/helper.js');
const fs = require('fs');
const execSync = require('child_process').execSync;

routes.get('/callAPI/:params', async (req, res) => {
  let searchable = util.searchList(req.params.params);
  let searched_data;
  let arrayofPNGImages;
  let count = 0;

  util.api_request(searchable).then(result => {
    searched_data = result;
  }).then(() => {
    let save_path = __dirname + '/../photos/'

    arrayofPNGImages = searched_data.map(card => ({
      'name' : card.name, 'image_url': card.image_uris.png
    }))

    arrayofPNGImages.forEach(async image => {
      let download = await util.download_image(image.image_url, save_path + `${image.name}.png`);
      count ++;
      if (count === arrayofPNGImages.length) {
        res.send(arrayofPNGImages);
        process.kill(process.pid, 'SIGTERM');
      }
    })
  })
})

module.exports = routes;