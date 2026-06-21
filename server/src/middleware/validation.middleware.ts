import { body } from 'express-validator';

export const validateAppointment = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long.')
    .escape(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^[\d+\-()\s]{7,20}$/).withMessage('Please enter a valid phone number.')
    .escape(),
  
  body('concern')
    .trim()
    .notEmpty().withMessage('Concern details are required.')
    .isLength({ min: 5 }).withMessage('Concern details must be at least 5 characters.')
    .escape(),
  
  body('preferredDate')
    .trim()
    .notEmpty().withMessage('Preferred date is required.')
    .custom((value) => {
      // Validate date is in correct format or at least a parsable date
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Please enter a valid date.');
      }
      
      // Ensure date is today or in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) {
        throw new Error('Appointment date cannot be in the past.');
      }
      return true;
    }),
  
  body('preferredTime')
    .trim()
    .notEmpty().withMessage('Preferred time is required.')
    .escape(),
  
  body('departmentId')
    .optional()
    .trim()
    .escape(),
    
  body('treatmentId')
    .optional()
    .trim()
    .escape()
];
