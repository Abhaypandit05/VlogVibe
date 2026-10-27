import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_jwt_key_change_in_production_12345', {
    expiresIn: '30d',
  });
};

export default generateToken;
