const router=require('express').Router();
const controller=require('../controllers/categories');
const upload=require('../midlewares/uploadmiddl');
const auth=require('../midlewares/authwithtocken');

router.get('/banners',controller.getbanners);
router.post('/banners',upload.single('bannerimage'),controller.addbanners);
router.delete('/banners/:id',controller.deletebanner);

router.put('/updateskiddatas',upload.single('updatedimage'),controller.updateskiddatas);

router.post('/', auth.VerifieToken, upload.single('categoryimage') ,controller.addcategory);
router.get('/',controller.getAllCategories);
router.put('/',auth.VerifieToken,upload.single('updatedimage'),controller.updateCategory);
router.get('/getallcategoriesforadmin',auth.VerifieToken,controller.getcategoriesadmin);
router.delete('/:id',auth.VerifieToken,controller.deleteCategory);
router.get('/:id',controller.getCategoryByID);
router.post('/searchtext',controller.searchcategrory);

module.exports=router;