module.exports={
      CHECKLOGIN:"SELECT * FROM admintables where username=$1 and password=$2;",
      GETUSERS:"SELECT * FROM users where (upper(full_name) like upper('%'||$1||'%') or upper(tel_no) like upper('%'||$2||'%')) limit $3 offset $4 ;",
      DELETEUSER:"delete from users where id=$1;",
      CHECKUSER:"SELECT * FROM users where id=$1;",
      CHECKADMIN:"SELECT * FROM admintables where id=$1;",
      GETUSERSCOUNT:"SELECT count(*) as count FROM users where (upper(full_name) like upper('%'||$1||'%') or upper(tel_no) like upper('%'||$2||'%'));",
      GETHABARLASHMAK:(name)=>{
            return "select id,"+name+"_adress as adress, tel_no, mail from habarlashmak;";
      },
      GETRULES:(name)=>{
            return "select id,"+name+"_rule as rule from ulanysh_dugunler order by id;";
      },
      getcontactusadmin:"select * from habarlashmak;",
      updatecuntactusdetails:"update habarlashmak set tm_adress=$1, ru_adress=$2, tel_no=$3, mail=$4 where id=1 returning *;",
      getallrulesforadmin:"select * from ulanysh_dugunler order by id;",
      updateruleadmin:"update ulanysh_dugunler set tm_rule=$2, ru_rule=$3 where id=$1 returning *;",
      getforcheck:"select * from ulanysh_dugunler where id=$1;",
      insertrule:"insert into ulanysh_dugunler(tm_rule,ru_rule) values($1,$2) returning *;",
      deleterule:"delete from ulanysh_dugunler where id=$1 returning id;",
      registersmsapp:"update users set fcm_tocken=$1 where tel_no='smsapp'",
      getsmsapp:"select fcm_tocken from users where tel_no='smsapp';",
      createsmsapp:"insert into users(tel_no,fcs_tocken) values ('smsapp',$1);"
}