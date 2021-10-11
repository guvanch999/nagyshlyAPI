const sharp = require('sharp');

class Resize {
  
  constructor(takedfolder,takedfilename) {
    this.mainfolder="uploads";
    this.folder = takedfolder;
    this.filename=takedfilename;
    
    this.width=300;
    this.height=300;
  }
  
  async save(buffer) {
    
    const _filepath = this.fileURL();
    try{
    await sharp(buffer, { failOnError: false })
      .resize(this.width, this.height, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(_filepath);
    console.log("image saved");
    }
    catch(err){
        console.log(err);
    }
    return _filepath;
  }
  setparams(wth,ht){
    this.width=wth;
    this.height=ht;
  }
  filepath() {
    return this.mainfolder+"\\"+ this.folder+"\\"+this.filename;
  }
  fileURL(){
    return this.mainfolder+"/"+ this.folder+"/"+this.filename;
  }
}
module.exports = Resize;
