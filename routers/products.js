const router=require('express').Router();
const controller=require('../controllers/productcontroller');
const upload=require('../midlewares/uploadmiddl');
const auth=require('../midlewares/authwithtocken');




router.get('/category/:id',controller.getallProducts);
router.get('/product/:id',controller.getProductByID);
router.post('/sort/:cid/:sid',controller.getSortedProducts);
router.get('/filterparams/:cid',controller.getFilterParametres);
router.post('/favorits',controller.getFavorits);
router.post('/searchtext',controller.getbyseearchtext);

//admin functions
router.post('/createproduct',upload.single('productimage'),controller.createProduct);
router.post('/updateproductdatas',auth.VerifieToken,upload.single('productimage'),controller.updateproductdatas);
router.post('/addproductimage',upload.single('productimage'), controller.addimagetoproduct);
router.delete('/productimage/:id',auth.VerifieToken,controller.deleteproductimage);
router.delete('/product/:id',auth.VerifieToken,controller.deleteProduct);
router.post('/addproductdiscount',upload.single('productimage'),controller.addProductDiscount);
router.delete('/deleteproductdosqount/:id',auth.VerifieToken,controller.deleteProductDiscount);
router.get('/admin',auth.VerifieToken,controller.getproductsadmin);
router.get('/pages',auth.VerifieToken,controller.getproductpages);
router.get('/adminproduct/:id',auth.VerifieToken,controller.getproducts);
router.get('/adminproductimages/:id',auth.VerifieToken,controller.getProductIMAGES);
router.get('/admindisqounts/:id',auth.VerifieToken,controller.getProductdiscounts);
router.post('/updcount',auth.VerifieToken,upload.single('image'),controller.updateprodductcount);
module.exports=router;