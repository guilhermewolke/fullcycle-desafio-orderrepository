import OrderItem from "./order_item";
export default class Order {
  private _id: string;
  private _customerId: string;
  private _items: OrderItem[];
  private _total: number;

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this._total = this.total();
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  validate(): boolean {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._customerId.length === 0) {
      throw new Error("CustomerId is required");
    }
    if (this._items.length === 0) {
      throw new Error("Items are required");
    }

    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error("Quantity must be greater than 0");
    }

    return true;
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.total(), 0);
  }

  addItem(item: OrderItem): void{
    // Se um item com mesmo ID já existir no pedido, apenas aumenta a quantidade do item...
    let i = 0;
    for (i == 0;i < this._items.length; i++) {
      if (this._items[i].productId == item.productId) {
        this.items[i].changeQuantity(item.quantity);
        this._total = this.total();
        return;
      }
    }
    this._items.push(item);
    this._total = this.total();
  }

  changeCustomer(customerId: string): void {
    this._customerId = customerId;
    this.validate();
  }
}
