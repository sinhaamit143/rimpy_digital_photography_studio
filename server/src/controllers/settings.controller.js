const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSettings = async (req, res, next) => {
  try {
    let settings = await prisma.studioSettings.findUnique({
      where: { id: 1 }
    });

    // If no settings exist yet, create a default record
    if (!settings) {
      settings = await prisma.studioSettings.create({
        data: {
          id: 1,
          address: 'Your Studio Address Here',
          workingHours: 'Mon-Sat: 10AM - 8PM',
          phone: '+91 00000 00000',
          email: 'studio@example.com',
          instagram: 'https://instagram.com/',
          facebook: 'https://facebook.com/',
          whatsapp: 'https://wa.me/910000000000',
          youtube: 'https://youtube.com/'
        }
      });
    }

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const { 
      address, workingHours, phone, email, 
      instagram, facebook, whatsapp, youtube, themeColors 
    } = req.body;

    const settings = await prisma.studioSettings.upsert({
      where: { id: 1 },
      update: {
        address, workingHours, phone, email,
        instagram, facebook, whatsapp, youtube, themeColors
      },
      create: {
        id: 1,
        address, workingHours, phone, email,
        instagram, facebook, whatsapp, youtube, themeColors
      }
    });

    res.json(settings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings
};
