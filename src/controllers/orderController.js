const Order = require("../models/Order");
const Menu = require("../models/Menu");

/**
 * POST /api/orders
 * Private - customer places a new order.
 *
 * Important security detail: we do NOT trust prices sent from the client.
 * We look up each menu item's real price on the server and use that,
 * so a modified request body can't be used to under-pay for an order.
 */
const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress } = req.body;

    let totalAmount = 0;
    const resolvedItems = [];

    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItem);

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${item.menuItem}`,
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `"${menuItem.name}" is currently unavailable`,
        });
      }

      const lineTotal = menuItem.price * item.quantity;
      totalAmount += lineTotal;

      resolvedItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: resolvedItems,
      totalAmount,
      deliveryAddress,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/my-orders
 * Private - the logged-in customer's own order history.
 */
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.menuItem", "name imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders
 * Admin only - all orders in the system.
 */
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.menuItem", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/:id
 * Private/Admin - a single order. Customers may only view their own order;
 * admins may view any order.
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.menuItem", "name imageUrl");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied, this order does not belong to you",
      });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/orders/:id/status
 * Admin only - update an order's status through its lifecycle.
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
