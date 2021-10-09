const router=require('express').Router();
const controller=require('../controllers/colorcantroller');
const auth=require('../midlewares/authwithtocken');

router.get('/', auth.VerifieToken,controller.getAllColors);
router.get('/:id', auth.VerifieToken,controller.getColorByID);
router.post('/', auth.VerifieToken,controller.addColor);
router.put('/:id', auth.VerifieToken,controller.updateColor);
router.delete('/:id', auth.VerifieToken, controller.deleteColor);

module.exports=router;