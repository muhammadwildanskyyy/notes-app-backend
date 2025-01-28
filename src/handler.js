const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updateAt = createdAt;

  const newNotes = {
    title,
    tags,
    body,
    id,
    createdAt,
    updateAt,
  };
  notes.push(newNotes);
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    // console.log('succes');
    const response = h.response({
      status: 'success',
      message: 'Catatan Berhasil Ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan Gagal Ditemukan',
  });
  // console.log('nosucces');
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteById = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'succes',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'cacatan tidak ditemukan',
  });
  response.code(400);
  return response;
};

const editNoteByIdHandler = (request, h) =>{
  const id = request.params;

  const { title, tags, body } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = notes.filter((note)=>note.id===id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'succes', message : 'catatan berhasil perbarui'
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status : 'fail',
    message :'catatan gagal diperbarui'
  });

  response.code(404);
  return response;

};

const deleteNoteByIdHandler = (request, h) => {
  const id = request.params.id;
  const index = notes.findIndex((note) => note.id === id);
  console.log(id);
  console.log(index);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'catatan berhasil dihapus'
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteById,
  editNoteByIdHandler,
  deleteNoteByIdHandler
};