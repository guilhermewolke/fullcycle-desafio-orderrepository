import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  // it("should find an order", async () => {
  //   const customerRepository = new CustomerRepository();
  //   const customer = new Customer("123", "Customer 1");
  //   const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
  //   customer.changeAddress(address);
  //   await customerRepository.create(customer);

  //   const productRepository = new ProductRepository();
  //   const product = new Product("123", "Product 1", 10);
  //   await productRepository.create(product);

  //   const orderItem = new OrderItem(
  //     "1",
  //     product.name,
  //     product.price,
  //     product.id,
  //     2
  //   );

  //   const order = new Order("123", "123", [orderItem]);

  //   const orderRepository = new OrderRepository();
  //   await orderRepository.create(order);

  //   const orderModel = await orderRepository.find("123");

  //   expect(orderModel.toJSON()).toStrictEqual({
  //     id: "123",
  //     customer_id: "123",
  //     total: order.total(),
  //     items: [
  //       {
  //         id: orderItem.id,
  //         name: orderItem.name,
  //         price: orderItem.price,
  //         quantity: orderItem.quantity,
  //         order_id: "123",
  //         product_id: "123",
  //       },
  //     ],
  //   });
  // });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    let order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    let createdOrder = await orderRepository.find(order.id);

    // Alterando o código do cliente, bem como a quantidade de itens do pedido...
    const orderItem2 = new OrderItem(
      "2",
      product.name,
      product.price,
      product.id,
      1
    );
    order.changeCustomer("124") ;
    order.addItem(orderItem2);
    // console.log("order antes do update");
    //console.log(order);
    await orderRepository.update(order);
    
    const orderModel = await OrderModel.findOne({
      where: { id: createdOrder.id },
      include: ["items"],
    });

    // console.log("order depois do update e depois da consulta");
    // console.log(orderModel.toJSON());
    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "124",
      total: createdOrder.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: 3,
          order_id: order.id,
          product_id: product.id,
        },
      ],
    });
  });
});
