export default function APIcommonPost(req, res, updatedMSResponse){
  //console.log('APIcommonPost',updatedMSResponse);

  updatedMSResponse['APIcommonPost'] = "APIcommonPost";
  return updatedMSResponse;
}