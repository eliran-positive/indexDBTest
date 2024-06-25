self.onmessage = function(event) {
    if (event.data.type === 'start') {
        const dbName = event.data.dbName;
        importScripts('https://unpkg.com/dexie@3.2.4/dist/dexie.js');

        const db = new Dexie(dbName);
        db.version(1).stores({
            temp1: "++id,syncStatus",
            temp2: "++id,syncStatus"
        });

        console.log('Worker database initialized');

        setInterval(async () => {
            try {
                const records1 = await db.temp1.where('syncStatus').equals(1).toArray();
                console.log('Records with syncStatus=1 on temp1:', records1);
                const records2 = await db.temp2.where('syncStatus').equals(1).toArray();
                console.log('Records with syncStatus=1 on temp2:', records2);
            } catch (error) {
                console.error('Error fetching records in worker:', error);
            }
        }, 5000);
    }
};
