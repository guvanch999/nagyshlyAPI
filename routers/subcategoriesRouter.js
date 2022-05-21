const router=require('express').Router();
const controller=require('../controllers/subcaregoriesController');
const upload=require('../midlewares/uploadmiddl');
const auth=require('../midlewares/authwithtocken');

router.post('/add-sub', controller.addcategory);
router.get('/get-subs/:cat_id',controller.getAllCategories);
router.get('/get-all',controller.getAllSubcategories);
router.put('/update-sub',controller.updateCategory);
router.delete('/remove-sub/:id',controller.deleteCategory);
// router.get('/:id',controller.getCategoryByID);
router.post('/searchtext',controller.searchcategrory);

module.exports=router;
