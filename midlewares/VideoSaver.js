const fs=require('fs')
class Resize {
    constructor(takedfolder,takedfilename) {
        this.mainfolder="uploads";
        this.folder = takedfolder;
        this.filename=takedfilename;
    }
    async save(buffer) {

        const _filepath = this.fileURL();
        try{
            console.log('save')
             fs.createWriteStream(_filepath).write(buffer);
        }
        catch(err){
            console.log(err);
        }
        return _filepath;
    }
    fileURL(){
        return this.mainfolder+"/"+ this.folder+"/"+this.filename;
    }
}
module.exports = Resize;
