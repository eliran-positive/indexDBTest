// Initialize IndexedDB
let db;
const request = indexedDB.open('testDB', 1);

request.onerror = (event) => {
    console.error('Database error:', event.target.errorCode);
};

request.onupgradeneeded = (event) => {
    db = event.target.result;

    const temp1 = db.createObjectStore('temp1', { keyPath: 'id', autoIncrement: true });
    temp1.createIndex('syncStatus', 'syncStatus', { unique: false });

    const temp2 = db.createObjectStore('temp2', { keyPath: 'id', autoIncrement: true });
    temp2.createIndex('syncStatus', 'syncStatus', { unique: false });
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log('Database initialized');

    // Start the Web Worker
    const worker = new Worker('worker.js');
    worker.postMessage({ type: 'start', dbName: 'testDB' });

    document.getElementById('addRecordsButton').addEventListener('click', addRecords);
};

// Function to add records to both tables
function addRecords() {
    const transaction = db.transaction(['temp1', 'temp2'], 'readwrite');

    transaction.onerror = (event) => {
        console.error('Transaction error:', event.target.errorCode);
    };

    const temp1 = transaction.objectStore('temp1');
    const temp2 = transaction.objectStore('temp2');

    temp1.add({ syncStatus: 1 });

    // Delay of 10 seconds before adding to temp2
    setTimeout(() => {
        temp2.add({ syncStatus: 1 });
    }, 10000);
}
