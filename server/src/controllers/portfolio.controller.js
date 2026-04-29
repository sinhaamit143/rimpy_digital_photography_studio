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
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.portfolioCategory.findMany({
      include: { albums: true }
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await prisma.portfolioCategory.create({
      data: { name }
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// Albums
const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await prisma.portfolioAlbum.findMany({
      include: { category: true, images: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(albums);
  } catch (error) {
    next(error);
  }
};

const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await prisma.portfolioAlbum.findUnique({
      where: { id: parseInt(id) },
      include: { category: true, images: true }
    });
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (error) {
    next(error);
  }
};

const createAlbum = async (req, res, next) => {
  try {
    const { title, clientName, categoryId } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : '';

    const album = await prisma.portfolioAlbum.create({
      data: {
        title,
        clientName,
        coverImage,
        categoryId: parseInt(categoryId)
      }
    });

    res.status(201).json(album);
  } catch (error) {
    next(error);
  }
};

const updateAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, clientName, categoryId } = req.body;
    
    const oldAlbum = await prisma.portfolioAlbum.findUnique({ where: { id: parseInt(id) } });
    if (!oldAlbum) return res.status(404).json({ message: 'Album not found' });

    let updateData = {
      title,
      clientName,
      categoryId: parseInt(categoryId)
    };

    if (req.file) {
      // Delete old cover if new one is uploaded
      deleteFile(oldAlbum.coverImage);
      updateData.coverImage = `/uploads/${req.file.filename}`;
    }

    const album = await prisma.portfolioAlbum.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(album);
  } catch (error) {
    next(error);
  }
};

const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 1. Find album and its images
    const album = await prisma.portfolioAlbum.findUnique({
      where: { id: parseInt(id) },
      include: { images: true }
    });

    if (album) {
      // 2. Delete cover image file
      deleteFile(album.coverImage);

      // 3. Delete all gallery image files
      album.images.forEach(img => {
        deleteFile(img.imageUrl);
      });

      // 4. Delete from DB (Cascade will handle image records, but we delete album)
      await prisma.portfolioAlbum.delete({
        where: { id: parseInt(id) }
      });
    }

    res.json({ message: 'Album and all associated media deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Images within Album
const addImagesToAlbum = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const imageData = files.map(file => ({
      imageUrl: `/uploads/${file.filename}`,
      albumId: parseInt(albumId)
    }));

    const images = await prisma.portfolioImage.createMany({
      data: imageData
    });

    res.status(201).json({ message: `${images.count} images added successfully` });
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const image = await prisma.portfolioImage.findUnique({ where: { id: parseInt(id) } });
    if (image) {
      deleteFile(image.imageUrl);
      await prisma.portfolioImage.delete({
        where: { id: parseInt(id) }
      });
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.portfolioCategory.findUnique({
      where: { id: parseInt(id) },
      include: { albums: true }
    });

    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    if (category.albums.length > 0) {
      return res.status(400).json({ message: 'Cannot delete genre that has albums. Please remove albums first.' });
    }

    await prisma.portfolioCategory.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Genre deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
  getAllAlbums,
  getAlbumById,
  createAlbum,
  addImagesToAlbum,
  deleteAlbum,
  updateAlbum,
  deleteImage
};
