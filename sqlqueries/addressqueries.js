module.exports={
      INSERTNEWADDRESS:"INSERT INTO adresler(user_id,adress) VALUES($1,$2) returning *;",
      GETADRESESOFUSER:"SELECT id,adress FROM adresler where user_id=$1;",
      UPDATEADRESS:"UPDATE adresler set adress=$2 where id=$1;",
      DELETEADRESS:"delete from adresler where id=$1;",
      GETFORCHECK:"select * from adresler where id=$1;"
}