const router=require('express').Router();
const controller=require('../controllers/productcontroller');
const upload=require('../midlewares/uploadmiddl');
const auth=require('../midlewares/authwithtocken');




router.get('/categoryadsdsd/:id/:sub_id',controller.getallProducts);
router.get('/product/:id',controller.getProductByID);
router.post('/category/:cat_id/:sub_id/:sort_id',controller.getSortedProducts);
router.get('/filterparams/:cid',controller.getFilterParametres);
router.post('/favorits',controller.getFavorits);
router.post('/searchtext',controller.getbyseearchtext);
router.get('/bigimages/:id',controller.getBigImages);

//admin functions

router.post('/createproduct',upload.single('image'),controller.createProduct);
router.post('/updateproductdatas',upload.single('image'),controller.updateproductdatas);
router.post('/addproductimage',upload.single('image'), controller.addimagetoproduct);
router.post('/addproductfile',upload.single('image'), controller.addFileToProduct);
router.put('/updateproductfile',upload.single('image'),controller.updateProductFile)
router.delete('/productimage/:id',controller.deleteproductimage);
router.delete('/product/:id',controller.deleteProduct);
router.get('/admin',controller.getproductsadmin);
router.get('/adminproduct/:id',controller.getproducts);
router.get('/adminproductfiles/:id',controller.getProductIMAGES);

module.exports=router;
