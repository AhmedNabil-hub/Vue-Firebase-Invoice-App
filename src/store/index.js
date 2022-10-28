import { createStore } from "vuex";
import db from "../firebase/firebaseInit";
import { collection, doc, getDocs } from "firebase/firestore";

const store = createStore({
  state: {
    invoiceModal: null,
    modalActive: null,
    invoiceData: [],
    invoicesLoaded: null,
  },
  mutations: {
    TOGGLE_INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive;
    },
    SET_INVOICE_DATA(state, data) {
      state.invoiceData.push(data);
    },
    INVOICES_LOADED(state) {
      state.invoicesLoaded = true;
    }
  },
  actions: {
    async GET_INVOICES({ commit, state }) {
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
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,

            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,

            productDescription: doc.data().productDescription,
          };

          commit("SET_INVOICE_DATA", data);
        }
      });

      commit('INVOICES_LOADED')
    },
  },
  modules: {},
});

export default store;
