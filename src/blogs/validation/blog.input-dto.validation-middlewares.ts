import { body } from 'express-validator';

// Валидация полей
const nameValidation = body('name')
  .exists()
  .withMessage('name is required')
  .isString()
  .withMessage('name should be string')
  .trim()
  .notEmpty()
  .withMessage('name cannot be empty')
  .isLength({ min: 1, max: 15 })
  .withMessage('Length of name is not correct');

const descriptionValidation = body('description')
  .exists()
  .withMessage('description is required')
  .isString()
  .withMessage('description should be string')
  .trim()
  .notEmpty()
  .withMessage('description cannot be empty')
  .isLength({ min: 1, max: 500 })
  .withMessage('Length of description is not correct');

const webSiteUrlValidation = body('websiteUrl')
  .exists()
  .withMessage('Website URL is required')
  .isString()
  .withMessage('Website URL must be a string')
  .trim()
  .notEmpty()
  .withMessage('Website URL cannot be empty')
  .isLength({ max: 100 })
  .withMessage('Website URL length must be max 100')
  .matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  .withMessage('Invalid website URL format');

const attributesValidation = [
  nameValidation,
  descriptionValidation,
  webSiteUrlValidation,
];

// Создание: проверяем тип ресурса + атрибуты.
export const blogCreateInputValidation = [...attributesValidation];

// Обновление: используются те же атрибуты. Проверка id из URL
export const blogUpdateInputValidation = [...attributesValidation];
