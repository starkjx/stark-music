import $ from 'jquery'


export function getChannels(){
  $.getJSON('https://jirenguapi.applinzi.com/fm/getChannels.php')
  .done(function(ret){
    var channel= JSON.stringify(ret.channels[0])
    console.log(channel)
    returnData(channel)
  }).fail(function(){
    console.log('error');
  })
}


function returnData(data){
  console.log('return:', data)
  return data
}