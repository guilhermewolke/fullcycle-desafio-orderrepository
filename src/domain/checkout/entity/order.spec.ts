import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123", []);
    }).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "", []);
    }).toThrowError("CustomerId is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "123", []);
    }).toThrowError("Items are required");
  });

  it("should calculate total", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const order = new Order("o1", "c1", [item]);

    let total = order.total();

    expect(order.total()).toBe(200);

    const order2 = new Order("o1", "c1", [item, item2]);
    total = order2.total();
    expect(total).toBe(600);
  });

  it("should throw error if the item qte is less or equal zero 0", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
      const order = new Order("o1", "c1", [item]);
    }).toThrowError("Quantity must be greater than 0");
  });

  it("should insert a new item into an existing order", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const order = new Order("o1", "c1", [item]);
    // Validando se ao incluir um item sem código inexistente, se aumenta a quantidade de itens no pedido...
    order.addItem(item2);
    expect(order.items.length).toBe(2);
    expect(order.total()).toBe(600);

    // Validando se ao incluir um item com código inexistente, se aumenta apenas a quantidade do item já existente...
    const item3 = new OrderItem("i2", "Item 2", 200, "p2", 1);
    order.addItem(item3);
    expect(order.items.length).toBe(2); // A quantidade de itens se mantém
    expect(order.total()).toBe(800); // O valor total aumenta, pois a quantidade do item cujo id é "i2" aumentou 
  });

  it("should change the customerID of an order", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const order = new Order("o1", "c1", [item]);

    order.changeCustomer("c2");

    expect(order.customerId).toBe("c2");
  });
});
