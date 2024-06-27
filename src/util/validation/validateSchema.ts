import { NextFunction, Request, Response } from 'express';

const validateSchema = schema => async (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema(req.body);
  if (error) res.status(400).json({ error: true, message: error.details[0].message });
  next();
};
export default validateSchema;
