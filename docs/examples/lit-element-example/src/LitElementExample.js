import { LitElement, html, css } from 'lit-element';
import '@paytrail/web-component-e2';

export class LitElementExample extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      page: { type: String },

      titleField: { type: Object },
      priceField: { type: Object },
      vatField: { type: Object },
      paytrailComponent: { type: Object },
      productsField: { type: Object },
      products: { type: Array },
    };
  }

  firstUpdated() {
    this.titleField = this.shadowRoot.querySelector("input[name='item_title']");
    this.priceField = this.shadowRoot.querySelector("input[name='item_price']");
    this.vatField = this.shadowRoot.querySelector("input[name='item_vat']");
    this.paytrailComponent = this.shadowRoot.querySelector('pay-trail');
    this.productsField = this.shadowRoot.querySelector('.products');

    this.products = [];
    this.setDefaultProduct();
  }

  setDefaultProduct() {
    this.titleField.value = 'Chocolate bar';
    this.priceField.value = '0.99';
    this.vatField.value = '24';
  }

  addProduct(e) {
    e.preventDefault();
    const product = {
      item_title: this.titleField.value,
      item_unit_price: this.priceField.value,
      item_vat_percent: this.vatField.value,
    };
    this.products.push(product);
    this.renderProducts();
    this.paytrailComponent.addProducts(product);
    this.calculateAuthcode();
  }

  removeProduct(index) {
    this.paytrailComponent.removeProductAtIndex(index);
    this.products.splice(index, 1);
    this.renderProducts();
    this.calculateAuthcode();
  }

  calculateAuthcode() {
    this.paytrailComponent.calculateAuthCodeString();
  }

  renderProducts() {
    const docFrag = document.createDocumentFragment();
    this.products.forEach((prod, i) => {
      const prodElem = document.createElement('p');
      prodElem.innerText = `${prod.item_title}, ${prod.item_unit_price}€ (click to remove)`;
      prodElem.addEventListener('click', () => this.removeProduct(i));
      docFrag.appendChild(prodElem);
    });
    this.productsField.innerHTML = '';
    this.productsField.appendChild(docFrag);
  }

  render() {
    return html`
      <h2>Welcome to the Paytrail HTML Example</h2>
      <form @submit=${this.addProduct}>
        <input type="text" placeholder="Item Title" name="item_title" />
        <input type="text" placeholder="Item Unit Price" name="item_price" />
        <input type="text" placeholder="Item Vat Percent" name="item_vat" />
        <input type="submit" value="Add product" />
      </form>
      <div class="products"></div>
      <pay-trail
        MERCHANT_ID="13466"
        ORDER_NUMBER="222"
        URL_SUCCESS="http://www.example.com/success"
        URL_CANCEL="http://www.example.com/cancel"
        PARAMS_IN="MERCHANT_ID,URL_SUCCESS,URL_CANCEL,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,PAYER_PERSON_PHONE,PAYER_PERSON_EMAIL,PAYER_PERSON_FIRSTNAME,PAYER_PERSON_LASTNAME,PAYER_COMPANY_NAME,PAYER_PERSON_ADDR_STREET,PAYER_PERSON_ADDR_POSTAL_CODE,PAYER_PERSON_ADDR_TOWN,PAYER_PERSON_ADDR_COUNTRY,AMOUNT"
        PARAMS_OUT="ORDER_NUMBER,PAYMENT_ID,AMOUNT,CURRENCY,PAYMENT_METHOD,TIMESTAMP,STATUS"
      >
        <label>Pay here</label>
      </pay-trail>
    `;
  }

  static get styles() {
    return css`
      :host {
        width: 60%;
        min-height: 60%;
        display: flex;
        flex-direction: column;
        margin: 10% auto 0;
        padding: 2.5%;
        align-items: center;
        justify-content: center;
        background-color: var(--body-color);
        border-radius: 4px;
      }

      form {
        display: flex;
        padding: 5%;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 80%;
      }

      input {
        font-size: 1.6rem;
        margin-bottom: 1rem;
        border: none;
        border-radius: 4px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.07);
        padding: 0.25rem;
      }

      input[type='submit'] {
        background: var(--primary-color);
        color: #fff;
        padding: 0.5rem;
        cursor: pointer;
      }

      .products p {
        color: var(--primary-color);
        font-size: 1.2rem;
        cursor: pointer;
      }

      pay-trail {
        background: var(--primary-color);
        color: #fff;
        padding: 0.5rem;
        cursor: pointer;
        font-size: 1.4rem;
      }
    `;
  }
}
