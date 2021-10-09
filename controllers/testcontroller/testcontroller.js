testgetrequest=async function(req,res){

    res.contentType('application/json');
    res.json({message:'Your test api is worced!'});
    res.end();
}

module.exports={
    testgetrequest,
}