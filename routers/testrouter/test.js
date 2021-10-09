const router=require('express').Router();
const controller=require('../../controllers/testcontroller/testcontroller');
const upload=require('../../midlewares/uploadmiddl');
const sharp=require('sharp');
const Resize = require('../../midlewares/Resize');
const fs=require('fs');

router.get('/',controller.testgetrequest);
router .post('/uploadeFile', upload.single('myfile'), async (req,res,next)=>{
      const imagePath = 'uploads';
      
      if (!req.file) {
       return  res.status(401).json({error: 'Please provide an image'});
      }
      const fileUpload = new Resize(imagePath,Date.now()+"-"+req.file.originalname);
      const filename = await fileUpload.save(req.file.buffer);
      console.log(req.protocol + '://' + req.get('host')+"/"+fileUpload.fileURL());
      return res.status(200).json({ name: filename });
});

module.exports=router;