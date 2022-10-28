import { createStore } from "vuex";

const store = createStore({
  state: {
    invoiceModal: null,
  },
  mutations: {
    TOGGLE_INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
  },
  actions: {},
  modules: {},
});

export default store;
