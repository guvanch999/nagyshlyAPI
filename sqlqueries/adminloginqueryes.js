module.exports={
      CHECKLOGIN:"SELECT * FROM admintables where username=$1 and password=$2;",
            GETUSERS:"SELECT * FROM users where (upper(fullname) like upper('%'||$1||'%') or upper(tel) like upper('%'||$2||'%'));",
      DELETEUSER:"delete from users where id=$1;",
      CHECKUSER:"SELECT * FROM users where id=$1;",
      CHECKADMIN:"SELECT * FROM admintables where id=$1;",
      GETUSERSCOUNT:"SELECT count(*) as count FROM users where (upper(full_name) like upper('%'||$1||'%') or upper(tel_no) like upper('%'||$2||'%')) and tel_no!='smsapp';",
      GETHABARLASHMAK:"select id,adress, tel as tel_no,email as mail from detail;",
      GETRULES:"select * from rules order by id;",
      getcontactusadmin:"select * from habarlashmak;",
      updatecuntactusdetails:"update habarlashmak set tm_adress=$1, ru_adress=$2, tel_no=$3, mail=$4 where id=1 returning *;",
      getallrulesforadmin:"select * from rules order by id;",
      updateruleadmin:"update rules set rule=$2, ruleru=$3 where id=$1 returning *;",
      getforcheck:"select * from rules where id=$1;",
      insertrule:"insert into rules(rule,ruleRU) values($1,$2) returning *;",
      deleterule:"delete from rules where id=$1 returning id;",
      registersmsapp:"update users set fcm_tocken=$1 where tel_no='smsapp'",
      getsmsapp:"select fcm_tocken from users where tel_no='smsapp';",
      createsmsapp:"insert into users(tel_no,fcm_tocken) values ('smsapp',$1);",
      countusers:"select count(*) as count from users where tel_no!='smsapp';",
      countproducts:"select count(*) as count from products;",
      countbanners:"select count(*) as count from banners;",
      countcategories:"select count(*) as count from categoriyalar;",
      updateprodsettegs:"update psettings set delprice=$1, discount=$2, maxshipingprice=$3 returning *;",
      CHANGEADMINDATAS:"update admintables set username=$1, password=$2;",
      UPDATE_STATIC_VAR:'update detail set elthyzmat=$1,jemiarzan=$2,adress=$3,tel=$4,email=$5 returning *'
}
