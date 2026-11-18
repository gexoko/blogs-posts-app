import { body, param } from 'express-validator';

export const idValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .isString()
  .withMessage('ID must be a string')
  .isMongoId()
  .withMessage('ID must be a valid MongoDB ObjectId');

export const blogIdValidation = body('blogId')
  .exists()
  .withMessage('blogId is required')
  .isString()
  .withMessage('blogId must be a string')
  .isMongoId()
  .withMessage('blogId must be a valid MongoDB ObjectId');
