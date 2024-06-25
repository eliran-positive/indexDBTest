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
            // Add to temp1
            await db.temp1.add({ syncStatus: 1 });
            console.log('Record added to temp1');

            // Simulate delay without blocking the transaction
            await new Promise(resolve => {
                setTimeout(() => {
                    console.log('10 seconds passed');
                    resolve();
                }, 10000);
            });

            // Add to temp2
            await db.temp2.add({ syncStatus: 1 });
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
        await db.transaction('rw', db.temp1, db.temp2, async () => {
            // Add to temp1
            await db.temp1.add({ syncStatus: 1 });
            console.log('Record added to temp1');

            // Simulate delay without blocking the transaction
            await new Promise(resolve => {
                setTimeout(() => {
                    console.log('10 seconds passed');
                    resolve();
                }, 10000);
            });

            // Add to temp2
            await db.temp2.add({ syncStatus: 1 });
            console.log('Record added to temp2');

            console.log('Throwing an exception after delay');
            throw new Error('Intentional error after delay');
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
