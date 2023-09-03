const express = require('express');
const { getAllAllocations, addAllocation, getAllocation, updateAllocation, deleteAllocation } = require('../controllers/allocationController');
const router = express.Router();

router.route("/").get(getAllAllocations).post(addAllocation);
router.route("/:id").get(getAllocation).put(updateAllocation).delete(deleteAllocation);

module.exports = router;