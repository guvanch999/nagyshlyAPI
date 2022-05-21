module.exports={
      INSERTCATEGORY:"insert into cat(image,name,nameRU) values ($1,$2,$3) returning *;",
      SELECTALL:"SELECT * from cat order by id asc;",
      SELECTBYID:"SELECT * from cat where id=$1;",
      SELECTBYSEARCHTEXT:"SELECT * from cat where (upper(name) like upper('%'||$1||'%') or upper(nameRU) like upper('%'||$1||'%')) order by id asc;",
      UPDATEWITHIMAGE:"UPDATE cat SET image=$2, name=$3, nameRU=$4 WHERE id=$1 returning *;",
      UPDATECATEGORY:"UPDATE cat SET  name=$2, nameRU=$3 WHERE id=$1 returning *;",
      GETCATEGORYBYID:"SELECT * FROM  cat WHERE id=$1;",
      DELETECAT:"DELETE FROM cat WHERE id=$1 returning id;",
      DELSUBCATE:`delete from sub where cat_id=$1`,

      GETPRODUCTIDS:"SELECT id from product where cat_id=$1;",
      GETCATEGORYDATASFORADMIN:"SELECT *  FROM cat order by id;",

}