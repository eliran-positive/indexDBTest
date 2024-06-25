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
    document.getElementById('addRecordsWithExceptionButton').addEventListener('click', addRecordsWithException);
};

// Function to add records to both tables
function addRecords() {
    console.log('Button clicked');

    const transaction = db.transaction(['temp1', 'temp2'], 'readwrite');

    transaction.onerror = (event) => {
        console.error('Transaction error:', event.target.errorCode);
    };

    transaction.oncomplete = (event) => {
        console.log('Transaction completed');
    };

    const temp1 = transaction.objectStore('temp1');
    const temp2 = transaction.objectStore('temp2');

    const temp1Request = temp1.add({ syncStatus: 1 });
    temp1Request.onsuccess = () => {
        console.log('Record added to temp1');
    };
    temp1Request.onerror = (event) => {
        console.error('Error adding record to temp1:', event.target.errorCode);
    };

    // Delay of 10 seconds before adding to temp2
    setTimeout(() => {
        const transaction2 = db.transaction(['temp2'], 'readwrite');
        transaction2.onerror = (event) => {
            console.error('Transaction error:', event.target.errorCode);
        };
        transaction2.oncomplete = (event) => {
            console.log('Second transaction completed');
        };
        const temp2 = transaction2.objectStore('temp2');
        const temp2Request = temp2.add({ syncStatus: 1 });
        temp2Request.onsuccess = () => {
            console.log('Record added to temp2');
        };
        temp2Request.onerror = (event) => {
            console.error('Error adding record to temp2:', event.target.errorCode);
        };
    }, 10000);
}

// Function to add records to both tables and throw an exception
function addRecordsWithException() {
    console.log('Button clicked');

    const transaction = db.transaction(['temp1', 'temp2'], 'readwrite');

    transaction.onerror = (event) => {
        console.error('Transaction error:', event.target.errorCode);
    };

    transaction.oncomplete = (event) => {
        console.log('Transaction completed');
    };

    const temp1 = transaction.objectStore('temp1');
    const temp2 = transaction.objectStore('temp2');

    const temp1Request = temp1.add({ syncStatus: 1 });
    temp1Request.onsuccess = () => {
        console.log('Record added to temp1');
    };
    temp1Request.onerror = (event) => {
        console.error('Error adding record to temp1:', event.target.errorCode);
    };

    // Delay of 10 seconds before adding to temp2 and then throw an exception
    setTimeout(() => {
        const transaction2 = db.transaction(['temp2'], 'readwrite');
        transaction2.onerror = (event) => {
            console.error('Transaction error:', event.target.errorCode);
        };
        transaction2.oncomplete = (event) => {
            console.log('Second transaction completed');
        };
        const temp2 = transaction2.objectStore('temp2');
        const temp2Request = temp2.add({ syncStatus: 1 });
        temp2Request.onsuccess = () => {
            console.log('Record added to temp2');
            console.log('Throwing an exception after delay');
            throw new Error('Intentional error after delay');
        };
        temp2Request.onerror = (event) => {
            console.error('Error adding record to temp2:', event.target.errorCode);
        };
    }, 10000);
}
