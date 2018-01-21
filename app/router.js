const express = require('express');
const account = require('./controller/account');

const router = express.Router();

router.get('/account', account.getAll);
router.post('/account', account.getAll);
router.get('/account/:id', account.get);
router.patch('/account/:id', account.patch);
router.delete('/account/:id', account.delete);

router.get('/entry', account.getAll);
router.post('/entry', account.getAll);
router.get('/entry/:id', account.getAll);
router.patch('/entry/:id', account.getAll);
router.delete('/entry/:id', account.getAll);

module.exports = router;
