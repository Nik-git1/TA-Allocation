const mongoose = require( 'mongoose' );
const argon2 = require( 'argon2' );

const professorSchema = new mongoose.Schema(
    {
        emailId: {
            type: String,
            required: true,
            unique: true,
        },
        hashedPassword: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
);

professorSchema.pre( 'save', async function ( next )
{
    const user = this;

    // Check if the password has been modified
    if ( !user.isModified( 'hashedPassword' ) ) return next();

    try
    {
        // Hash the password
        const hash = await argon2.hash( user.hashedPassword );
        user.hashedPassword = hash;
        next();
    } catch ( err )
    {
        return next( err );
    }
} );

module.exports = mongoose.model( 'Professor', professorSchema );