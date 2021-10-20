const router=require('express').Router();
const controller=require('../controllers/adminlogin');
const auth=require('../midlewares/authwithtocken');

router.post('/login',controller.checklogin);
router.post('/adminusers',auth.VerifieToken,controller.getusers);
router.delete('/adminusers/:id',auth.VerifieToken,controller.deleteuser);
router.get('/habarlashmak',controller.getaboutdelails);
router.get('/rules',controller.rules);
//contuct us details
router.get('/contactusdetails',auth.VerifieToken,controller.contactusdetails);
router.put('/contactusdetails',auth.VerifieToken,controller.updatecontactdetails);
//usage rules
router.get('/rulesforadmin',auth.VerifieToken,controller.getadminrules);
router.put('/rulesforadmin/:id',auth.VerifieToken,controller.updaterule);
router.post('/rulesforadmin',auth.VerifieToken,controller.createrule);
router.delete('/rulesforadmin/:id',auth.VerifieToken,controller.deleterule);

router.post('/registersmsapp',controller.registersmsap);

router.get('/counts',controller.getcounts);
router.put('/psettings',controller.setprodsettings);
module.exports=router;

