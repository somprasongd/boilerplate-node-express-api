// ให้ validate ใน controller ไปเลยดีกว่า อ่านง่ายกว่า
// Example usage in routes/returns.js
export default validator => (req, res, next) => {
  const { error } = validator(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  if (error) return res.status(400).json(error);
  next();
};
