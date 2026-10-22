import { body } from 'express-validator';
import { blogIdValidation } from '../../core/middlewares/validation/params-id.validation.middleware';

// Валидация полей
const titleValidation = body('title')
  .exists()
  .withMessage('title is required')
  .isString()
  .withMessage('title should be string')
  .trim()
  .notEmpty()
  .withMessage('title cannot be empty')
  .isLength({ min: 1, max: 30 })
  .withMessage('Length of title is not correct');

const shortDescriptionValidation = body('shortDescription')
  .exists()
  .withMessage('shortDescription is required')
  .isString()
  .withMessage('shortDescription should be string')
  .trim()
  .notEmpty()
  .withMessage('shortDescription cannot be empty')
  .isLength({ min: 1, max: 100 })
  .withMessage('Length of shortDescription is not correct');

const contentValidation = body('content')
  .exists()
  .withMessage('content is required')
  .isString()
  .withMessage('content should be string')
  .trim()
  .notEmpty()
  .withMessage('content cannot be empty')
  .isLength({ min: 1, max: 100 })
  .withMessage('Length of content is not correct');

const attributesValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];

export const postCreateUpdateInputValidation = [...attributesValidation];
