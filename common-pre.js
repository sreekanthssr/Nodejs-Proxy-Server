function commonPre(options, req){
  console.log('Common pre',options);
  options['commonPre'] = "sdfksdf";
  return options;
}

function commonPost(req, res, updatedMSResponse){
  console.log('commonPost', updatedMSResponse);
  updatedMSResponse['commonPost'] = "adasdas";
  return updatedMSResponse;
}

function APIcommonPre(options, req){
  console.log('API Common pre',options );
  options['APIcommonPre'] = "APIcommonPredddddd";
  return options;
}

function APIcommonPost(req, res, updatedMSResponse){
  console.log('APIcommonPost',updatedMSResponse);

  updatedMSResponse['APIcommonPost'] = "APIcommonPostc";
  return updatedMSResponse;
}

export {APIcommonPost,APIcommonPre,commonPost,commonPre}