const mongoose = require( 'mongoose' );
// const argon2 = require( 'argon2' );

const adminSchema = new mongoose.Schema(
    {
        emailId: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        jmAccess: {
            type: Boolean,
            default: false,
        },
        professorAccess: {
            type: Boolean,
            default: false,
        },
        studentFormAccess: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
);


// adminSchema.pre( 'save', async function ( next )
// {
//     const admin = this;

//     // Check if the password has been modified
//     if ( !admin.isModified( 'password' ) ) return next();

//     try
//     {
//         // Hash the password
//         const hash = await argon2.hash( admin.password );
//         admin.password = hash;
//         next();
//     } catch ( err )
//     {
//         return next( err );
//     }
// } );

module.exports = mongoose.model( 'Admin', adminSchema );