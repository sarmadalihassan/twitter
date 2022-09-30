const cloudinary = require("cloudinary").v2;
const fs = require('fs'); 
const config = require('config'); 

cloudinary.config({
  cloud_name: `${config.get('CDN.cloudName')}`,
  api_key: `${config.get('CDN.apiKey')}`,
  api_secret: `${config.get('CDN.apiSecret')}`
});

async function uploadToCloudinary(locaFilePath) {
  // locaFilePath :
  // path of image which was just uploaded to "uploads" folder
  var mainFolderName = "twitter";
  var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;
  // filePathOnCloudinary :
  // path of image we want when it is uploded to cloudinary
  return cloudinary.uploader
    .upload(locaFilePath, { public_id: filePathOnCloudinary })
    .then(result => {
      // Image has been successfully uploaded on cloudinary
      // So we dont need local image file anymore
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);

      return {
        message: "Success",
        url: result.url
      };
    })
    .catch(error => {
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);
      return { message: "Fail", error};
    });
}

module.exports = {
    cloudinary,
    uploadToCloudinary
};
