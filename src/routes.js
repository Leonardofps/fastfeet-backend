import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryboyController from './app/controllers/DeliveryboyController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryActionsController from './app/controllers/DeliveryActionsController';
import FinalDeliveryController from './app/controllers/FinalDeliveryController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Route for start some delivery
routes.put(
  '/delivery/:deliveryId/deliveryboy/:deliveryboyId',
  DeliveryActionsController.update
);

routes.put(
  '/deliveries/:deliveryId/deliveryboy/:deliveryboyId',
  FinalDeliveryController.update
);

routes.get(
  '/deliveryboy/:deliveryboyId/deliveries',
  DeliveryActionsController.index
);

routes.get(
  '/deliveryboy/:deliveryboyId/deliveriesend',
  DeliveryActionsController.show
);

// Routes for Delivery Problems
routes.get('/problems', DeliveryProblemsController.index);
routes.post('/delivery/:deliveryId/problems', DeliveryProblemsController.store);
routes.get('/delivery/:deliveryId/problems', DeliveryProblemsController.show);

// -------------------------------------------------------------------------

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/files', upload.single('file'), FileController.store);

// CRUD from Deliveryboys
routes.get('/deliveryboys', DeliveryboyController.index);

routes.post('/deliveryboys', DeliveryboyController.store);
routes.put('/deliveryboys/:id', DeliveryboyController.update);
routes.delete('/deliveryboys/:id', DeliveryboyController.delete);

// Routes for deliveries
routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:deliveryId', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

// Route for cancel some delivery with a problem
routes.delete(
  '/problem/:problemId/cancel-delivery',
  DeliveryProblemsController.delete
);

export default routes;
