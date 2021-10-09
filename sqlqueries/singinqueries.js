module.exports={
      INSERTNEWNUMBER:"INSERT INTO verifications(number,ver_code,time,sms_sended) VALUES($1,$2,$3,$4);",
      GETALLVERIFICATIONS:"SELECT id,number,ver_code,sms_sended FROM verifications where sms_sended='0';",
      DELETEUPTIMEVERIF:"DELETE FROM verifications WHERE time < $1;",
      DELETENUMBER:"DELETE FROM verifications WHERE number=$1;",
      CHECKANDVERIFIE:"SELECT * FROM verifications WHERE number=$1;",
      CREATEUSER:"INSERT INTO users(tel_no,full_name,fcm_tocken,created_at) values($1,$2,$3,now()) returning *;",
      UPDATEUSER:"update users set full_name=$2, fcm_tocken=$3  where tel_no=$1 returning *;",
      SELECTQUERY:"SELECT * FROM users WHERE tel_no=$1;",
      MAKESENDEDSMS:"UPDATE verifications SET sms_sended='1' where id=$1;"
}