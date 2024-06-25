self.onmessage = function(event) {
    if (event.data.type === 'start') {
        const dbName = event.data.dbName;

        const request = indexedDB.open(dbName, 1);

        request.onerror = (event) => {
            console.error('Worker database error:', event.target.errorCode);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            console.log('Worker database initialized');

            setInterval(() => {
                const transaction = db.transaction('temp1', 'readonly');
                const objectStore = transaction.objectStore('temp1');
                const index = objectStore.index('syncStatus');

                const request = index.getAll(1);
                request.onsuccess = (event) => {
                    console.log('Records with syncStatus=1:', event.target.result);
                };
            }, 5000);
        };
    }
};
