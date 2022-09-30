const multer = require('multer'); 
// const uuid = require('uuid'); 
// const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage }); 

// const getFileName = (name) => {
//   const unique = uuid.v4();
//   const ext = path.extname(name);
//   return unique + ext;
// };

module.exports = upload; 