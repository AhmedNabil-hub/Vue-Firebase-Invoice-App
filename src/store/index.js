import { createStore } from "vuex";
import db from "../firebase/firebaseInit";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";

const store = createStore({
  state: {
    invoiceModal: false,
    modalActive: false,
    invoiceData: [],
    invoicesLoaded: false,
    currentInvoice: {},
    editInvoice: false,
  },
  mutations: {
    TOGGLE_INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive;
    },
    ADD_INVOICE_DATA(state, data) {
      state.invoiceData.push(data);
    },
    SET_INVOICE_DATA(state, data) {
      state.invoiceData = data;
    },
    INVOICES_LOADED(state) {
      state.invoicesLoaded = true;
    },
    SET_CURRENT_INVOICE(state, id) {
      let currentInvoiceArray = state.invoiceData.filter(
        (invoice) => invoice.invoiceId === id
      );
      state.currentInvoice = currentInvoiceArray[0];
    },
    TOGGLE_EDIT_INVOICE(state) {
      state.editInvoice = !state.editInvoice;
    },
    DELETE_INVOICE(state, docId) {
      state.invoiceData = state.invoiceData.filter(
        (invoice) => invoice.docId !== docId
      );
    },
    UPDATE_STATUS_TO_PAID(state, docId) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === docId) {
          invoice.invoicePaid = true;
          invoice.invoicePending = false;
        }
      });
    },
    UPDATE_STATUS_TO_PENDING(state, docId) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === docId) {
          invoice.invoicePaid = false;
          invoice.invoicePending = true;
          invoice.invoiceDraft = false;
        }
      });
    },
  },
  actions: {
    async GET_INVOICES({ commit, state }) {
      state.invoicesLoaded = false;

      const docsRef = collection(db, "invoices");
      const docsSnap = await getDocs(docsRef);
      docsSnap.forEach((doc) => {
        if (!state.invoiceData.some((invoice) => invoice.docId === doc.id)) {
          const data = {
            docId: doc.id,
            invoiceId: doc.data().invoiceId,
            billerStreetAddress: doc.data().billerStreetAddress,
            billerCity: doc.data().billerCity,
            billerZipCode: doc.data().billerZipCode,
            billerCountry: doc.data().billerCountry,
  
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
  
            invoiceDateUnix: doc.data().invoiceDateUnix,
            invoiceDate: doc.data().invoiceDate,
            invoicePending: doc.data().invoicePending,
            invoiceDraft: doc.data().invoiceDraft,
            invoicePaid: doc.data().invoicePaid,
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,
  
            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,
  
            productDescription: doc.data().productDescription,
          };

          commit("ADD_INVOICE_DATA", data);
        }
      });

      commit("INVOICES_LOADED");
    },
    async ADD_INVOICE({ commit, state }, data) {
      const docsRef = collection(db, "invoices");
      await addDoc(docsRef, data);
    },
    async UPDATE_INVOICE({ commit, dispatch }, { docId, data }) {
      commit("DELETE_INVOICE", data.invoiceId);

      const docRef = doc(db, "invoices", docId);
      await updateDoc(docRef, data);

      commit("ADD_INVOICE_DATA", data);

      commit("INVOICES_LOADED");
    },
    async DELETE_INVOICE({ commit }, { docId }) {
      const docRef = doc(db, "invoices", docId);
      await deleteDoc(docRef);
      commit("DELETE_INVOICE", docId);
    },
    async UPDATE_STATUS_TO_PAID({ commit }, { docId }) {
      const docRef = doc(db, "invoices", docId);
      await updateDoc(docRef, {
        invoicePaid: true,
        invoicePending: false,
      });
      commit("UPDATE_STATUS_TO_PAID", docId);
    },
    async UPDATE_STATUS_TO_PENDING({ commit }, { docId }) {
      const docRef = doc(db, "invoices", docId);
      await updateDoc(docRef, {
        invoicePaid: false,
        invoicePending: true,
        invoiceDraft: false,
      });
      commit("UPDATE_STATUS_TO_PENDING", docId);
    },
  },
  modules: {},
});

export default store;
