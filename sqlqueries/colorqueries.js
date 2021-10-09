module.exports={
      INSERTCOLOR:"insert into renkler(tm_name,ru_name,code,isdeleted) values ($1,$2,$3,'0') returning *;",
      SELECTALL:(name)=>{
            return "SELECT * from renkler where isdeleted='0' order by id asc;";
      },
      UPDATECOLOR:"UPDATE renkler SET tm_name=$2, ru_name=$3 WHERE id=$1 returning * ;",
      GETCOLORBYID:"SELECT * FROM  renkler WHERE id=$1;",
      DELETECOLORQUERY:"DELETE FROM renkler WHERE id=$1;",
      SELECTBYID:(name)=>{
            return "SELECT id,"+name+",code from renkler where id=$1;";
      },
      GETPRODUCTIDS:"select prod_id from disqounts where color_id=$1;",
      //DELETEDISCOUNTWITHCOLOR:"DELETE FROM disqounts WHERE color_id=$1;",
      MAKEDELETE:"update renkler set isdeleted='1' where id=$1;"
}