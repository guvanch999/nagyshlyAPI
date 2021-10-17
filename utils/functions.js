const fs=require('fs');
var deleteServerFilePath=async (path,leng)=>{
      try{
      
      console.log(leng, path);
      var filePath=leng>0?path.substr(leng):path;
      console.log(filePath);
      await fs.unlinkSync(filePath);
      
      return true;
      }catch(err){
            console.log(err);
            return false;
      } 
}
var verifieproductbody=(req)=>{
      var catID=req.body.category_id;
      var  tkm_name=req.body.tm_name;
      var rus_name=req.body.ru_name;
      var tm_about=req.body.tm_about;
      var ru_about=req.body.ru_about;
      var price=req.body.price;
      var discount=req.body.discount;
      var new_price=req.body.new_price;
      if(!catID||!tkm_name||!rus_name||!tm_about||
            !ru_about||!price||discount==undefined||new_price==undefined){
            return false;
      }
      if(new_price===0)new_price=price;
      return [catID,tkm_name,rus_name,tm_about,ru_about,price,discount,new_price];

}
var verifieupdatebody=(req)=>{
      const catID=req.body.category_id;
      const tkm_name=req.body.tm_name;
      const rus_name=req.body.ru_name;
      const tm_about=req.body.tm_about;
      const ru_about=req.body.ru_about;
      const countinstock=req.body.countinstock;
      const price=req.body.price;
      const discount=req.body.discount;
      const new_price=req.body.new_price;
      if(!catID||!tkm_name||!rus_name||!tm_about||
            !ru_about||!countinstock||!price||!discount||!new_price){
            return false;
      }
      return [req.params.id,catID,tkm_name,rus_name,tm_about,ru_about,countinstock,price,discount,new_price];

}
var verifieOrderBody=(req)=>{
      var {adress,jemibaha,eltipberme,arzanladys,sonkybaha}=req.body;

      if(!adress || jemibaha==undefined || eltipberme==undefined || arzanladys==undefined || sonkybaha==undefined){
            return false;
      } 
      return [adress,jemibaha,eltipberme,arzanladys,sonkybaha];
}

module.exports={
      deleteServerFilePath,
      verifieproductbody,
      verifieupdatebody,
      verifieOrderBody,
}