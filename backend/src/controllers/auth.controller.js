import { validationResult } from 'express-validator';

function handleValidation(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }
}

export function register(req, res) {
  handleValidation(req);
  res.status(201).json({ message: 'Register endpoint wired', data: req.body });
}

export function login(req, res) {
  handleValidation(req);
  res.json({ message: 'Login endpoint wired' });
}

export function forgotPassword(req, res) {
  handleValidation(req);
  res.json({ message: 'Forgot password endpoint wired' });
}
