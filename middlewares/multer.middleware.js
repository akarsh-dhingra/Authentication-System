import multer from "multer";
import path from "path";

// diskStorage() accepts an options object with two functions:
// destination:Defines the folder where uploaded files are saved.
// filename:Defines the stored file name.
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/temp');
    },
    filename:(req,file,cb)=>{
        cb(null,'',file.fieldname);
    }
});

const upload=multer({storage});
export default upload;