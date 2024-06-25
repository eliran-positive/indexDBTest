self.onmessage = function(event) {
    if (event.data.type === 'start') {
        const dbName = event.data.dbName;
        importScripts('https://unpkg.com/dexie@3.2.4/dist/dexie.js');

        const db = new Dexie(dbName);
        db.version(1).stores({
            temp1: "++id,syncStatus"
        });

        console.log('Worker database initialized');

        setInterval(async () => {
            try {
                const records = await db.temp1.where('syncStatus').equals(1).toArray();
                console.log('Records with syncStatus=1:', records);
            } catch (error) {
                console.error('Error fetching records in worker:', error);
            }
        }, 5000);
    }
};
