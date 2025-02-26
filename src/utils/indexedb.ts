import { FormElement } from "../types";

export class IndexedDBUtil {
  private db: IDBDatabase | null = null;
  private readonly dbName: string;
  private readonly dbVersion: number;
  private readonly storeName: string;

  constructor(dbName = "formbuilder", dbVersion = 1, storeName = "forms") {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.storeName = storeName;
    this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "formId" });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject(`IndexedDB error: ${(event.target as IDBOpenDBRequest).error}`);
      };
    });
  }

  public async addData(
    formId: string | number,
    formElements: FormElement[]
  ): Promise<IDBValidKey> {
    if (!formId) {
      return Promise.reject("Error: 'id' field is required");
    }

    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ formId, formElements });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(
          `Failed to add data: ${(request.error as DOMException)?.message}`
        );
    });
  }

  public async getAllData(): Promise<any[]> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Failed to get all data");
    });
  }

  public async addQuestion(formId: number, newQuestion: any): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);

      const getRequest = store.get(formId);

      getRequest.onsuccess = (event) => {
        const existingForm = (event.target as IDBRequest).result;

        const updatedForm = existingForm
          ? {
              ...existingForm,
              formElements: [...existingForm.formElements, newQuestion],
            }
          : { formId, formElements: [newQuestion] };

        console.log("Saving to IndexedDB:", updatedForm);

        const request = store.put(updatedForm);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.error("IndexedDB Put Error:", request.error);
          reject(
            `Failed to add question: ${
              (request.error as DOMException)?.message
            }`
          );
        };
      };

      getRequest.onerror = () => {
        reject(`Error retrieving form with ID ${formId}`);
      };
    });
  }

  public async deleteQuestion(
    formId: number,
    questionId: number
  ): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);

      store.get(formId).onsuccess = (event) => {
        const existingForm = (event.target as IDBRequest).result;
        if (!existingForm) {
          reject(`Error: No form found with ID ${formId}`);
          return;
        }

        const updatedQuestions = existingForm.formElements.filter(
          (q: any) => q.id !== questionId
        );

        const request = store.put({ formId, formElements: updatedQuestions });

        request.onsuccess = () => resolve();
        request.onerror = () =>
          reject(
            `Failed to delete question: ${
              (request.error as DOMException)?.message
            }`
          );
      };
    });
  }

  public async updateQuestion(
    formId: number,
    updatedQuestion: FormElement
  ): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);

      store.get(formId).onsuccess = (event) => {
        const existingForm = (event.target as IDBRequest).result;
        if (!existingForm) {
          reject(`Error: No form found with ID ${formId}`);
          return;
        }

        const updatedQuestions = existingForm.formElements.map((q: any) =>
          q.id === updatedQuestion.id ? updatedQuestion : q
        );

        const request = store.put({ formId, formElements: updatedQuestions });

        request.onsuccess = () => resolve();
        request.onerror = () =>
          reject(
            `Failed to update question: ${
              (request.error as DOMException)?.message
            }`
          );
      };
    });
  }
}
