// Initialize Dexie.js
const db = new Dexie("testDB");
db.version(1).stores({
    temp1: "++id,syncStatus",
    temp2: "++id,syncStatus"
});

db.on('ready', async () => {
    console.log('Database initialized');
    // Start the Web Worker
    const worker = new Worker('worker.js');
    worker.postMessage({ type: 'start', dbName: 'testDB' });
});

document.getElementById('addRecordsButton').addEventListener('click', addRecords);
document.getElementById('addRecordsDexieWaitForButton').addEventListener('click', addRecordsDexieWaitFor);
document.getElementById('addRecordsWithExceptionButton').addEventListener('click', addRecordsWithException);
document.getElementById('clearTablesButton').addEventListener('click', clearTables);

// Function to add records to both tables using Dexie's waitFor method
async function addRecordsDexieWaitFor() {
    console.log('Button clicked');
    try {
        await db.transaction('rw', ['temp1', 'temp2'], { durability: 'strict' }, async () => {
            // Add to temp1
            await db.temp1.put({ syncStatus: 1 });
            console.log('Record added to temp1');

            // Wait for 10 seconds
            await Dexie.waitFor(sleep(10000));
            console.log('10 seconds passed');

            // Add to temp2
            await db.temp2.put({ syncStatus: 1 });
            console.log('Record added to temp2');
        });

        console.log('Transaction completed successfully');
    } catch (error) {
        console.error('Transaction error:', error);
    }
}

// Function to add records to both tables
async function addRecords() {
    console.log('Button addRecords clicked');
    try {
        await db.transaction('rw', ['temp1', 'temp2'], { durability: 'strict' }, async () => {
            // Add to temp1
            await db.temp1.put({ syncStatus: 1 });
            console.log('Record added to temp1');

            // Wait for 10 seconds
            await sleep(10000);
            console.log('10 seconds passed');

            // Add to temp2
            await db.temp2.put({ syncStatus: 1 });
            console.log('Record added to temp2');
        });

        console.log('Transaction completed successfully');
    } catch (error) {
        console.error('Transaction error:', error);
    }
}

// Function to add records to both tables and throw an exception
async function addRecordsWithException() {
    console.log('Button clicked');
    try {
        await db.transaction('rw', ['temp1', 'temp2'], { durability: 'strict' }, async () => {
            // Add to temp1
            await db.temp1.add({ syncStatus: 1 });
            console.log('Record added to temp1');

            // Wait for 5 seconds
            await Dexie.waitFor(sleep(5000));
            console.log('5 seconds passed');

            console.log('Throwing an exception after delay');
            throw new Error('Intentional error after delay');

            // This part will not be executed due to the exception
            await Dexie.waitFor(sleep(5000));
            console.log('5 seconds passed');
            
            await db.temp2.add({ syncStatus: 1 });
            console.log('Record added to temp2');
        });
    } catch (error) {
        console.error('Transaction error:', error);
    }
}

// Function to clear all data in both tables
async function clearTables() {
    console.log('Clear Tables button clicked');
    try {
        await db.transaction('rw', ['temp1', 'temp2'], { durability: 'strict' }, async () => {
            await db.temp1.clear();
            console.log('temp1 cleared');
            await db.temp2.clear();
            console.log('temp2 cleared');
        });
        console.log('Tables cleared');
    } catch (error) {
        console.error('Error clearing tables:', error);
    }
}

// Helper function to create a delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
