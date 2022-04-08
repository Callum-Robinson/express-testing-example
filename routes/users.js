const express = require('express');
const userController = require('../controller/user-controller');

const router = express.Router();

router.get('/', userController.read);
router.get('/:id', userController.readById);
router.put('/', userController.update);
router.post('/', userController.create);
router.delete('/email/:email', userController.deleteByEmail);
router.delete('/:id', userController.deleteById);

module.exports = router;