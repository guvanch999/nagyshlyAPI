module.exports = {
      GETALLPRODUCTS: (name) => {
            return "SELECT  p.id,p.image_url,p.tm_name,p.ru_name,p.countinstock, " +
                  "p.price,p.discount,p.new_price " +
                  "FROM products as p  " +
                  "INNER JOIN categoriyalar as c on c.id=p.category_id and c.id=$1 and p.countinstock>0 limit 10 offset $2;";
      },
      GETALLDISQOUNTPROD: "SELECT  p.id,p.image_url,p.tm_name,p.ru_name,p.countinstock, " +
                "p.price,p.discount,p.new_price " +
                "FROM products as p  " +
                "INNER JOIN categoriyalar as c on c.id=p.category_id and p.discount>0 and p.countinstock>0 limit 10 offset $1;"
      ,
      GETFAVORITEPRODUCTS: (ids) => {
            return "SELECT  p.id,p.image_url,p.tm_name,p.ru_name,p.countinstock, " +
                  "p.price,p.discount,p.new_price " +
                  "FROM products as p  " +
                  "INNER JOIN categoriyalar as c on c.id=p.category_id and p.id in (" + ids.join(',') + ") and p.countinstock>0 limit 10 offset $1;";
      },
      GETBYSEARHTEXT: "SELECT  p.id,p.image_url,p.tm_name,p.ru_name,p.countinstock, " +
            "p.price,p.discount,p.new_price " +
            "FROM products as p  " +
            "INNER JOIN categoriyalar as c on c.id=p.category_id and p.countinstock>0 where (upper(p.tm_name) like upper('%'||$1||'%') or upper(p.ru_name) like upper('%'||$1||'%')) limit 10 offset $2;",
      GETPRODUCTBYID: (name) => {
            return "SELECT  p." + name + "_about as description " +
                  "FROM products as p  " +
                  "INNER JOIN categoriyalar as c on c.id=p.category_id  where p.id=$1;";
      },
      GETPRODUCTIMAGES: "SELECT url FROM productimages where prod_id=$1;",
      GETPRODUCTCOLORS: (name) => {
            return "SELECT  RR.id ,RR." + name + "_name as name,RR.code,CC.image_url FROM disqounts AS CC INNER JOIN renkler AS RR on RR.id=CC.color_id and CC.prod_id=$1;";
      },
      // DISTINCT ON  (RR.id)
      GETSORTPRODUCTS: function (filterdata, sortparam) {
            // console.log(filterdata);
            var s = "SELECT  p.id,p.image_url,p.tm_name,p.ru_name,p.countinstock, " +
                  "p.price,p.discount,p.new_price " +
                  "FROM products as p  " +
                  "INNER JOIN categoriyalar as c on c.id=p.category_id where c.id=$1  ";
            if (filterdata.isactive) {
                  s += " and (select count(*) from disqounts as dis where ";
                  if (filterdata.color_ids.length > 0)
                        s += " dis.color_id in (" + filterdata.color_ids.join(',') + ")  and ";
                  if (filterdata.sizelist.length > 0) {
                        s+=" dis.size in ("
                        for (var i = 0; i < filterdata.sizelist.length; i++)s += "'" + filterdata.sizelist[i] + "',";
                        s = s.substr(0, s.length - 1);
                        s += ") and ";
                  }
                  s += " dis.prod_id=p.id)>0 ";
                  s += " and p.new_price<=" + filterdata.maxprice + " and p.new_price>=" + filterdata.minprice + " ";
            }
            if (sortparam === '1') s += " order by  p.new_price asc ";
            if (sortparam === '2') s += " order by  p.new_price desc ";
            if (sortparam === '3') s += " order by  p.id desc ";
            s += " limit 10 offset $2;";
            //console.log(s);
            return s;
      },
      GETPRODUCTIDS: "SELECT id FROM products WHERE category_id=$1",
      GETMINANDMAXPRICE: "SELECT MIN(price) AS MINPRICE, MAX(price) AS MAXPRICE FROM products where category_id=$1;",
      GETSIZES: (arrayids) => {
            return "SELECT DISTINCT on (size) size FROM disqounts WHERE prod_id IN (" + arrayids.join(',') + ")";
      },
      GETCOLORS: (name, arrayids) => {
            return "SELECT DISTINCT ON (RR.id) RR.id ,RR." + name + "_name as name,RR.code,CC.image_url FROM disqounts AS CC INNER JOIN renkler AS RR on RR.id=CC.color_id and CC.prod_id in (" + arrayids.join(',') + ");";
      },


      //admin functions
      INSERTPRODUCT: "INSERT INTO products(category_id,image_url,tm_name,ru_name,tm_about,ru_about,price,discount,new_price,created_at) " +
            " values ($1,$9,$2,$3,$4,$5,$6,$7,$8,now()) returning id;",
      DELETEPRODUCTIMAGE: "DELETE FROM productimages  WHERE id=$1;",
      DELETEPRODUCT: "DELETE FROM products WHERE id=$1;",
      INSERTPRODUCTIMAGE: "INSERT INTO productimages(prod_id,url) values ($1,$2);",
      GETFORCHECK: "SELECT * FROM products WHERE id=$1;",
      DELETEALLPRODUCTIMAGE: "DELETE FROM productimages  WHERE prod_id=$1;",
      DELETEPRODUCTDISCOUNTS: "DELETE FROM disqounts WHERE prod_id=$1;",
      INSERTPRODUCTDISCOUNTS: "INSERT INTO disqounts(prod_id,color_id,size,discount,image_url) VALUES($1,$2,$3,$4,$5);",
      GETPRODUCTDISCOUNTBYID: "SELECT * FROM disqounts WHERE id=$1",
      DELETEPRODUCTDISCOUNTSBYID: "DELETE FROM disqounts WHERE id=$1 returning prod_id;",


      UPDATEPRODUCT: "UPDATE products SET category_id=$1,image_url=$9,tm_name=$2,ru_name=$3,tm_about=$4,ru_about=$5,price=$6,discount=$7,new_price=$8 WHERE id=$10;",


      SELECTBYIDS: (numbers, name) => {
            return "SELECT  p.id,c." + name + "_name as catname,p.image_url,p." + name + "_name as productname,p." + name + "_about,p.countinstock, " +
                  "p.price,p.discount,p.new_price,p.created_at " +
                  "FROM products as p  " +
                  "INNER JOIN categoriyalar as c on c.id=p.category_id WHERE p.id in (" + numbers.join(',') + ");";
      },


      GETPRODUCTIMAGEBYID: "SELECT * FROM productimages WHERE id=$1;",

      GETPRODUCTIMAGEDATAS: "SELECT * FROM productimages where prod_id=$1;",

      GETSEARCHTEXTPRODUCTS: (name, searchtext) => {
            return "SELECT  p.id,c." + name + "_name as catname,p.image_url,p." + name + "_name as productname,p.countinstock, " +
                  "p.price,p.discount,p.new_price " +
                  "FROM products as p  " +
                  "INNER JOIN categoriyalar as c on c.id=p.category_id   WHERE p." + name + "_name like '%" + searchtext + "%' ;";
      },
      INSERTPRODUCTCOUNT: "INSERT INTO disqounts(prod_id,color_id,strsize_id,sansize_id,discount) VALUES($1,$2,$3,$4,$5) returning id;",
      GETPRODUCTSFORADMIN: "SELECT p.*,c.tm_name as cat_tm_name,c.ru_name as cat_ru_name FROM products as p inner join categoriyalar as c on c.id=p.category_id and  (upper(p.tm_name) like  upper('%'||$3||'%') or upper(p.tm_about) like  upper('%'||$4||'%')) order by p.id limit $1 offset $2 ;",
      GETPRODUCTSFORADMINBYCATID: "SELECT p.*,c.tm_name as cat_tm_name,c.ru_name as cat_ru_name FROM products as p inner join categoriyalar as c on c.id=p.category_id and  (upper(p.tm_name) like upper('%'||$4||'%') or upper(p.tm_about) like upper('%'||$5||'%'))  where p.category_id=$3 order by p.id limit $1 offset $2 ;",
      GETPRODUCTCOUNT: "Select count(*) as count from products where  (upper(tm_name) like upper('%'||$1||'%') or upper(tm_about) like upper('%'||$2||'%'));",
      GETPRODUCTCOUNTBYID: "Select count(*) as count from products where category_id=$1 and  (upper(tm_name) like upper('%'||$2||'%') or upper(tm_about) like upper('%'||$3||'%')) ;",
      GETPRODUCT: "SELECT p.*,c.tm_name as cat_tm_name,c.ru_name as cat_ru_name,c.image_url as cat_image_url FROM products as p inner join categoriyalar as c on c.id=p.category_id and p.id=$1;",
      GETPRODUCTIMAGES: "SELECT * FROM productimages where prod_id=$1",
      GETPRODYCTDISCOUNTS: "SELECT d.*,r.tm_name,r.code FROM disqounts as d inner join renkler as r on r.id=d.color_id where prod_id=$1",
      CHACKCOUNT: "SELECT * FROM disqounts where id=$1;",
      UPDATEDISCOUNT: "update disqounts set discount=$2, image_url=$3 where id=$1 returning *;",
      ROUNDCOUNT: "UPDATE products set countinstock=(select sum(discount) from disqounts where prod_id=$2) where id = $1;"
}