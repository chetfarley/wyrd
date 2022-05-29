console.log('hello world poop hi hi ')

// airtable configs
import Airtable from 'airtable';
var base = new Airtable({apiKey: 'keymozIRq1SpsUPa6'}).base('appIn0GQksTbRvLRb');

// List Dice Steps Records
const table = base('Dice Steps');

const getRecords = async () => {
    const records = await table.select({
        // Only data for fields whose names are in this list will be included in the result.
        fields: ['Dice', 'Dice Quality']
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            console.log('retrieved', record.get('Dice'))
            
            // Print Records into a list
            let diceStep = record.get('Dice');
            const ul = document.getElementById('dice-list');
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(diceStep));
            ul.appendChild(li);
        })
    });
}

getRecords();