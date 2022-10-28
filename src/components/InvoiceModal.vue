<template>
  <div
    @click="checkClick"
    ref="invoiceWrap"
    class="invoice-wrap flex flex-column"
  >
    <form @submit.prevent="submitForm" class="invoice-content">
      <h1>New Invoice</h1>
      <!-- Bill From -->
      <div class="bill-from flex flex-column">
        <h4>Bill From</h4>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Street Address</label>
          <input
            type="text"
            id="billerStreetAddress"
            v-model="billerStreetAddress"
            required
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billercity">City</label>
            <input type="text" id="billercity" v-model="billerCity" required />
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Zip Code</label>
            <input
              type="text"
              id="billerZipCode"
              v-model="billerZipCode"
              required
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">Country</label>
            <input
              type="text"
              id="billerCountry"
              v-model="billerCountry"
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
          <input type="text" id="clientName" v-model="clientName" required />
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">Email</label>
          <input type="text" id="clientEmail" v-model="clientEmail" required />
        </div>
        <div class="input flex flex-column">
          <label for="clientStreetAddress">Street Address</label>
          <input
            type="text"
            id="clientStreetAddress"
            v-model="clientStreetAddress"
            required
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientcity">City</label>
            <input type="text" id="clientcity" v-model="clientCity" required />
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">Zip Code</label>
            <input
              type="text"
              id="clientZipCode"
              v-model="clientZipCode"
              required
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">Country</label>
            <input
              type="text"
              id="clientCountry"
              v-model="clientCountry"
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
              v-model="invoiceDate"
              disabled
            />
          </div>
          <div class="input flex flex-column">
            <label for="paymentDueDate">Payment Due Date</label>
            <input
              type="text"
              id="paymentDueDate"
              v-model="paymentDueDate"
              disabled
            />
          </div>
        </div>
        <div class="input flex flex-column">
          <label for="paymentTerms">Payment Terms</label>
          <select id="paymentTerms" v-model="paymentTerms">
            <option value="30">Net 30 Days</option>
            <option value="60">Net 60 Days</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input
            type="text"
            id="productDescription"
            v-model="productDescription"
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
              v-for="(item, index) in invoiceItemList"
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
          <button type="button" @click="saveDraft" class="dark-purple">
            Save Draft
          </button>
          <button type="button" @click="publishInvoice" class="purple">
            Create Invoice
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();

const dateOptions = ref({
  year: "numeric",
  month: "short",
  day: "numeric",
});

const billerStreetAddress = ref(null);
const billerCity = ref(null);
const billerZipCode = ref(null);
const billerCountry = ref(null);

const clientName = ref(null);
const clientEmail = ref(null);
const clientStreetAddress = ref(null);
const clientCity = ref(null);
const clientZipCode = ref(null);
const clientCountry = ref(null);

const invoiceDateUnix = ref(null);
const invoiceDate = ref(null);
const invoicePending = ref(null);
const invoiceDraft = ref(null);
const invoiceItemList = ref([]);
const invoiceTotal = ref(0);

const paymentTerms = ref(null);
const paymentDueDateUnix = ref(null);
const paymentDueDate = ref(null);

const productDescription = ref(null);

function closeInvoice() {
  store.commit("TOGGLE_INVOICE");
}

invoiceDateUnix.value = Date.now();
invoiceDate.value = new Date(invoiceDateUnix.value).toLocaleDateString(
  "en-us",
  dateOptions.value
);

watch(paymentTerms, (newValue) => {
  const futureDate = new Date();
  paymentDueDateUnix.value = futureDate.setDate(
    futureDate.getDate() + parseInt(newValue)
  );
  paymentDueDate.value = new Date(paymentDueDateUnix.value).toLocaleDateString(
    "en-us",
    dateOptions.value
  );
});
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
