const router=require('express').Router();
const controller=require('../controllers/adminlogin');
const auth=require('../midlewares/authwithtocken');

router.post('/login',controller.checklogin);
router.post('/adminusers',controller.getusers);
router.delete('/adminusers/:id',controller.deleteuser);
router.get('/habarlashmak',controller.getaboutdelails);
router.get('/rules',controller.rules);
router.get('/get-full-details',controller.getFullDetails);
//contuct us details
router.get('/contactusdetails',controller.contactusdetails);
router.put('/contactusdetails',controller.updatecontactdetails);
//usage rules
router.get('/rulesforadmin',controller.getadminrules);
router.put('/rulesforadmin/:id',controller.updaterule);
router.post('/rulesforadmin',controller.createrule);
router.delete('/rulesforadmin/:id',controller.deleterule);

router.post('/registersmsapp',controller.registersmsap);

router.get('/counts',controller.getcounts);
router.put('/psettings',controller.setprodsettings);
router.post('/changedatas',controller.changePass);
router.get('/admin-data',controller.getAdminData);
router.put('/admin-data',controller.updateAdminData);
module.exports=router;

