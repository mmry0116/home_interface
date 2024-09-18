class IndexedDBWrapper {
  constructor(dbName, storeName) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
  }

  openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);

      request.onerror = () => {
        console.error("Failed to open database");
        reject();
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        this.db = request.result;

        if (!this.db.objectStoreNames.contains(this.storeName)) {
          this.db.createObjectStore(this.storeName, { keyPath: "id" });
        }
      };
    });
  }

  addData(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.add(data);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error("Failed to add data");
        reject();
      };
    });
  }

  getDataById(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readonly");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`Failed to get data with id: ${id}`);
        reject();
      };
    });
  }

  getAllData() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readonly");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error("Failed to get all data");
        reject();
      };
    });
  }

  updateData(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.put(data);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error("Failed to update data");
        reject();
      };
    });
  }

  deleteDataById(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error(`Failed to delete data with id: ${id}`);
        reject();
      };
    });
  }

  deleteStore() {
    return new Promise((resolve, reject) => {
      const version = this.db.version + 1;
      this.db.close();

      const request = indexedDB.open(this.dbName, version);

      request.onupgradeneeded = () => {
        this.db = request.result;
        this.db.deleteObjectStore(this.storeName);
        resolve();
      };

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error("Failed to delete object store");
        reject();
      };
    });
  }
}
