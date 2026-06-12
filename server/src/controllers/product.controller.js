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

// Categories
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.productCategory.findMany({
      include: { products: true }
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const category = await prisma.productCategory.create({
      data: { name, imageUrl }
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const oldCategory = await prisma.productCategory.findUnique({ where: { id: parseInt(id) } });
    if (!oldCategory) return res.status(404).json({ message: 'Category not found' });

    let updateData = { name };

    if (req.file) {
      deleteFile(oldCategory.imageUrl);
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const category = await prisma.productCategory.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
};

// Products
const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : undefined;
    const skip = (page - 1) * limit;

    const where = categoryId ? { categoryId } : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
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

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true }
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, categoryId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        imageUrl,
        categoryId: parseInt(categoryId)
      }
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, categoryId } = req.body;
    
    // Find old product to potentially delete old image
    const oldProduct = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!oldProduct) return res.status(404).json({ message: 'Product not found' });

    let updateData = {
      title,
      description,
      price: price ? parseFloat(price) : undefined,
      categoryId: categoryId ? parseInt(categoryId) : undefined
    };

    if (req.file) {
      // Delete old file if new one is uploaded
      deleteFile(oldProduct.imageUrl);
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deletion if orders exist to maintain order history
    const orderCount = await prisma.order.count({ where: { productId: parseInt(id) } });
    if (orderCount > 0) {
      return res.status(400).json({ message: 'Cannot delete product: It is linked to existing orders.' });
    }

    const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    
    if (product) {
      deleteFile(product.imageUrl);
      await prisma.product.delete({
        where: { id: parseInt(id) }
      });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.productCategory.findUnique({
      where: { id: parseInt(id) },
      include: { products: true }
    });

    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    if (category.products.length > 0) {
      return res.status(400).json({ message: 'Cannot delete category that has products. Please remove products first.' });
    }

    deleteFile(category.imageUrl);
    await prisma.productCategory.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
};
