export default function APIcommonPre(options, req){
  console.log('API Common pre',options );
  options['APIcommonPre'] = "APIcommonPre";
  return options;
}