const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const submitInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    const inquiry = await prisma.contactMessage.create({
      data: { name, email, phone, message }
    });
    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    next(error);
  }
};

const getAllInquiries = async (req, res, next) => {
  try {
    const inquiries = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(inquiries);
  } catch (error) {
    next(error);
  }
};

const toggleReadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find current status
    const current = await prisma.contactMessage.findUnique({ where: { id: parseInt(id) } });
    if (!current) return res.status(404).json({ message: 'Inquiry not found' });

    const inquiry = await prisma.contactMessage.update({
      where: { id: parseInt(id) },
      data: { isRead: !current.isRead }
    });
    
    res.json(inquiry);
  } catch (error) {
    next(error);
  }
};

const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitInquiry,
  getAllInquiries,
  toggleReadStatus,
  deleteInquiry
};
