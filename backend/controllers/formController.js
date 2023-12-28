const asyncHandler = require( 'express-async-handler' );
const Admin = require( "../models/Admin" );

//@desc to start and close TA form
//@route POST /api/form/changeState
//@access public
const setFormStatus = async (req, res) => {
    try {
      const state = req.body.state; // Extract the state from req.body
      const admin = await Admin.findOne({});
  
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }
  
      admin.studentFormAccess = state;
      await admin.save();
      res.status(200).json({ success: true, message: "Form state changed" });
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
  

//@desc to get form status
//@route GET /api/form
//@access public
const getFormStatus = async (req, res) => {

    try{
        const admin = await Admin.findOne({});
        if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        res.status(200).json({success:true, state: admin.studentFormAccess});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
}

module.exports = { setFormStatus, getFormStatus };