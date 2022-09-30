const cloudinary = require("cloudinary").v2;
const fs = require('fs'); 

cloudinary.config({
  cloud_name: "diojvu8jg",
  api_key: "889718377261386",
  api_secret: "l5ds1jqpxqFPvbWlVjpSj9JRNis"
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
