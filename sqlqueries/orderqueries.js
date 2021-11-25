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
      GETPRODUCTSETTINGS:"SELECT * FROM psettings;",
      INSERTORDER:"INSERT INTO sargytlar(user_id,sene,adress,harytlar,eltip_berme,discount,total,status,created_at,isshown,peyment) VALUES($1,now(),$2,$3,$4,$5,$6,'0',now(),'0',$7) returning id;",
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
      getordersforadmin:"select s.*,u.tel_no,u.full_name from sargytlar as s  inner join users as u on u.id=s.user_id where  u.id=$1 limit $2 offset $3;",
      getorderproductsforadmin:"select s.*,d.size,c.tm_name as colorName, c.code as colorCode from sargytproductler as s inner join disqounts as d on d.id=s.pc_id inner join renkler as c on d.color_id=c.id where sargytlar_id=$1",
      changestatus:"update sargytlar set status=$2 where id=$1 returning *;",
      getforcheck:"select * from sargytlar where id=$1",
      getordercount:"select count(*) as count from sargytlar where  user_id=$1;",
      getallorders:(_sort,_filter)=>{
            var s="select s.*,u.tel_no,u.full_name from sargytlar as s  inner join users as u on u.id=s.user_id ";
            if(_filter!=-1){
                  s+=" where s.status like '"+_filter+"' ";
            }
            s+= " order by s.sene "+_sort+" limit $1 offset $2;"
            return s;
      },
      getcountofall:(_sort,_filter)=>{
            var s="select count(*) as count from sargytlar ";
            if(_filter!=-1){
                  s+=" where status like '"+_filter+"' ";
            }
            return s;
      },
      returnorder:"update disqounts d set discount=discount+(select s.sany from sargytproductler s where s.sargytlar_id=$1 and s.pc_id=d.id) where d.id in (select pc_id from sargytproductler where sargytlar_id=$1) returning * ;",
      getuser:"select * from users where id=$1;",
      makeisshown:"update sargytlar set isshown='1' where isshown='0'",
      getnotshown:"select count(*) as count from sargytlar where isshown='0';"
}
