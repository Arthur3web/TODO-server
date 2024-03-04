const Router = require('express')
const router = new Router()
const taskController = require('../controllers/taskController')
const authMiddleware = require ('../middleware/authMiddleware')

router.post('/', authMiddleware, taskController.create)
router.get('/', authMiddleware, taskController.getAll)
router.delete('/:id', authMiddleware, taskController.delete)
router.put('/:id', authMiddleware, taskController.put)

module.exports = router