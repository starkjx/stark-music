import React, { Component } from 'react';
import './App.css';
import 'normalize.css'
import './reset.css'
import $ from 'jquery'
import CoverItem from './CoverItem'
import Music from './Music'
//import {getChannels} from './DataJSON'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      channels: [],
      channelId: '',
      channelName: 'stark',
      isToButtom: false,
      isToStart: true,
      isLoadAnimate: false,
      song: [],
      lyric: {}
    }
    this.audio = new Audio()
    this.audio.autoplay = true
  }
  componentDidMount(){
    var _this =this
    $.getJSON('https://jirenguapi.applinzi.com/fm/getChannels.php')
    .done(function(ret){
      let stateCopy = JSON.parse(JSON.stringify(_this.state))
      stateCopy.channels = ret.channels
      _this.setState(stateCopy)
    })
    .fail(function(){
      console.log('error');
    })
  }
  clickLeft(){
    if(this.state.isLoadAnimate) return

    var coverWidth = $('footer').find('li').outerWidth(true);
    var rowCount = Math.floor($('footer').find('.layout').width() / coverWidth )
    if(!this.state.isToStart){
      this.setState({
        isLoadAnimate: true
      })
      $('footer ul').animate({
        left: '+=' + rowCount * coverWidth
      }, 400, ()=> {
        this.setState({
          isToButtom: false,
          isLoadAnimate: false
        })
        if(parseInt($('footer ul').css('left')) >= 0){
             this.setState({
               isToStart: true
             })
           }
      })
    }
  }
  clickRight(){
    if(this.state.isLoadAnimate) return

    var coverWidth = $('footer').find('li').outerWidth(true);
    var rowCount = Math.floor($('footer').find('.layout').width() / coverWidth )
    if(!this.state.isToButtom){
      this.setState({
        isLoadAnimate: true
      })
      $('footer ul').animate({
        left: '-=' + rowCount * coverWidth
      }, 400, ()=> {
        this.setState({
          isToStart: false,
          isLoadAnimate: false
        })
        if(parseInt($('footer .layout').width()) - parseInt($('footer ul').css('left'))
           > parseInt($('footer ul').css('width'))){
             this.setState({
               isToButtom: true
             })
           }
      })
    }
  }
  clickActive(event){
  
    var el = event.currentTarget
    var index = [].indexOf.call(el.parentElement.children, el)
    //console.log(this.state.channels[index].channel_id)
    var Id = this.state.channels[index].channel_id
    var Name = this.state.channels[index].name
    //console.log('Id: ' + Id)
    //console.log('Name:' + Name)
    $(el).addClass('active')
    .siblings().removeClass('active')
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.channelId = Id
    stateCopy.channelName = Name
    this.setState(stateCopy)
    this.playSong()
  }
  playSong(){
    var _this = this
    $.getJSON('https://jirenguapi.applinzi.com/fm/getSong.php',{channel: _this.state.channelId})
     .done(function(ret){
        //console.log(ret.song[0]);
        let stateCopy = JSON.parse(JSON.stringify(_this.state))
        stateCopy.song = ret.song[0]
        _this.setState(stateCopy)
        _this.audio.src = ret.song[0].url
        $('.music-panel figure').css('background-image', 'url(' + ret.song[0].picture + ')')
        $('.background').css('background-image','url(' + ret.song[0].picture + ')');
        //_this.play(ret.song[0]);
        _this.loadLyric(ret.song[0].sid)
    });
  }
  clickPlay(){
    var _this = this
    var $play = $('.btn-play')
    if($play.hasClass('icon-stop')){
      $play.removeClass('icon-stop').addClass('icon-play')
      _this.audio.pause()
    }else{
      $play.removeClass('icon-play').addClass('icon-stop')
      _this.audio.play()
    }
  }
  playNext(){
    this.playSong()
  }
  updateStatue(){
    var min = Math.floor(this.audio.currentTime/60);
    var sec = Math.floor(this.audio.currentTime%60) + '';
    sec = sec.length ===2? sec : '0' + sec;
    $('.detail .current-time').text(min + ':' + sec);
    $('.detail .bar-progress').css('width',this.audio.currentTime/this.audio.duration*100 + '%');
    var line = this.state.lyric['0' + min + ':' + sec]
    if(line){
      $('.detail .lyric p').text(line).boomText('rollIn');
    }
  }
  changeTime(e){
    var percent = (e.clientX - e.currentTarget.getBoundingClientRect().x) /
    parseInt(getComputedStyle(e.currentTarget).width)
    this.audio.currentTime = percent * this.audio.duration
  }
  loadLyric(sid){
    var _this = this
    $.getJSON('https://jirenguapi.applinzi.com/fm/getLyric.php',{sid: sid})
    .done(function(ret){
     //  console.log('lyric',ret);
     //  var lyric = ret.lyric;
      var lyricObj = {};
     ret.lyric.split('\n').forEach(function(line){
       var times = line.match(/\d{2}:\d{2}/g);
       if(Array.isArray(times)){
         times.forEach(function(time){
           lyricObj[time] = line.replace(/\[.+?\]/g,'');
         });
       }
     });
     // console.log(lyricObj);
     _this.setState({
       lyric: lyricObj
     })
    })
  }
  render() {
    let covers = this.state.channels
    .map((item,index) => {
      return (
        <li key = {index} className="cover" onClick={this.clickActive.bind(this)}>
          <CoverItem channel={item}></CoverItem>
        </li>
      )
    })
    var _this = this
    this.audio.addEventListener('play',function(){
      //console.log('play');
      clearInterval(_this.statusClock);
      _this.statusClock = setInterval(function(){
        _this.updateStatue();
      },1000);
    });
    this.audio.addEventListener('pause',function(){
      clearInterval(_this.statusClock);
      //console.log('pause');
    });
    this.audio.addEventListener('ended',function(){
      //console.log('ended');
      _this.playSong();
    });
    return (
      <div className="App">
        <section id="page-music">
          <Music chId={this.state.channelId}
            chName={this.state.channelName}
            song={this.state.song}
            onclickPlay={this.clickPlay.bind(this)}
            onNext={this.playNext.bind(this)}
            onChangeTime={this.changeTime.bind(this)}/>
          <footer>
            <div className="layout">
              <span className="iconfont icon-back" onClick={this.clickLeft.bind(this)}></span>
              <span className="iconfont icon-right" onClick={this.clickRight.bind(this)}></span>
              <div className="music-box">
                <ul className="clearfix">
                  {covers}
                </ul>
              </div>
            </div>
          </footer>
        </section>
        <div className="background"></div>
      </div>
    );
  }
}

$.fn.boomText = function(type){
  type = type || 'rollIn';
  this.html(function(){
    var arr = $(this).text().split('')
              .map(function(word){
                return '<span class="boomText">' + word + '</span>';
              });
    return arr.join('');
  });

  var index = 0;
  var $boomTexts = $(this).find('span');
  var clock = setInterval(function(){
    $boomTexts.eq(index).addClass('animated '+ type);
    index++;
    if(index >= $boomTexts.length){
      clearInterval(clock);
    }
  },200);

}

export default App;
