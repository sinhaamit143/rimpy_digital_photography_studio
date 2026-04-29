const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { comparePassword, hashPassword } = require('../utils/hash.util');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt.util');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens({ id: user.id, email: user.email });

    // Store refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });

    const decoded = verifyRefreshToken(token);
    if (!decoded) return res.status(401).json({ message: 'Invalid refresh token' });

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Token not recognized' });
    }

    const tokens = generateTokens({ id: user.id, email: user.email });
    
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken }
    });

    res.json({ ...tokens });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (userId) {
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { refreshToken: null }
      });
    }
    res.json({ success: true, message: 'Session cleared from database' });
  } catch (error) {
    next(error);
  }
};

const setup = async (req, res, next) => {
  try {
    const count = await prisma.user.count();
    if (count > 0) return res.status(400).json({ message: 'Setup already done' });

    const { email, password } = req.body;
    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: { email, passwordHash, role: 'ADMIN' }
    });

    res.status(201).json({ success: true, message: 'Admin created' });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, refresh, setup, logout };
