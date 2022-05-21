module.exports={
      INSERTNEWADDRESS:"INSERT INTO address(user_id,adress) VALUES($1,$2) returning *;",
      GETADRESESOFUSER:"SELECT id,adress FROM address where user_id=$1;",
      UPDATEADRESS:"UPDATE address set adress=$2 where id=$1;",
      DELETEADRESS:"delete from address where id=$1;",
      GETFORCHECK:"select * from address where id=$1;",
}
