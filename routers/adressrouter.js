const router=require('express').Router();
const controller=require('../controllers/adresscontroller');
const autherication=require('../midlewares/authwithtocken');

router.post('/create',autherication.VerifieToken,controller.createadress);
router.get('/adreses', autherication.VerifieToken,controller.getUserAdresess);
router.put('/adres/:id',autherication.VerifieToken,controller.updateAdress);
router.delete('/adress/:id',autherication.VerifieToken,controller.deleteadress);
module.exports=router;