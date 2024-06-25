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
document.getElementById('clearTablesButton').addEventListener('click', clearTables);

// Function to add records to both tables
async function addRecords() {
    console.log('Button clicked');
    try {
        await db.transaction('rw', db.temp1, db.temp2, async () => {
            const promises = [];

            promises.push(db.temp1.add({ syncStatus: 1 }).then(() => {
                console.log('Record added to temp1');
            }));

            promises.push(sleep(10000));

            promises.push(db.temp2.add({ syncStatus: 1 }).then(() => {
                console.log('Record added to temp2');
            }));

            await Promise.all(promises);
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
            const promises = [];

            promises.push(db.temp1.add({ syncStatus: 1 }).then(() => {
                console.log('Record added to temp1');
            }));

            promises.push(sleep(10000));

            promises.push(db.temp2.add({ syncStatus: 1 }).then(() => {
                console.log('Record added to temp2');
                console.log('Throwing an exception after delay');
                throw new Error('Intentional error after delay');
            }));

            await Promise.all(promises);
        });
    } catch (error) {
        console.error('Transaction error:', error);
    }
}

// Function to clear all data in both tables
async function clearTables() {
    console.log('Clear Tables button clicked');
    try {
        await db.transaction('rw', db.temp1, db.temp2, async () => {
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
