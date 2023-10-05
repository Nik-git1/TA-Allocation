const express = require( 'express' );
const { getProfessor, addProfessor, updateProfessor, deleteProfessor, getProfessors } = require( '../controllers/professorController' );
const router = express.Router();

router.route( ":filter?" ).get( getProfessors ).post( addProfessor );
router.route( "/:id" ).get( getProfessor ).put( updateProfessor ).delete( deleteProfessor );

module.exports = router;