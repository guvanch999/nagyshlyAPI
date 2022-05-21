var fs = require('fs');
const pool=require('./db/db');



async function resetfunction(){
    await pool.query('select now()', async (err,result)=>{
        if(err){
            throw err;
        }
        try{
                var sql = await fs.readFileSync('migration.sql').toString();
                let queryes=sql.split(';');
                for(let i=0;i<queryes.length;i++) {
                    if(queryes[i].length) {
                        await pool.query(queryes[i], (err, rows) => {
                            if (err) {
                                console.log(err)
                                throw  err
                            }
                            console.log(queryes[i])
                       })
                    }
                }
        }catch (err){
            throw err;
        }

        console.log("database is ok");

    })
}

resetfunction();