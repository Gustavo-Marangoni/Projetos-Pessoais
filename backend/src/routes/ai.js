const { Router } = require('express');
const { suggest } = require('../controllers/aiController');
const auth = require('../middleware/auth');

const router = Router();

router.post('/suggest', auth, suggest);

module.exports = router;
