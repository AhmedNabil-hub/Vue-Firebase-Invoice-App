<template>
  <div
    @click="checkClick"
    ref="invoiceWrap"
    class="invoice-wrap flex flex-column"
  >
    <form @submit.prevent="submitForm" class="invoice-content">
      <Loader v-show="loading" />

      <h1 v-if="!editInvoice">New Invoice</h1>
      <h1 v-else>Edit Invoice</h1>

      <!-- Bill From -->
      <div class="bill-from flex flex-column">
        <h4>Bill From</h4>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Street Address</label>
          <input
            type="text"
            id="billerStreetAddress"
            v-model="invoiceData.billerStreetAddress"
            required
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billercity">City</label>
            <input
              type="text"
              id="billercity"
              v-model="invoiceData.billerCity"
              required
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Zip Code</label>
            <input
              type="text"
              id="billerZipCode"
              v-model="invoiceData.billerZipCode"
              required
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">Country</label>
            <input
              type="text"
              id="billerCountry"
              v-model="invoiceData.billerCountry"
              required
            />
          </div>
        </div>
      </div>
      <!-- Bill To -->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <div class="input flex flex-column">
          <label for="clientName">Name</label>
          <input
            type="text"
            id="clientName"
            v-model="invoiceData.clientName"
            required
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">Email</label>
          <input
            type="text"
            id="clientEmail"
            v-model="invoiceData.clientEmail"
            required
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientStreetAddress">Street Address</label>
          <input
            type="text"
            id="clientStreetAddress"
            v-model="invoiceData.clientStreetAddress"
            required
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientcity">City</label>
            <input
              type="text"
              id="clientcity"
              v-model="invoiceData.clientCity"
              required
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">Zip Code</label>
            <input
              type="text"
              id="clientZipCode"
              v-model="invoiceData.clientZipCode"
              required
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">Country</label>
            <input
              type="text"
              id="clientCountry"
              v-model="invoiceData.clientCountry"
              required
            />
          </div>
        </div>
      </div>
      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Invoice Date</label>
            <input
              type="text"
              id="invoiceDate"
              v-model="invoiceData.invoiceDate"
              disabled
            />
          </div>
          <div class="input flex flex-column">
            <label for="paymentDueDate">Payment Due Date</label>
            <input
              type="text"
              id="paymentDueDate"
              v-model="invoiceData.paymentDueDate"
              disabled
            />
          </div>
        </div>
        <div class="input flex flex-column">
          <label for="paymentTerms">Payment Terms</label>
          <select id="paymentTerms" v-model="invoiceData.paymentTerms">
            <option value="30">Net 30 Days</option>
            <option value="60">Net 60 Days</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input
            type="text"
            id="productDescription"
            v-model="invoiceData.productDescription"
            required
          />
        </div>
        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Item Name</th>
              <th class="qty">Qty</th>
              <th class="price">Price</th>
              <th class="total">Total</th>
            </tr>
            <tr
              class="table-items flex"
              v-for="(item, index) in invoiceData.invoiceItemList"
              :key="index"
            >
              <td class="item-name">
                <input type="text" v-model="item.name" />
              </td>
              <td class="qty">
                <input type="text" v-model="item.qty" />
              </td>
              <td class="price">
                <input type="text" v-model="item.price" />
              </td>
              <td class="total flex">
                ${{ (item.total = item.qty * item.price) }}
              </td>
              <img
                @click="deleteInvoiceItem(item.id)"
                src="@/assets/icon-delete.svg"
                alt=""
              />
            </tr>
          </table>
          <div @click="addNewInvoiceItem" class="flex button">
            <img src="@/assets/icon-plus.svg" alt="" />
            <span>Add new Item</span>
          </div>
        </div>
      </div>
      <!-- Save/Exit -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">
            Cancel
          </button>
        </div>
        <div class="right flex">
          <button
            v-if="!editInvoice"
            type="submit"
            @click="saveDraft"
            class="dark-purple"
          >
            Save Draft
          </button>
          <button v-if="!editInvoice" @click="publishInvoice" type="submit" class="purple">
            Create Invoice
          </button>
          <button v-if="editInvoice" type="submit" class="purple">
            Update Invoice
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed, reactive } from "vue";
import { useStore } from "vuex";
import { uid } from "uid";
import db from "../firebase/firebaseInit";
import { collection, addDoc } from "firebase/firestore";
import Loader from "./Loader.vue";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

const dateOptions = reactive({
  year: "numeric",
  month: "short",
  day: "numeric",
});

const loading = ref(false);

const editInvoice = computed(() => store.state.editInvoice);
const currentInvoice = computed(() => store.state.currentInvoice);
const invoicesLoaded = computed(() => store.state.invoicesLoaded);

const docId = ref(null);
const invoiceData = reactive({
  billerStreetAddress: null,
  billerCity: null,
  billerZipCode: null,
  billerCountry: null,
  clientName: null,
  clientEmail: null,
  clientStreetAddress: null,
  clientCity: null,
  clientZipCode: null,
  clientCountry: null,
  invoiceDateUnix: null,
  invoiceDate: null,
  invoicePending: null,
  invoiceDraft: null,
  invoicePaid: null,
  invoiceItemList: [],
  invoiceTotal: null,
  paymentTerms: null,
  paymentDueDateUnix: null,
  paymentDueDate: null,
  productDescription: null,
});

function closeInvoice() {
  store.commit("TOGGLE_INVOICE");
  if (editInvoice.value) {
    store.commit("TOGGLE_EDIT_INVOICE");
  }
}

// Invoice Dates
if (!editInvoice.value) {
  invoiceData.invoiceDateUnix = Date.now();
  invoiceData.invoiceDate = new Date(
    invoiceData.invoiceDateUnix
  ).toLocaleDateString("en-us", dateOptions);
}

if (editInvoice.value) {
  docId.value = currentInvoice.value.docId;

  invoiceData.billerStreetAddress = currentInvoice.value.billerStreetAddress;
  invoiceData.billerCity = currentInvoice.value.billerCity;
  invoiceData.billerZipCode = currentInvoice.value.billerZipCode;
  invoiceData.billerCountry = currentInvoice.value.billerCountry;

  invoiceData.clientName = currentInvoice.value.clientName;
  invoiceData.clientEmail = currentInvoice.value.clientEmail;
  invoiceData.clientStreetAddress = currentInvoice.value.clientStreetAddress;
  invoiceData.clientCity = currentInvoice.value.clientCity;
  invoiceData.clientZipCode = currentInvoice.value.clientZipCode;
  invoiceData.clientCountry = currentInvoice.value.clientCountry;

  invoiceData.invoiceDateUnix = currentInvoice.value.invoiceDateUnix;
  invoiceData.invoiceDate = currentInvoice.value.invoiceDate;
  invoiceData.invoiceItemList = currentInvoice.value.invoiceItemList;
  invoiceData.invoiceTotal = currentInvoice.value.invoiceTotal;

  invoiceData.paymentTerms = currentInvoice.value.paymentTerms;
  invoiceData.paymentDueDateUnix = currentInvoice.value.paymentDueDateUnix;
  invoiceData.paymentDueDate = currentInvoice.value.paymentDueDate;

  invoiceData.productDescription = currentInvoice.value.productDescription;
}

watch(
  () => invoiceData.paymentTerms,
  (newValue) => {
    const futureDate = new Date();
    invoiceData.paymentDueDateUnix = futureDate.setDate(
      futureDate.getDate() + parseInt(newValue)
    );
    invoiceData.paymentDueDate = new Date(
      invoiceData.paymentDueDateUnix
    ).toLocaleDateString("en-us", dateOptions);
  }
);

// Add New Item
function addNewInvoiceItem() {
  invoiceData.invoiceItemList.push({
    id: uid(),
    name: "",
    qty: "",
    price: 0,
    total: 0,
  });
}

function deleteInvoiceItem(id) {
  invoiceData.invoiceItemList = invoiceData.invoiceItemList.filter(
    (item) => item.id !== id
  );
}

function calInvoiceTotal() {
  invoiceData.invoiceTotal = 0;
  invoiceData.invoiceItemList.forEach((item) => {
    invoiceData.invoiceTotal += item.total;
  });
}

function publishInvoice() {
  invoiceData.invoicePending = true;
}

function saveDraft() {
  invoiceData.invoiceDraft = true;
}

async function uploadInvoice() {
  if (invoiceData.invoiceItemList.length <= 0) {
    alert("Please add work items");
    return;
  }

  loading.value = true;

  calInvoiceTotal();

  const data = {
    invoiceId: uid(6),
    ...invoiceData,
  };

  await store.dispatch("ADD_INVOICE", data);

  loading.value = false;

  store.commit("TOGGLE_INVOICE");

  store.dispatch("GET_INVOICES");
}

async function updateInvoice() {
  if (invoiceData.invoiceItemList.length <= 0) {
    alert("Please add work items");
    return;
  }

  loading.value = true;

  calInvoiceTotal();

  const data = {
    invoiceId: route.params.invoiceId,
    billerStreetAddress: invoiceData.billerStreetAddress,
    billerCity: invoiceData.billerCity,
    billerZipCode: invoiceData.billerZipCode,
    billerCountry: invoiceData.billerCountry,

    clientName: invoiceData.clientName,
    clientEmail: invoiceData.clientEmail,
    clientStreetAddress: invoiceData.clientStreetAddress,
    clientCity: invoiceData.clientCity,
    clientZipCode: invoiceData.clientZipCode,
    clientCountry: invoiceData.clientCountry,

    invoiceDateUnix: invoiceData.invoiceDateUnix,
    invoiceDate: invoiceData.invoiceDate,
    invoiceItemList: invoiceData.invoiceItemList,
    invoiceTotal: invoiceData.invoiceTotal,

    paymentTerms: invoiceData.paymentTerms,
    paymentDueDateUnix: invoiceData.paymentDueDateUnix,
    paymentDueDate: invoiceData.paymentDueDate,

    productDescription: invoiceData.productDescription,
  };

  await store.dispatch("UPDATE_INVOICE", {
    docId: docId.value,
    data: data,
  });

  loading.value = false;
  store.commit("TOGGLE_INVOICE");
  store.commit("TOGGLE_EDIT_INVOICE");
  await store.dispatch("GET_INVOICES");
  store.commit("SET_CURRENT_INVOICE", data.invoiceId);
}

function submitForm() {
  if (editInvoice.value) {
    updateInvoice();
    return;
  } else {
    uploadInvoice();
    return;
  }
}

const invoiceWrap = ref(null);
function checkClick(event) {
  if (event.target === invoiceWrap.value) {
    store.commit("TOGGLE_MODAL");
  }
}
</script>

<style lang="scss" scoped>
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 900px) {
    left: 90px;
  }

  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #ffffff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: #ffffff;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }

    h4 {
      margin-bottom: 24px;
      font-size: 12px;
      color: #7c5dfa;
    }

    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    // Invoice Work
    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }

      .work-items {
        .item-list {
          width: 100%;

          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;

            .item-name {
              flex-basis: 50%;
            }
            .qty {
              flex-basis: 10%;
            }
            .price {
              flex-basis: 20%;
            }
            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
              cursor: pointer;
            }
          }
        }

        .button {
          color: #ffffff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;

          img {
            margin-right: 4px;
          }
        }
      }
    }

    .save {
      margin-top: 60px;

      div {
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }
    }
  }

  .input {
    margin-bottom: 24px;
  }

  label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #ffffff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}
</style>
