import { Router } from 'express';
import { PassengersController } from '../controllers/passengers.controller';

const router = Router();

router.get('/', PassengersController.getAll);
router.get('/:id', PassengersController.getById);
router.post('/', PassengersController.create);
router.put('/:id', PassengersController.update);
router.delete('/:id', PassengersController.delete);

export default router;
