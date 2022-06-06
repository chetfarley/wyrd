// END STATE GOALS
// Separate functions/imports for each call which returns needed data from a given table.
// The data should be accessible in an easy to understand way such as dot notation (table.field.value)
// enabling you to loop through a fieldset and output the results as a list or in a table.
// 
// | Table Name              | Fields | Table ID          | 
// |-------------------------|--------|-------------------|
// | Dice Steps              | Dice   | tblmhQjSxPrJzhZWR |
// | Backgrounds             | all    | tblLQYLqGBSooallZ |
// | Traits                  | all    | tbl8yEjmIHuv2QgPi |
// | Live_Starting_Equipment | all    | tblY8k7wldvvxdwVT |

// API URL Method
// -----------------------------------------------------------------------
const api_key = 'keymozIRq1SpsUPa6'; // read only api key from Airtable
// Helper Function to fetch records and cell values via Airtable API
// and make the field values accessible with dot notation.

async function getRecordsAsList(table, view, key) {
    let url = `https://api.airtable.com/v0/appIn0GQksTbRvLRb/${table}?api_key=${key}&view=${view}`;
    // Fetches data and encodes as JSON
    async function getData(url) {
        const response = await fetch(url);
        return response.json();
    }
    // Sets data into a variable `data`
    const data = await getData(url);
    return { data };
}

(async function() {
    let 
        dice,
        backgrounds,
        appearance,
        detail,
        clothing,
        vice,
        virtue,
        mannerism,
        armor,
        weapons

    // Dice Steps
    // ---------------------------------------------------------------------------------------------------
    dice = await getRecordsAsList('Dice Steps', 'Grid view', api_key);
    // Log Items to Console
    console.log('Dice Steps', '\n', '--------------------------------------')
    for (let i=0; i<dice.data.records.length; i++) {
        console.log(dice.data.records[i].fields.Dice)
    }

    // Backgrounds
    // ---------------------------------------------------------------------------------------------------
    backgrounds = await getRecordsAsList('Backgrounds', 'Grid view', api_key);
    // Log Items to Console
    console.log('Backgrounds', '\n', '--------------------------------------')
    for (let i=0; i<backgrounds.data.records.length; i++) {
        console.log(backgrounds.data.records[i].fields.Background)
    }

    // Traits
    // ---------------------------------------------------------------------------------------------------

    // Armor & Clothing
    // ---------------------------------------------------------------------------------------------------
    armor = await getRecordsAsList('Live_Starting_Equipment', 'Armor', api_key);
    // Log Items to Console
    console.log('Armor & Clothing', '\n', '--------------------------------------')
    for (let i=0; i<armor.data.records.length; i++) {
        console.log(armor.data.records[i].fields.Item)
    }

    // Weapons
    // ---------------------------------------------------------------------------------------------------
    weapons = await getRecordsAsList('Live_Starting_Equipment', 'Weapons', api_key);
    // Log Items to Console
    console.log('Weapons', '\n', '--------------------------------------')
    for (let i=0; i<weapons.data.records.length; i++) {
        console.log(weapons.data.records[i].fields.Item)
    }
    
})();

/*
let api_key = 'keymozIRq1SpsUPa6'; // read only key
// Update Vars to pull specific table data
let table = 'Live_Starting_Equipment' // url-encoded table name
let view = 'Weapons'; // Airtable View
let url = `https://api.airtable.com/v0/appIn0GQksTbRvLRb/${table}?api_key=${api_key}&view=${view}`;

async function getData(url) {
    const response = await fetch(url);
    return response.json();
}
// Sets data into a variable `data`
(async function() {
    const data = await getData(url);
    console.log({ data });
})();
*/