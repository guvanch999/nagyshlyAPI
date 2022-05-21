const router=require('express').Router();
const controller=require('../controllers/categories');
const upload=require('../midlewares/uploadmiddl');
const auth=require('../midlewares/authwithtocken');

router.post('/category',upload.single('image') ,controller.addcategory);
router.get('/category',controller.getAllCategories);
router.put('/category',upload.single('image'),controller.updateCategory);
router.get('/getallcategoriesforadmin',controller.getcategoriesadmin);
router.delete('/category/:id',controller.deleteCategory);
router.get('/category/:id',controller.getCategoryByID);
router.post('/category/searchtext',controller.searchcategrory);

module.exports=router;
