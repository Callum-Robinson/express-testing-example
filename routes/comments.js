const express = require('express');
const commentController = require('../controller/comment-controller');

const router = express.Router();

router.get('/', commentController.read);
router.get('/:id', commentController.readById);
router.put('/', commentController.update);
router.post('/', commentController.create);
router.delete('/:id', commentController.deleteById);

module.exports = router;