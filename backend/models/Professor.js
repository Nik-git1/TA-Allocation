const mongoose = require( 'mongoose' );
// const argon2 = require( 'argon2' );

const professorSchema = new mongoose.Schema(
    {
        emailId: {
            type: String,
            required: true,
            unique: true,
            match: [ /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, `Please fill valid email address` ],
            // validate: {
            //     validator: function ()
            //     {
            //         return new Promise( ( res, rej ) =>
            //         {
            //             User.findOne( { email: this.email, _id: { $ne: this._id } } )
            //                 .then( data =>
            //                 {
            //                     if ( data )
            //                     {
            //                         res( false )
            //                     } else
            //                     {
            //                         res( true )
            //                     }
            //                 } )
            //                 .catch( err =>
            //                 {
            //                     res( false )
            //                 } )
            //         } )
            //     }, message: 'Email Already Taken'
            // },
        },
        password: {
            type: String,
            required: true,
        },
        name: {
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

// professorSchema.pre( 'save', async function ( next )
// {
//     const user = this;

//     // Check if the password has been modified
//     if ( !user.isModified( 'password' ) ) return next();

//     try
//     {
//         // Hash the password
//         const hash = await argon2.hash( user.password );
//         user.password = hash;
//         next();
//     } catch ( err )
//     {
//         return next( err );
//     }
// } );

module.exports = mongoose.model( 'Professor', professorSchema );