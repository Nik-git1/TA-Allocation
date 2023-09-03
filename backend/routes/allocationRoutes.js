const express = require('express');
const { getAllocations, addAllocation, getAllocation, updateAllocation, deleteAllocation } = require('../controllers/allocationController');
const router = express.Router();

router.route(":filter?").get(getAllocations).post(addAllocation);
router.route("/:id").get(getAllocation).put(updateAllocation).delete(deleteAllocation);

module.exports = router;