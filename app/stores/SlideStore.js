import uuid from 'node-uuid';
import alt from '../libs/alt';
import SlideActions from '../actions/SlideActions';
import io from 'socket.io-client';

var SlideSource = io.connect('wss://lo.jaringan.info:3000/slide',
  {transports: [
    'websocket', 
    'polling',
    'xhr-polling', 
    'jsonp-polling', 
    'flashsocket', 
    'htmlfile'
  ]});

var SlideSourceAjax = 'https://lo.jaringan.info:3000/slides/';

class SlideStore {
  constructor() {
    this.bindActions(SlideActions);

    this.slideDeckId = null;
    this.slideDeckData = null;
    this.slideDeckLength = 0;
    this.slideNoLecturer = 0;
    this.slideNoLocal = 0;
    this.lecturer = null;
  }

  send(cmd,msg) {
    SlideSource.emit(cmd,msg);
  }

  fetch(cmd) {
    return new Promise((resolve, reject) => {
      SlideSource.once(cmd, (msg) => {
        console.log('SlideStore fetch', cmd, msg);
        resolve(msg);
      });
    });
  }

  subSlide({slideDeckId, user}) {
    this.send('subSlide',{slideDeckId, user});
    this.setState({slideDeckId});
    console.log('subSlide', this.slideDeckId);

    if (!this.slideDeckData) {
      this.fetchSlideDeck(slideDeckId);
    }

    var slideUpdateId = 'slideUpdate/'+slideDeckId;
    SlideSource.on(slideUpdateId, ({slideNoLecturer, lecturer}) => {
      console.log('slideUpdate', slideUpdateId, {slideNoLecturer, lecturer});
      var recvSlide = {slideNoLocal: slideNoLecturer, slideNoLecturer: slideNoLecturer, lecturer: lecturer};
      this.setState(recvSlide);
    });
  }

  unsubSlide(slideDeckId) {
    this.send('unsubSlide',{slideDeckId});
    this.setState({slideDeckId: -1});

    var slideUpdateId = 'slideUpdate/'+slideDeckId;
    SlideSource.removeAllListeners(slideUpdateId);
  }

  changeSlideLocal({slideNoLocal}) {
    this.setState({slideNoLocal});
    // console.log('changeSlideLocal', {slideNoLocal}, this.state);
    this.send('pushLocalSlide',{slideDeckId:this.slideDeckId, slideNoLocal:slideNoLocal});
  }

  fetchSlideDeck(slideDeckId) {
    $.getJSON(SlideSourceAjax+slideDeckId)
    .done((data) => {
      var modData = data.slideDeckData.map((d) => {
        d.url = SlideSourceAjax+this.slideDeckId+'/'+d.url;
        d.urlThumb = SlideSourceAjax+this.slideDeckId+'/'+d.urlThumb;
        return d;
      });
      data.slideDeckData = modData;
      this.setState(data);
      console.log('fetchSlideDeck', data);
      /*
      [{
        slideId: Number,
        slideNo: Number,
        title: String,
        url: String,
        urlThumb: String
      }...]
      */
    });
  }
}

export default alt.createStore(SlideStore, 'SlideStore');
