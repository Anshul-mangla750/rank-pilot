const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config/env');
const User = require('../models/User');

const mockDemoUser = {
  _id: '661000000000000000000001',
  name: 'Anshul Mangla',
  email: 'demo@rankpilot.in',
  role: 'admin',
  plan: 'pro',
  toJSON: function () {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      plan: this.plan,
    };
  },
};

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    // Fast-path for demo user
    if (decoded.userId === mockDemoUser._id) {
      req.user = mockDemoUser;
      req.userId = mockDemoUser._id;
      return next();
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
        req.userId = user._id;
        return next();
      }
    }

    // Default to mockDemoUser if in fallback mode
    req.user = mockDemoUser;
    req.userId = mockDemoUser._id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.secret);
      if (decoded.userId === mockDemoUser._id) {
        req.user = mockDemoUser;
        req.userId = mockDemoUser._id;
      } else if (mongoose.connection.readyState === 1) {
        const user = await User.findById(decoded.userId);
        if (user) {
          req.user = user;
          req.userId = user._id;
        }
      }
    }
  } catch (e) {
    // continue without req.user
  }
  next();
};

module.exports = auth;
module.exports.auth = auth;
module.exports.optionalAuth = optionalAuth;
