exports.getInput = function(people){
    //return [Name] or All
    console.log("1) List All")
    console.log("2) List [Account Name]")

    var input = readline.prompt();
    logger.debug('User input: ' + input);
    input = input.split(" ");

    var command = input.shift();
    var name = input.reduce(function(value, accumulator){ return value + " " + accumulator;});

    if(command === "List"){
        if (people.hasOwnProperty(name) || name === "All"){
            return name;
        }
        else{
            logger.debug('Inputted name is not in records');
            console.log("That person is not in our records. Try Again \n");
            return getInput();
        }
    }

    else{
        logger.debug('Unsupported command');
        console.log("Invalid command. Try again \n");
        return getInput();
    }
}

function readCSV(){
    var lines = new Array();
    var recordArray = new Array();
    logger.debug('Trying to read from ' + filename)
    
    lineReader.on('line', function (line) {
        lines.push(line);
    });

    readStream.on('end', () => {
        if(recordArray.length == 0){
            logger.debug('Finished reading in file');
            recordArray = createRecordArrayFromCSV(lines);
            main(recordArray);
        }
    })
}

function readJSON(){

    fs.readFile('./Transactions2013.json', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            logger.error('File read failed', err)
            return;
        }

        try {
            let jsonArray = JSON.parse(jsonString);
            let recordArray = createRecordArrayFromJson(jsonArray);
            main(recordArray);
        } 
        catch(err) {
                console.log('Error parsing JSON string:', err)
                logger.error('Error parsing JSON string:', err)
            }
        });
}