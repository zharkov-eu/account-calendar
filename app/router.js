const express = require('express');
const account = require('./controller/account');
const entry = require('./controller/entry');

const router = express.Router();

router.get('/account', account.getAll);
router.post('/account', account.getAll);
router.get('/account/:id', account.get);
router.patch('/account/:id', account.patch);
router.delete('/account/:id', account.delete);

router.get('/entry', entry.getAll);
router.post('/entry', entry.post);
router.get('/entry/:id', entry.get);
router.patch('/entry/:id', account.patch);
router.delete('/entry/:id', account.delete);

module.exports = router;
