const test=require('./testrouter/test');
const categories=require('./categories');
const colorRouter=require('./colorrouter');
const productsRouter=require('./products');
const singin=require('./singinrouter');
const adresrouter=require('./adressrouter');
const orderrouter=require('./ordersrouter');
const adminloginrouterr=require('./adminloginrouter');
module.exports=(app)=>
{
app.use("/",test);
app.use("/api/v1/categories",categories);
app.use('/api/v1/colors',colorRouter);
app.use('/api/v1/products',productsRouter);
app.use('/api/v1/singin',singin);
app.use('/api/v1/adress',adresrouter);
app.use('/api/v1/orders',orderrouter);
app.use('/api/v1/admin',adminloginrouterr);

app.use((error,req,res,next)=>{
  console.log(error);
  const status=error.statusCode||500;
  const message=error.message;
  res.status(status).json({message:message});

});

return app;
}