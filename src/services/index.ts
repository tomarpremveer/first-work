import { FormElement } from "../types";
import { IndexedDBUtil } from "../utils/indexedb";

const DB_NAME = "formbuilder";
const DB_VERSION = 1;
const STORE_NAME = "forms";
const dbUtil = new IndexedDBUtil(DB_NAME, DB_VERSION, STORE_NAME);

export const formService = {
  saveForm: (formId: number, formElements: FormElement[]) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dbUtil
          .addData(formId, formElements)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }, 1000);
    });
  },
  getForm: (): Promise<{ formId: number; formElements: FormElement[] }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dbUtil
          .getAllData()
          .then((response) => {
            console.log("response", response);
            resolve(response[0]);
          })
          .catch((error) => {
            reject(error);
          });
      }, 1000);
    });
  },
  addQuestion: (formId: number, question: FormElement) => {
    return new Promise((resolve) => {
      dbUtil
        .addQuestion(formId, question)
        .then((response) => resolve(response));
    });
  },
  deleteQuestion: (formId: number, questionId: number) => {
    return new Promise((resolve) => {
      dbUtil
        .deleteQuestion(formId, questionId)
        .then((response) => resolve(response));
    });
  },
  updateQuestion: (formId: number, updatedQuestion: FormElement) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dbUtil
          .updateQuestion(formId, updatedQuestion)
          .then((response) => resolve(response));
      }, 1000);
    });
  },
};
