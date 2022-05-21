module.exports={
      SELECTPRODUCTS:(ids)=>{
            return `SELECT * from product where id in (${ids.join(',')}) order by id asc;`;
      },
      GETPRODUCTDICOUNTBYCOLORANDSIZE:(name)=>{
            return "SELECT CC.id ,CC.color_id,RR."+name+"_name as name,RR.code,CC.size,CC.discount as count FROM disqounts AS CC INNER JOIN renkler AS RR on RR.id=CC.color_id where CC.prod_id=$1 and CC.color_id=$2 and CC.size=$3;";
      },
      GETDEFAULTPRODUCT:(name)=>{
            return "SELECT CC.id,CC.color_id ,RR."+name+"_name as name,RR.code,CC.size,CC.discount as count FROM disqounts AS CC INNER JOIN renkler AS RR on RR.id=CC.color_id where CC.prod_id=$1 limit 1;";
      },
      GETPRODUCTSETTINGS:"SELECT * FROM detail;",
      INSERTORDER:"INSERT INTO orders(user_id,sene,adress,harytlar,elt,arzan,jemi,peyment,status,isshown) VALUES($1,$8,$2,$3,$4,$5,$6,$7,'PENDING',0) returning id;",
      UPDATE:"UPDATE disqounts SET discount=discount-$2 WHERE id=$1 returning prod_id;",
      SELECTPRODUCTDETALS:"SELECT tm_name,ru_name,image_url,price,new_price FROM products where id=$1",
      INSERTPRODUCTTOORDERS:(products,orderId)=>{
            let s= "insert into orderproduct(order_id,product_id,count,price) values"
            products.forEach(el=>{
                  s+=`(${orderId},${el.id},${el.count},${el.price}),`
            })
            s=s.substr(0,s.length-1);
            console.log(s);
            return s;
      },
      GETUSERSORDERS:"SELECT * FROM orders WHERE  user_id=$1;",
      GETORDERBYID:"SELECT * FROM orders WHERE id=$1;",
      GETORDERPRODUCTS:"select p.*,o.count as  buyCount  from  orderproduct o inner join product p on p.id=o.product_id where order_id=$1",
      DELETEORDERPRODUCTS:"DELETE FROM orderproduct WHERE order_id=$1;",
      DELETEORDER:"DELETE FROM orders WHERE  id=$1;",
      getordersforadmin:"select s.*,u.tel,u.fullname from order as s  inner join users as u on u.id=s.user_id where u.id=$1 order by s.id limit $2 offset $3;",
      getorderproductsforadmin:"select p.*,c.name as cat_name,s.name as sub_name, o.count as  buyCount,o.price as buyPrice from orderproduct o inner join product p on p.id=o.product_id inner join cat c on c.id=p.cat_id inner join sub s on s.id=p.sub_id where o.order_id=$1",
      changestatus:"update orders set status=$2 where id=$1 returning *;",
      getforcheck:"select * from orders where id=$1",
      getordercount:"select count(*) as count from order where  user_id=$1;",
      getallorders:(_sort,_filter)=>{
            var s="select o.*,u.tel,u.fullname from orders as o  inner join users as u on u.id=o.user_id ";
            if(_filter!==-1){
                  s+=" where o.status like '"+_filter+"' ";
            }
            s+= " order by o.sene "+_sort+" limit $1 offset $2;"
            console.log(s);
            return s;
      },
      getcountofall:(_filter)=>{
            var s="select count(*) as sany  from orders ";
            if(_filter!==-1){
                  s+=" where status like '"+_filter+"' ";
            }
            return s;
      },
      getProductIds:`select product_id from orderproduct where order_id=$1;`,
      returnorder:(productIds)=>`update product p set stock=stock-(select o.count from orderproduct o where o.product_id=p.id and o.order_id=$1 limit 1) where id in (${productIds.join(',')})`,
      getuser:"select * from users where id=$1;",
      makeisshown:"update orders set isshown=1 where isshown=0",
      getnotshown:"select count(*) as count from orders where isshown=0;"
}
