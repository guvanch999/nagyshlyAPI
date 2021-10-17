module.exports={
      INSERTCATEGORY:"insert into categoriyalar(image_url,tm_name,ru_name,created_at) values ($1,$2,$3,now()) returning *;",
      SELECTALL:(name)=>{
            return "SELECT id,image_url,"+name+" as name,created_at from categoriyalar order by id asc;"
      },
      SELECTBYSEARCHTEXT:(name)=>{
            return "SELECT id,image_url,"+name+"_name as name,created_at from categoriyalar where (upper(tm_name) like upper('%'||$1||'%') or upper(ru_name) like upper('%'||$1||'%')) order by id asc;"
      },
      UPDATEWITHIMAGE:"UPDATE categoriyalar SET image_url=$2, tm_name=$3, ru_name=$4 WHERE id=$1 returning *;",
      UPDATECATEGORY:"UPDATE categoriyalar SET  tm_name=$2, ru_name=$3 WHERE id=$1 returning *;",
      GETCATEGORYBYID:"SELECT * FROM  categoriyalar WHERE id=$1;",
      DELETECAT:"DELETE FROM categoriyalar WHERE id=$1 returning id;",
      SELECTBYID:(name)=>{
            return "SELECT id,image_url,"+name+",created_at from categoriyalar where id=$1;"
      },
      GETPRODUCTIDS:"SELECT id from products where category_id=$1;",
      DELETEALLPRODUCTIMAGE:(array)=>"DELETE FROM productimages  WHERE prod_id in ("+array.join(',')+") returning image_url;",
      DELETEPRODUCTDISCOUNTS:(array)=>"DELETE FROM disqounts WHERE prod_id in ("+array.join(',')+") returning image_url;",
      DELETEPRODUCT:(array)=>"DELETE FROM products WHERE id in ("+array.join(',')+") returning image_url;",
      GETCATEGORYDATASFORADMIN:"SELECT *  FROM categoriyalar order by id;",
      getbanners:"select * from banners;",
      setbanner:"insert into banners(image_url) values($1) returning *;",
      getbannerforcheck:"select * from banners where id=$1;",
      deletebanner:"delete from banners where id=$1 returning *;",
      selectskidsforuser:(lang)=>"select 0 as id,image_url,"+lang+"_name as name,'00.00.0000' as created_at from skidsettings;",
      getskidkapart:"select * from skidsettings;",
      updateskidkadata:"update skidsettings set tm_name=$1, ru_name=$2, image_url=$3 where id=1 returning *",
}