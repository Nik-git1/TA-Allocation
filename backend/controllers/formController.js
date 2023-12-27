const asyncHandler = require( 'express-async-handler' );
const Admin = require( "../models/Admin" );

//@desc to start and close TA form
//@route POST /api/form/changeState
//@access public
const setFormStatus = async (req, res) => {
    try{
        const state = req.body;
        const admin = await Admin.findById('6551f0580b17612a2edbf852');
        admin.studentFormAccess = state;
        await admin.save();
        res.status(200).json({success:true, message:"Form state changed"});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
}

//@desc to get form status
//@route GET /api/form
//@access public
const getFormStatus = async (req, res) => {

    try{
        const admin = await Admin.findById('6551f0580b17612a2edbf852');
        res.status(200).json({success:true, status: admin.studentFormAccess});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
}

module.exports = { setFormStatus, getFormStatus };