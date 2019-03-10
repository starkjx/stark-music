import React, {Component} from 'react'
import './Music.css'
// import $ from 'jquery'

export default class Music extends Component{
  constructor(props){
    super(props)
    this.state = {
      
    }
  }

  render(){
    return(
      <main className='layout'>
        <div className="music-panel">
          <figure></figure>
          <div className="actions clearfix">
            <span className="btn-collect iconfont icon-like"></span>
            <span className="btn-play iconfont icon-play" onClick={this.props.onclickPlay}></span>
            <span className="btn-next iconfont icon-next"></span>
          </div>
        </div>
        <div className="detail">
          <span className="tag">{this.props.chName || 'stark'}</span>
          <h1>{this.props.song.title || 'SONG NAME'}</h1>
          <ul className="icons clearfix">
            <li><span className="iconfont icon-music">1234</span></li>
            <li><span className="iconfont icon-like">123</span></li>
            <li><span className="iconfont icon-appreciate">12</span></li>
          </ul>
          <div className="time-area">
            <div className="bar">
              <div className="bar-progress"></div>
            </div>
            <div className="current-time">0:00</div>
          </div>
          <div className="author">{this.props.song.artist || 'author'}</div>
          <div className="lyric">
            <p>lyric</p>
          </div>
        </div>
      </main>
    )
  }
}