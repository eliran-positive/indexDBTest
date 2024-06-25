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
document.getElementById('addRecordsWithExceptionButton').addEventListener('click', addRecordsWithException);

// Function to add records to both tables
async function addRecords() {
    console.log('Button clicked');
    try {
        await db.transaction('rw', db.temp1, db.temp2, async () => {
            await db.temp1.add({ syncStatus: 1 });
            console.log('Record added to temp1');

            // Delay of 10 seconds before adding to temp2
            await sleep(10000);

            await db.temp2.add({ syncStatus: 1 });
            console.log('Record added to temp2');
        });
        console.log('Transaction completed');
    } catch (error) {
        console.error('Transaction error:', error);
    }
}

// Function to add records to both tables and throw an exception
async function addRecordsWithException() {
    console.log('Button clicked');
    try {
        await db.transaction('rw', db.temp1, db.temp2, async () => {
            await db.temp1.add({ syncStatus: 1 });
            console.log('Record added to temp1');

            // Delay of 10 seconds before adding to temp2 and then throw an exception
            await sleep(10000);

            await db.temp2.add({ syncStatus: 1 });
            console.log('Record added to temp2');
            console.log('Throwing an exception after delay');
            throw new Error('Intentional error after delay');
        });
    } catch (error) {
        console.error('Transaction error:', error);
    }
}

// Helper function to create a delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
