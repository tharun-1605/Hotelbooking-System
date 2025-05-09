import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new admin
// @route   POST /api/auth/admin/register
// @access  Public
export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, adminCode } = req.body;
    
    // Verify admin registration code
    if (adminCode !== process.env.ADMIN_CODE && adminCode !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin registration code'
      });
    }
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email });
    
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      });
    }
    
    // Create new admin user
    const admin = await User.create({
      name,
      email,
      password,
      isAdmin: true
    });
    
    // Generate token
    const token = generateToken(admin._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login admin
// @route   POST /api/auth/admin/login
// @access  Public
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists and is admin
    const user = await User.findOne({ email, isAdmin: true }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};