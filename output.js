const Record = require('./record.js').Record;
const fs = require('fs');

exports.writeFile = function(filename, recordArray){
    let path = "./output/" + filename
    let data = JSON.stringify(recordArray);

    fs.writeFileSync(path, data);
}