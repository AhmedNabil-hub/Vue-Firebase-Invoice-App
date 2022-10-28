import { createStore } from "vuex";

const store = createStore({
  state: {
    invoiceModal: null,
    modalActive: null,
  },
  mutations: {
    TOGGLE_INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive;
    },
  },
  actions: {},
  modules: {},
});

export default store;
