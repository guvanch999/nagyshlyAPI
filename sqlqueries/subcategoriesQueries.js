module.exports={
    INSERTCATEGORY:"insert into sub(cat_id,name,nameRU) values ($1,$2,$3) returning *;",
    SELECTALL:"SELECT s.*,c.name as categoryName, c.nameRU as categoryNameRU from sub s inner join cat c on c.id=s.cat_id where s.cat_id=$1 order by id asc;",
    SELECTALLSUBCATEGORIES:"SELECT s.*,c.name as categoryName, c.nameRU as categoryNameRU from sub s inner join cat c on c.id=s.cat_id order by id asc;",
    SELECTBYID:"SELECT * from cat where id=$1;",
    SELECTBYSEARCHTEXT:"SELECT * from cat where (upper(name) like upper('%'||$1||'%') or upper(nameRU) like upper('%'||$1||'%')) order by id asc;",
    UPDATECATEGORY:"UPDATE sub SET  name=$2, nameRU=$3,cat_id=$4 WHERE id=$1 returning *;",
    GETCATEGORYBYID:"SELECT * FROM  sub WHERE id=$1;",
    GETSUBCATEGORYBYID:"SELECT s.*,c.name as cat_name FROM  sub s inner join cat c on c.id=s.cat_id WHERE s.id=$1;",
    DELETECAT:"DELETE FROM cat WHERE id=$1 returning id;",
    DELSUBCATE:`delete from sub where id=$1`,
    GETPRODUCTIDS:"SELECT id from product where sub_id=$1;",
    GETCATEGORYDATASFORADMIN:"SELECT *  FROM cat order by id;",

}
