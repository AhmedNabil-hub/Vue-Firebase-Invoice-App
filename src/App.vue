<template>
  <div>
    <div v-if="!mobile" class="app flex flex-column">
      <!-- <Loader v-show="invociesLoaded" /> -->
      <Navigation />
      <div class="app-content flex flex-column">
        <Modal v-if="modalActive" />
        <transition name="invoice">
          <InvoiceModal v-if="invoiceModal" />
        </transition>
        <router-view />
      </div>
    </div>
    <div v-else class="mobile-message flex flex-column">
      <h2>Sorry, this app is not supported on mobile devices</h2>
      <p>To use this app, please use a computer or tablet</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import Navigation from "./components/Navigation.vue";
import InvoiceModal from "./components/InvoiceModal.vue";
import { useStore } from "vuex";
import Modal from "./components/Modal.vue";
import Loader from "./components/Loader.vue";

// Mobile check
const mobile = ref(false);
function checkScreen() {
  const windowWidth = window.innerWidth;
  if (windowWidth <= 750) {
    mobile.value = true;
    return;
  }

  mobile.value = false;
}
checkScreen();
window.addEventListener("resize", checkScreen);

//

const store = useStore();

const invoiceModal = computed(() => store.state.invoiceModal);
const modalActive = computed(() => store.state.modalActive);
const invoicesLoaded = computed(() => store.state.invoicesLoaded);

function getInvoices() {
  store.dispatch("GET_INVOICES");
}
getInvoices();
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
  // background-color: #141625;
}

.app {
  background-color: #141625;
  min-height: 100vh;

  @media (min-width: 900px) {
    flex-direction: row !important;
  }

  .app-content {
    padding: 0 20px;
    flex: 1;
    position: relative;
  }
}

.mobile-message {
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141625;
  color: #ffffff;

  p {
    margin-top: 16px;
  }
}

// Animated Invoice

.invoice-enter-active,
.invoice-leave-active {
  transition: 0.8s ease all;
}

.invoice-enter-from,
.invoice-leave-to {
  transform: translateX(-700px);
}

button,
.button {
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 30px;
  border: none;
  font-size: 12px;
  margin-right: 8px;
  color: #ffffff;
}

.dark-purple {
  background-color: #252945;
}

.red {
  background-color: #ec5757;
}

.purple {
  background-color: #7c5dfa;
}

.green {
  background-color: #33d69f;
}

.orange {
  background-color: #ff8f00;
}

// Utility Classes

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.container {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto;

  @media (min-width: 900px) {
    padding-top: 72px;
  }
}

.nav-link {
  text-decoration: none;
  color: initial;
}

// Status Button Styling

.status-button {
  font-size: 12px;
  margin-right: 30px;
  align-items: center;
  padding: 8px 30px;
  border-radius: 10px;

  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }
}

.paid {
  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);

  &::before {
    background-color: #33d69f;
  }
}

.draft {
  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);

  &::before {
    background-color: #dfe3fa;
  }
}

.pending {
  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);

  &::before {
    background-color: #ff8f00;
  }
}
</style>
