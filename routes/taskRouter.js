const Router = require('express')
const router = new Router()
const taskController = require('../controllers/taskController')

router.post('/', taskController.create)
// router.get('/:id', taskController.getAll)
router.get('/', taskController.getAll)
router.delete('/:id', taskController.delete)
router.put('/:id', taskController.put)
// router.get('/id',)

module.exports = router