exports.Person = class Person{
    constructor(recordArray, name){
        this.name = name;
        this.balance = 0;
        this.received = new Array();
        this.sent = new Array();

        for(var i = 0; i < recordArray.length; i++){
            var record = recordArray[i];

            if(record.From === this.name){
                this.balance = this.balance - parseFloat(record.Amount);
                this.sent.push(record);
            }
            else if(record.To === this.name){
                this.balance = this.balance + parseFloat(record.Amount);
                this.received.push(record);
            }
        }
    }

    displayBalance(){
        console.log("Balance for " + this.name + ": " + (this.balance).toFixed(1))
    }

    displayTransactions(){
        console.log("---RECEIVED---");

        for(var i = 0; i < this.received.length; i++){
            console.log(this.received[i].toString());
        }

        console.log("-----SENT-----");

        for(var i = 0; i < this.sent.length; i++){
            console.log(this.sent[i].toString());
        }
    }
}

exports.createPeopleObject = function(recordArray){
    // dictionary maps names to instances of Person class
    var people = new Object();

    for(var i = 0; i < recordArray.length; i++){
        var record = recordArray[i];
        var from_name = record.From;
        var to_name = record.To;

        if(people.hasOwnProperty(from_name) == false){
            people[from_name] = new exports.Person(recordArray, from_name);
        }

        if(people.hasOwnProperty(to_name) == false){
            people[to_name] = new exports.Person(recordArray, to_name);
        }
    }

    return people;
}