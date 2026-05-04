import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Public: Create a new order (inquiry) from the shop detail page
export const createOrder = async (req, res) => {
  try {
    const { 
      name, email, phone, message, 
      district, state, country, pinCode, 
      productId, productTitle, price, category 
    } = req.body;

    const order = await prisma.order.create({
      data: {
        name,
        email,
        phone,
        message,
        district,
        state,
        country,
        pinCode,
        productId,
        productTitle,
        price,
        category,
        status: 'pending',
      },
    });

    res.status(201).json({ message: 'Order submitted successfully', order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to submit order' });
  }
};

// Admin: Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { imageUrl: true }
        }
      }
    });
    
    // Grouping orders for analytics could be done here or on the frontend.
    // For now, we'll let the frontend handle the grouping using Recharts.
    
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.status(200).json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};
