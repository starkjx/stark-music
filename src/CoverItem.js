import React, {Component} from 'react'
import './CoverItem.css'
import $ from 'jquery'

export default class CoverItem extends Component{
  componentDidMount(){
    var width = $('footer').find('li').outerWidth(true)
    //console.log(width)
    $('ul').css({width: 40 * width + 'px'})
  }
  render(){
    return(
      <div>
        <div style={{backgroundImage: 'url('+this.props.channel.cover_small + ')'}}></div>
        <h3>{this.props.channel.name}</h3>
      </div>
    )
  }
}