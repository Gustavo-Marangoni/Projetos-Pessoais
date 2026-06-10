const { Router } = require('express');
const { getTasks, createTask, updateTask, deleteTask, getStats } = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = Router();

router.use(auth);

router.get('/', getTasks);
router.get('/stats', getStats);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
