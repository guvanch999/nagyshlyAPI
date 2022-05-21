module.exports = {
    GETALLPRODUCTS: (sub_id) => `select p.*,c.name as categoryName,c.nameRU as categoryNameRu,s.name as subcategoryName, s.nameRU as subcategoryNameRU from product p inner join cat c on c.id=p.cat_id inner join sub s on s.id=p.sub_id where p.cat_id=$1 ${sub_id>0?' and p.sub_id='+sub_id:''} limit 20 offset $2;`,
    GETALLDISQOUNTPROD: "SELECT  p.id,p.image_url,p.tm_name,p.ru_name,p.countinstock, " +
        "p.price,p.discount,p.new_price " +
        "FROM products as p  " +
        "INNER JOIN cat as c on c.id=p.cat_id and p.discount>0 and p.countinstock>0 limit 10 offset $1;"
    ,
    GETFAVORITEPRODUCTS: (ids) => {
        return `select p.*,c.name as categoryName,c.nameRU as categoryNameRu,s.name as subcategoryName, s.nameRU as subcategoryNameRU from product p inner join cat c on c.id=p.cat_id inner join sub s on s.id=p.sub_id where p.id in (${ids.join(',')}) ;`
    },
    GETBYSEARHTEXT: `select p.*,c.name as categoryName,c.nameRU as categoryNameRu,s.name as subcategoryName, s.nameRU as subcategoryNameRU from product p inner join cat c on c.id=p.cat_id inner join sub s on s.id=p.sub_id where (upper(concat(p.name,' ',p.nameRU,' ',c.name,' ',c.nameRU,' ',s.name,' ',s.nameRU)) like upper('%'||$1||'%')  limit 10 offset $2;`,
    GETPRODUCTIMAGES: "SELECT url FROM file where product_id=$1 and type='IMAGE';",
    GETFILESFORDELETE: "SELECT * FROM file where product_id=$1",
    GETPRODUCTIMAGEFiles: "SELECT url FROM file where product_id=$1;",
    GETPRODUCTFiles: "SELECT url FROM file where product_id=$1 and type='FILE';",
    GETPRODUCTCOLORS: (name) => {
        return "SELECT  RR.id ,RR." + name + "_name as name,RR.code,CC.image_url FROM disqounts AS CC INNER JOIN renkler AS RR on RR.id=CC.color_id and CC.prod_id=$1;";
    },
    // DISTINCT ON  (RR.id)
    GETSORTPRODUCTS: function (filterdata, sortparam, category_id, sub_id) {
        var s = "SELECT   p.*,c.name as catname,c.nameRU as catnameRU,s.name as subcategoryName, s.nameRU as subcategorynNameRU " +
            "FROM product as p  " +
            "INNER JOIN cat as c on c.id=p.cat_id  " +
            "inner join sub s on s.id=p.sub_id ";
        if (category_id > 0) {
            s += " where c.id=" + category_id + " ";
            s += sub_id ? ` and p.sub_id=${sub_id} ` : ''
        }
        if (sortparam === '1') s += " order by  p.price asc ";
        if (sortparam === '2') s += " order by  p.price desc ";
        if (sortparam === '3') s += " order by  p.id desc ";
        s += " limit 10 offset $1;";
        return s;
    },
    GETPRODUCTIDS: function (cid) {
        var s = "SELECT id FROM products WHERE ";
        if (cid > 0) s += " category_id=" + cid; else s += " discount>0;";
        return s;
    },
    GETMINANDMAXPRICE: function (cid) {
        var s = "SELECT MIN(price) AS MINPRICE, MAX(price) AS MAXPRICE FROM products where ";
        if (cid > 0) s += " category_id=" + cid; else s += " discount>0;";
        return s;
    },
    GETSIZES: (arrayids) => {
        return "SELECT DISTINCT on (size) size FROM disqounts WHERE prod_id IN (" + arrayids.join(',') + ")";
    },
    GETCOLORS: (name, arrayids) => {
        return "SELECT DISTINCT ON (RR.id) RR.id ,RR." + name + "_name as name,RR.code,CC.image_url FROM disqounts AS CC INNER JOIN renkler AS RR on RR.id=CC.color_id and CC.prod_id in (" + arrayids.join(',') + ");";
    },


    //admin functions
    INSERTPRODUCT: "INSERT INTO product(cat_id,sub_id,name,nameRU,about,aboutRU,oldprice,price,discount,stock,imagetmb) " +
        " values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning *;",
    DELETEPRODUCTIMAGE: "DELETE FROM file  WHERE id=$1;",
    DELETEPRODUCT: "DELETE FROM product WHERE id=$1;",
    INSERTPRODUCTIMAGE: "INSERT INTO file(type,name,url,product_id) values ('IMAGE','image',$1  ,$2) returning *;",
    INSERTPRODUCTFILE: "INSERT INTO file(type,name,url,product_id) values ('FILE', $3, $1, $2) returning *;",
    GETFORCHECK: "SELECT * FROM product WHERE id=$1;",
    GETFORCHECKFILE: "SELECT * FROM file WHERE id=$1;",
    DELETEALLPRODUCTIMAGE: "DELETE FROM file  WHERE product_id=$1;",
    DELETEPRODUCTDISCOUNTS: "DELETE FROM disqounts WHERE prod_id=$1;",
    INSERTPRODUCTDISCOUNTS: "INSERT INTO disqounts(prod_id,color_id,size,discount,image_url) VALUES($1,$2,$3,$4,$5);",
    GETPRODUCTDISCOUNTBYID: "SELECT * FROM disqounts WHERE id=$1",
    DELETEPRODUCTDISCOUNTSBYID: "DELETE FROM disqounts WHERE id=$1 returning prod_id;",


    UPDATEPRODUCT: "UPDATE product SET cat_id=$1,sub_id=$2,name=$3,nameRU=$4,about=$5,aboutRU=$6,oldprice=$7,price=$8,discount=$9,stock=$10,imagetmb=$11 WHERE id=$12 returning *;",


    SELECTBYIDS: (numbers, name) => {
        return "SELECT  p.id,c." + name + "_name as catname,p.image_url,p." + name + "_name as productname,p." + name + "_about,p.countinstock, " +
            "p.price,p.discount,p.new_price,p.created_at " +
            "FROM products as p  " +
            "INNER JOIN categoriyalar as c on c.id=p.category_id WHERE p.id in (" + numbers.join(',') + ");";
    },
    GETPRODUCTIMAGEBYID: "SELECT * FROM file WHERE id=$1;",

    GETPRODUCTIMAGEDATAS: "SELECT * FROM productimages where prod_id=$1;",

    GETSEARCHTEXTPRODUCTS: (name, searchtext) => {
        return "SELECT  p.id,c." + name + "_name as catname,p.image_url,p." + name + "_name as productname,p.countinstock, " +
            "p.price,p.discount,p.new_price " +
            "FROM products as p  " +
            "INNER JOIN categoriyalar as c on c.id=p.category_id   WHERE p." + name + "_name like '%" + searchtext + "%' ;";
    },
    INSERTPRODUCTCOUNT: "INSERT INTO disqounts(prod_id,color_id,strsize_id,sansize_id,discount) VALUES($1,$2,$3,$4,$5) returning id;",
    GETPRODUCTSFORADMIN: "SELECT p.*,c.name as cat_name,c.nameRU as cat_nameRU,s.name as subName,s.nameRU as subNameRU FROM product as p inner join cat as c on c.id=p.cat_id inner join sub s on s.id=p.sub_id where  (upper(p.name) like  upper('%'||$1||'%') or upper(p.about) like  upper('%'||$2||'%')) ",
    GETPRODUCTSFORADMINBYCATID: "SELECT p.*,c.name as cat_name,c.nameRU as cat_nameRU,s.name as subName,s.nameRU as subNameRU FROM products as p inner join cat as c on c.id=p.cat_id inner join sub s on s.id=p.sub_id  where  (upper(p.name) like upper('%'||$1||'%') or upper(p.about) like upper('%'||$2||'%'))  where p.cat_id=$3 order by p.id ;",
    GETPRODUCTCOUNT: "Select count(*) as count from product where  (upper(name) like upper('%'||$1||'%') or upper(about) like upper('%'||$2||'%'));",
    GETPRODUCTCOUNTBYID: "Select count(*) as count from product where cat_id=$1 and  (upper(name) like upper('%'||$2||'%') or upper(about) like upper('%'||$3||'%')) ;",
    GETPRODUCT: "SELECT p.*,c.name as catName,c.name as catNameRU,s.name as subName,s.nameRU as subNameRU,c.image as cat_image FROM product as p inner join cat as c on c.id=p.cat_id inner join sub s on s.id=p.sub_id where p.id=$1;",
    GETPRODYCTDISCOUNTS: "SELECT d.*,r.tm_name,r.code FROM disqounts as d inner join renkler as r on r.id=d.color_id where prod_id=$1",
    CHACKCOUNT: "SELECT * FROM disqounts where id=$1;",
    UPDATEDISCOUNT: "update disqounts set discount=$2, image_url=$3 where id=$1 returning *;",
    ROUNDCOUNT: "UPDATE products set countinstock=(select sum(discount) from disqounts where prod_id=$2) where id = $1;",
    UPDATEPRODUCTFILEBYID:'update file set name=$2,url=$3 where id=$1 returning *'
}
