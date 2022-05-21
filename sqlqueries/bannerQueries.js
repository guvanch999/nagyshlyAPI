module.exports = {
    getbanners:"select * from banner;",
    setbanner:"insert into banner(url) values($1) returning *;",
    getbannerforcheck:"select * from banner where id=$1;",
    deletebanner:"delete from banner where id=$1 returning *;",
}