const asyncHandler = require( 'express-async-handler' );
const Admin = require( '../models/Admin' );
const argon2 = require( 'argon2' );

//@desc Get admin by ID
//@route GET /api/admin/:id
//@access public
const getAdmin = asyncHandler( async ( req, res ) =>
{
    const adminId = req.params.id;
    const admin = await Admin.findById( adminId, { password: 0 } );
    if ( !admin )
    {
        return res.status( 404 ).json( { message: 'Admin not found' } );
    }
    return res.status( 200 ).json( admin );
} );

//@desc Get filtered admins
//@route GET /api/admin?filters
//@access public
const getAdmins = asyncHandler( async ( req, res ) =>
{
    const { emailId } = req.query;
    const filter = {};
    if ( emailId ) filter.emailId = emailId;

    const admins = await Admin.find( filter, { password: 0 } );
    return res.status( 200 ).json( admins );
} );

//@desc Add new admin
//@route POST /api/admin
//@access public
const addAdmin = asyncHandler( async ( req, res ) =>
{
    try
    {
        const { emailId, password } = req.body;

        // Check if an admin already exists
        const existingAdmin = await Admin.exists( {} );
        if ( existingAdmin )
        {
            return res.status( 400 ).json( { message: 'Admin already exists' } );
        }

        // Check if required fields are not empty and have correct values
        if ( !emailId || !password )
        {
            return res.status( 400 ).json( { message: 'All required fields must be provided' } );
        }

        // Hash the password using Argon2
        const hashedPassword = await argon2.hash( password );

        const newAdmin = new Admin( {
            emailId,
            password: hashedPassword
        } );

        const savedAdmin = await newAdmin.save();
        return res.status( 201 ).json( savedAdmin );
    } catch ( error )
    {
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

//@desc Update admin data
//@route PUT /api/admin/:id
//@access public
const updateAdmin = asyncHandler( async ( req, res ) =>
{
    const adminId = req.params.id;
    let updates = req.body;

    try
    {
        // Validate that the admin exists
        const admin = await Admin.findById( adminId );
        if ( !admin )
        {
            return res.status( 404 ).json( { message: 'Admin not found' } );
        }

        // Ensure only one admin exists
        const existingAdmin = await Admin.exists( { _id: { $ne: adminId } } );
        if ( existingAdmin )
        {
            return res.status( 400 ).json( { message: 'Only one admin is allowed' } );
        }

        // Hash the password using Argon2 before saving it
        if ( updates.password )
        {
            const hashedPassword = await argon2.hash( updates.password );
            updates.password = hashedPassword;
        }

        const updatedAdmin = await Admin.findByIdAndUpdate( adminId, updates, { new: true } );
        return res.status( 200 ).json( updatedAdmin );
    } catch ( error )
    {
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

//@desc Delete admin by id
//@route DELETE /api/admin/:id
//@access public
const deleteAdmin = asyncHandler( async ( req, res ) =>
{
    const adminId = req.params.id;

    try
    {
        // Validate that the admin exists
        const admin = await Admin.findById( adminId );
        if ( !admin )
        {
            return res.status( 404 ).json( { message: 'Admin not found' } );
        }

        // Delete the admin
        await Admin.findByIdAndDelete( adminId );

        return res.status( 200 ).json( { message: 'Admin deleted successfully' } );
    } catch ( error )
    {
        return res.status( 500 ).json( { message: 'Internal server error', error: error.message } );
    }
} );

module.exports = { getAdmin, addAdmin, updateAdmin, deleteAdmin, getAdmins };
