const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Helper to delete physical files
const deleteFile = (filePath) => {
  if (!filePath || filePath.startsWith('http')) return;
  const fullPath = path.join(__dirname, '../../public', filePath);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (error) {
      console.error(`Error deleting file: ${fullPath}`, error);
    }
  }
};

const getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

const createTestimonial = async (req, res, next) => {
  try {
    const { name, profession, comment, rating, status } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        profession: profession || '',
        comment,
        rating: parseInt(rating) || 5,
        imageUrl,
        status: status || 'active'
      }
    });

    res.status(201).json(testimonial);
  } catch (error) {
    next(error);
  }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, profession, comment, rating, status } = req.body;
    
    const oldTestimonial = await prisma.testimonial.findUnique({ where: { id: parseInt(id) } });
    if (!oldTestimonial) return res.status(404).json({ message: 'Testimonial not found' });

    let updateData = {
      name,
      profession,
      comment,
      rating: rating ? parseInt(rating) : undefined,
      status
    };

    if (req.file) {
      // Delete old photo if new one is uploaded
      deleteFile(oldTestimonial.imageUrl);
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(testimonial);
  } catch (error) {
    next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const testimonial = await prisma.testimonial.findUnique({ where: { id: parseInt(id) } });
    if (testimonial) {
      deleteFile(testimonial.imageUrl);
      await prisma.testimonial.delete({
        where: { id: parseInt(id) }
      });
    }
    
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
