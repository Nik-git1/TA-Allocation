const express = require( 'express' );
const router = express.Router();
const { setFormStatus, getFormStatus } = require( '../controllers/formController' );

router.route('/').get(getFormStatus);
router.route('/changeState').post(setFormStatus);

module.exports = router;