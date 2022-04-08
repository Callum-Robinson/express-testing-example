const express = require('express');
const postController = require('../controller/post-controller');

const router = express.Router();

router.get('/', postController.read);
router.get('/:id', postController.readById);
router.put('/', postController.update);
router.post('/', postController.create);
router.delete('/title/:title', postController.deleteByTitle);
router.delete('/:id', postController.deleteById);

module.exports = router;