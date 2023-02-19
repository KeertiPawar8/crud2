const express = require("express");
const { NoteModel } = require("../model/Note.model");
const noteRouter = express.Router();


/**
 * @swagger
 * components:
 *  schemas:
 *      notes:
 *           type: object
 *           properties:
 *              id:
 *                  type: string 
 *                  description: The auto-generated id of the title
 *              title:
 *                  type: string
 *                  description: The title 
 *              body:
 *                  type: string
 *                  description: The body
 */








/**
 * @swagger
 * /notes:
 *  get:
 *      summary: This will get all notes of the users from the database
 *      tags: [Notes]   
 *      responses: 
 *          200:
 *              description: The list of all the notes
 *              content:
 *                  application/json:
 *                       schema:
 *                           type: array
 *                           item:
 *                               $ref:"#/components/schemas/notes"
 *                                   
 */






noteRouter.get("/", async (req, res) => {
  const loginid = req.body.user;
  const notes = await NoteModel.find({ user: loginid });
  res.send(notes);
});




/**
 * @swagger
 * /notes/create:
 *  post:
 *      summary: This is to post new notes to the database.
 *      tags: [Notes]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/notes"
 *      responses: 
 *          200:
 *              description: The user has been registered
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref:"#/components/schemas/notes"
 *          500:
 *              description: server error                               
 */





noteRouter.post("/create", async (req, res) => {
  try {
    const payload = req.body;
    console.log(payload);
    const note = new NoteModel(payload);
    await note.save();

    res.send({ msg: "Note Created" });
  } catch (err) {
    res.send(err.message);
  }
});



/**
 * @swagger
 * /notes/patch/{id}:
 *  patch:
 *    summary: This is to update the notes of the database.
 *    tags: [Notes]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id 
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/notes"
 *    responses: 
 *      200:
 *        description: The user has been updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref:"#/components/schemas/notes"
 *          500:
 *            description: server error                               
 */




noteRouter.patch("/patch/:id", async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const loginid = payload.user;
  const datapresentindb = await NoteModel.findOne({ _id: id });
  const idfromdb = datapresentindb.user;

  try {
    console.log(loginid);
    console.log(idfromdb);
    if (loginid != idfromdb) {
      res.send({ msg: "You are not authorized." });
    } else {
      await NoteModel.findByIdAndUpdate({ _id: id }, payload);

      res.send({ msg: `Note with id: ${id} has been updated` });
    }
  } catch (err) {
    console.log(err.message);
  }
});


/**
 * @swagger
 * /notes/delete/{id}:
 *  delete:
 *    summary: This is to delete the notes of the database.
 *    tags: [Notes]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id 
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/notes"
 *    responses: 
 *      200:
 *        description: The user has been delete
 *        content:
 *          application/json:
 *            schema:
 *              $ref:"#/components/schemas/notes"
 *          500:
 *            description: server error                               
 */






noteRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const loginid = payload.user;
  const datapresentindb = await NoteModel.findOne({ _id: id });
  const idfromdb = datapresentindb.user;

  try {
    if (loginid != idfromdb) {
      res.send({ msg: "You are not authorized." });
    } else {
      await NoteModel.findByIdAndDelete({ _id: id });

      res.send({ msg: `Note with id: ${id} has been deleted` });
    }
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = {
  noteRouter,
};
