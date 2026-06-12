const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const submitInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message, consentGiven } = req.body;
    const inquiry = await prisma.contactMessage.create({
      data: { 
        name, 
        email, 
        phone, 
        message,
        consentGiven: !!consentGiven,
        consentTimestamp: consentGiven ? new Date() : null
      }
    });
    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    next(error);
  }
};

const getAllInquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [inquiries, total] = await Promise.all([
      prisma.contactMessage.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contactMessage.count()
    ]);

    res.json({
      inquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
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
