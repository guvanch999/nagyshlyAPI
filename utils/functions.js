const fs=require('fs');
let deleteServerFilePath=async (path,leng)=>{
      try{

      console.log(leng, path);
      let filePath=leng>0?path.substr(leng):path;
      console.log(filePath);
      await fs.unlinkSync(filePath);

      return true;
      }catch(err){
            console.log(err);
            return false;
      }
}
let verifieproductbody=(req)=>{
      let catID=req.body.cat_id;
      let sub_id=req.body.sub_id;
      let  name=req.body.name;
      let nameRU=req.body.nameRU;
      let about=req.body.about;
      let aboutRU=req.body.aboutRU;
      let price=req.body.price;
      let discount=req.body.discount;
      let new_price=req.body.new_price;
      let stock=req.body.stock;
      if(!catID||!sub_id||!name||!nameRU||!about||
            !aboutRU||!price||stock===undefined){
            return false;
      }
      if(isNaN(parseInt(new_price)))new_price=price;
      if(parseInt(new_price)===0)new_price=price
      if(isNaN(parseInt(discount)))discount=0
      return [catID,sub_id,name,nameRU,about,aboutRU,price,new_price,discount,stock];

}
let verifieupdatebody=(req)=>{
      const catID=req.body.category_id;
      const tkm_name=req.body.tm_name;
      const rus_name=req.body.ru_name;
      const tm_about=req.body.tm_about;
      const ru_about=req.body.ru_about;
      const countinstock=req.body.countinstock;
      const price=req.body.price;
      const discount=req.body.discount;
      const new_price=req.body.new_price;
      let stock=req.body.stock;
      if(!catID||!tkm_name||!rus_name||!tm_about||
            !ru_about||!countinstock||!price||discount===undefined||new_price===undefined||stock===undefined){
            return false;
      }
      return [req.params.id,catID,tkm_name,rus_name,tm_about,ru_about,countinstock,price,discount,new_price,stock];

}
let verifieOrderBody=(req)=>{
      let {adress,jemibaha,eltipberme,arzanladys,sonkybaha}=req.body;

      if(!adress || jemibaha===undefined || eltipberme===undefined || arzanladys===undefined || sonkybaha===undefined){
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
