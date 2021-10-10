module.exports={
      SELECTPRODUCTS:(name,ids)=>{
            return "SELECT id,tm_name,ru_name,image_url, price, new_price from products where id in ("+ids.join(',')+") order by id asc;";
      },
      GETPRODUCTDICOUNTBYCOLORANDSIZE:(name)=>{
            return "SELECT CC.id ,CC.color_id,RR."+name+"_name as name,RR.code,CC.size,CC.discount as count FROM disqounts AS CC INNER JOIN renkler AS RR on RR.id=CC.color_id where CC.prod_id=$1 and CC.color_id=$2 and CC.size=$3;";
      },
      GETDEFAULTPRODUCT:(name)=>{
            return "SELECT CC.id,CC.color_id ,RR."+name+"_name as name,RR.code,CC.size,CC.discount as count FROM disqounts AS CC INNER JOIN renkler AS RR on RR.id=CC.color_id where CC.prod_id=$1 limit 1;";
      },
      GETPRODUCTSETTINGS:"SELECT delprice,discount FROM psettings;",
      INSERTORDER:"INSERT INTO sargytlar(user_id,sene,adress,harytlar,eltip_berme,discount,status,total,created_at) VALUES($1,now(),$2,$3,$4,$5,$6,'0',now()) returning id;",
      UPDATE:"UPDATE disqounts SET discount=discount-$2 WHERE id=$1 returning prod_id;",
      SELECTPRODUCTDETALS:"SELECT tm_name,ru_name,image_url,price,new_price FROM products where id=$1",
      INSERTPRODUCTTOORDERS:"insert into sargytproductler(sargytlar_id,tm_name,ru_name,old_price,new_price,sany,umage_url,pc_id) values($1,$2,$3,$4,$5,$6,$7,$8);",
      GETUSERSORDERS:"SELECT id,sene,total,status FROM sargytlar WHERE  user_id=$1;",
      GETORDERBYID:"SELECT id,sene,adress,harytlar as asyl,eltip_berme,discount,total FROM sargytlar WHERE  id=$1;",
      GETORDERPRODUCTS:(name)=>{
            return "select  id,"+name+"_name as name,old_price,new_price,sany,umage_url from  sargytproductler where sargytlar_id=$1";
      },
      DELETEORDERPRODUCTS:"DELETE FROM sargytproductler WHERE sargytlar_id=$1;",
      DELETEORDER:"DELETE FROM sargytlar WHERE  id=$1;",
      getordersforadmin:"select * from sargytlar where  user_id=$1 limit $2 offset $3;",
      getorderproductsforadmin:"select * from sargytproductler where sargytlar_id=$1",
      changestatus:"update sargytlar set status=$2 where id=$1 returning *;",
      getforcheck:"select * from sargytlar where id=$1",
      getordercount:"select count(*) as count from sargytlar where  user_id=$1;",
      getallorders:(_sort,_filter)=>{
            var s="select * from sargytlar ";
            //let statusarray= ["Garaşylýar", "Ýatyryldy", "Ýola düşdi", "Gowşuruldy"];
            if(_filter!=-1){
                  s+=" where status like '"+_filter+"' ";
            }
            s+= " order by sene "+_sort+" limit $1 offset $2;"
            //console.log(s);
            return s;
      },
      getcountofall:(_sort,_filter)=>{
            var s="select count(*) as count from sargytlar ";
            //let statusarray= ["Garaşylýar", "Ýatyryldy", "Ýola düşdi", "Gowşuruldy"];
            if(_filter!=-1){
                  s+=" where status like '"+_filter+"' ";
            }
            return s;
      },
      returnorder:"update disqounts d set discount=discount+(select s.sany from sargytproductler s where s.sargytlar_id=$1 and s.pc_id=d.id) where d.id in (select pc_id from sargytproductler where sargytlar_id=$1) returning * ;",
      getuser:"select * from users where id=$1;"
}