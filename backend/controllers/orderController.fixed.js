const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, totalPrice, shippingAddress, customerName, customerEmail, customerPhone, paymentMethod, notes } = req.body;
    
    // Log the request for debugging
    console.log('Order creation request received:', {
      itemsCount: items?.length,
      totalPrice,
      customerEmail,
      paymentMethod
    });
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
        error: 'Order validation failed: items: Order must contain at least one item'
      });
    }
    
    // Process and normalize items
    const processedItems = [];
    
    for (const item of items) {
      // Extract product ID from various possible formats
      let productId = null;
      
      if (item.product) {
        // If product is a string (ID), use it directly
        if (typeof item.product === 'string') {
          productId = item.product;
        } 
        // If product is an object with id, use that
        else if (item.product.id) {
          productId = item.product.id;
        }
        // If product is an object with _id, use that
        else if (item.product._id) {
          productId = item.product._id;
        }
      } 
      // Fall back to productId if available
      else if (item.productId) {
        productId = item.productId;
      }
      
      // If no product ID found, try to find by name
      if (!productId && item.name) {
        try {
          const product = await Product.findOne({ name: item.name });
          if (product) {
            productId = product._id;
          }
        } catch (err) {
          console.error(`Error looking up product by name: ${item.name}`, err);
        }
      }
      
      // If still no product ID, return error
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: `Product ID not found for item: ${item.name || 'Unknown item'}`,
          error: 'Order validation failed: items.product: Path `product` is required.'
        });
      }
      
      // Ensure product ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID format',
          error: `Order validation failed: items.product: ${productId} is not a valid ObjectId`
        });
      }
      
      // Check if product exists
      const productExists = await Product.findById(productId);
      if (!productExists) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${productId} not found`,
          error: `Order validation failed: Product with ID ${productId} not found`
        });
      }
      
      // Add processed item
      processedItems.push({
        product: productId,
        name: item.name || productExists.name,
        price: item.price || productExists.price,
        quantity: item.quantity,
        image: item.image || productExists.image
      });
    }
    
    // Create the order
    const order = new Order({
      user: req.user._id, // From auth middleware
      items: processedItems,
      totalPrice,
      shippingAddress,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod,
      notes
    });
    
    // Save the order
    const savedOrder = await order.save();
    console.log('Order created successfully:', savedOrder._id);
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order data',
        error: error.message
      });
    }
    
    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: error.message
    });
  }
};

// Get all orders for the current user
exports.getOrders = async (req, res) => {
  try {
    let orders;
    
    // Admin can see all orders, users can only see their own
    if (req.user.role === 'admin') {
      orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate('user', 'username email');
    } else {
      orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 });
    }
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user is authorized to update this order
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }
    
    order.status = status;
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
      error: error.message
    });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Payment status is required'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user is authorized to update this order
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update payment status'
      });
    }
    
    order.paymentStatus = paymentStatus;
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating payment status',
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user is authorized to cancel this order
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }
    
    // Only allow cancellation if order is pending or processing
    if (order.status !== 'pending' && order.status !== 'processing') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order. Order is already shipped or delivered.'
      });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order',
      error: error.message
    });
  }
};
