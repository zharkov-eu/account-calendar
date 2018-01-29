const express = require('express');
const account = require('./controller/account');
const entry = require('./controller/entry');
const wrapAsync = require('./lib/wrapasync');

const router = express.Router();

router.get('/account', wrapAsync(account.getAll));
router.post('/account', wrapAsync(account.post));
router.get('/account/:id', wrapAsync(account.get));
router.patch('/account/:id', wrapAsync(account.patch));
router.delete('/account/:id', wrapAsync(account.delete));

router.get('/entry', wrapAsync(entry.getAll));
router.post('/entry', wrapAsync(entry.post));
router.get('/entry/:id', wrapAsync(entry.get));
router.patch('/entry/:id', wrapAsync(account.patch));
router.delete('/entry/:id', wrapAsync(account.delete));

module.exports = router;
