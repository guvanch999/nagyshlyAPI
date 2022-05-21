const router=require('express').Router();
const controller=require('../controllers/bannerController');
const upload=require('../midlewares/uploadmiddl');

router.get('/banners',controller.getbanners);
router.post('/banners',upload.single('image'),controller.addbanners);
router.delete('/banners/:id',controller.deletebanner);

module.exports=router;