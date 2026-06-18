import { Router } from 'express';
import {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  employeeSchema,
  employeeUpdateSchema,
  listQuerySchema,
} from '../utils/validators.js';

const router = Router();
router.use(requireAuth);

router.get('/', validate(listQuerySchema, 'query'), asyncWrap(listEmployees));
router.get('/:id', asyncWrap(getEmployee));
router.post('/', validate(employeeSchema), asyncWrap(createEmployee));
router.put('/:id', validate(employeeUpdateSchema), asyncWrap(updateEmployee));
router.delete('/:id', asyncWrap(deleteEmployee));

function asyncWrap(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export default router;
