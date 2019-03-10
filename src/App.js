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
      song: []
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
        //_this.play(ret.song[0]);
    });
    _this.audio.src = this.state.song.url
    $('.music-panel figure').css('background-image', 'url(' + this.state.song.picture + ')')
    $('.background').css('background-image','url(' + this.state.song.picture + ')');
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
  render() {
    let covers = this.state.channels
    .map((item,index) => {
      return (
        <li key = {index} className="cover" onClick={this.clickActive.bind(this)}>
          <CoverItem channel={item}></CoverItem>
        </li>
      )
    })
    return (
      <div className="App">
        <section id="page-music">
          <Music chId={this.state.channelId}
            chName={this.state.channelName}
            song={this.state.song}
            onclickPlay={this.clickPlay.bind(this)}/>
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

export default App;
