import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import rtc from '../libs/rtc';
import { hashHistory, Link } from 'react-router';

export default class UserMediaLocal extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    var container = ReactDOM.findDOMNode(this);


    this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.canvasCtx = this.canvas.getContext('2d');

    this.video = ReactDOM.findDOMNode(this.refs.video);

    this.getUserMedia()
    .then((stream) => {
      this.video.src = window.URL.createObjectURL(stream);
      this.video.onloadedmetadata = this.handlePlayUserMedia;
      this.mediaStreamLocal = stream;
    })
    .catch((error) => {
      console.log('userMedia',error);
    });
  }
  getUserMedia() {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia(
        rtc.userMediaVideoOnly,
        (stream) => {
          resolve(stream);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  handlePlayUserMedia = (event) => {
    this.video.play()
    window.requestAnimationFrame(this.canvasRender);
  }
  canvasRender = (timestamp) => {
    // this.canvas.clientWidth = this.canvas.width = this.video.videoWidth;
    // this.canvas.clientWidth = this.canvas.width = this.video.videoWidth;
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    this.canvasCtx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    if (!this.video.ended && !this.video.paused) {
      window.requestAnimationFrame(this.canvasRender);
    }
  }
  componentWillUnmount() {
    this.video.pause();
    try {
      this.mediaStreamLocal.getTracks().forEach((track) => { track.stop()});
    }
    catch(err) {
      this.mediaStreamLocal.stop();
    }
  }
  render() {
      return (
        <div className="row">
          <video ref="video"/>
          <canvas ref="canvas"/>
        </div>
      );
    // }
  }
  handleInputUser = (event) => {
  }
}
