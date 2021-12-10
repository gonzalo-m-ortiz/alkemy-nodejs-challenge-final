const path = require('path');
const multer = require('multer');
const { AppError } = require('../errorsManagment');

const getSingleImage = (keyName, localFolder) => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if (!localFolder)
                localFolder = req.params.localFolder;
            cb(null, `${__dirname}/../../../public${localFolder}`); // '/tmp/my-uploads'
        },
        filename: (req, file, cb) => {
            // adding random numbers to file name
            let {name,ext} = path.parse(file.originalname);
            name = name.replace(' ', '_');
            const uniqueSuffix = Math.round(Math.random() * 1E9);
            const finalName = name + '-' + uniqueSuffix + ext;
            cb(null, finalName);
        },
    });
    
    const limits = {
        fileSize: 3000000, // 3Mb
        files: 1,
    };

    const fileFilter = (req, file, cb) => {
        const acceptedFiles = ['image/gif', 'image/jpeg', 'image/png'];
        if (acceptedFiles.includes(file.mimetype)) 
            cb(null, true);
        else 
            cb(null, false);
    };

    const uploadImage = multer({ 
        storage,
        limits,
        fileFilter
    });

    const upload = uploadImage.single(keyName);

    return middleware = (req, res, next) => {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                next(new AppError(err.message, 400));
            } else if (err) {
                next(new AppError(err.message, 400));
            } else {
                if (req.file) {
                    req.body.localFolder = localFolder? localFolder : req.params.localFolder;
                    req.body.fileName = req.file.filename;
                }
                next();
            }
        });
    };
}

module.exports = {
    getSingleImage,

};