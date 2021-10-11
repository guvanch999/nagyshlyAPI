const router=require('express').Router();
const controller =require('../controllers/ordercontroller');
const auth=require('../midlewares/authwithtocken');

router.post('/checkproducts',auth.VerifieToken,controller.checkorders);
router.get('/productsettings',auth.VerifieToken,controller.getOrderSettings);
router.post('/makeorder',auth.VerifieToken,controller.makeOrder);
router.get('/all',auth.VerifieToken,controller.getOrders);
router.get('/byid/:id',auth.VerifieToken,controller.getorderbyid);
router.delete('/byid/:id',auth.VerifieToken,controller.deleteOrder);


//for admin
router.get('/orderforadmin/:id',auth.VerifieToken,controller.getadminorders);
router.get('/orderproductsforadmin/:id',auth.VerifieToken,controller.getorderproductsforadminaction);
router.post('/orderstatus/:id',auth.VerifieToken,controller.updatestatusaction);
router.get('/getallorders',auth.VerifieToken,controller.getalladminorders);
router.get('/getnotshownorders',controller.getnotshown);
module.exports=router;