import React from 'react';

export default class SlideShow extends React.Component {
  render() {
    // var slideUrl = null; //this.state.slideDeckData[state.slideIdLecturer].url;
    var slideUrl = null;
    try {
      slideUrl = this.props.slides.slideDeckData[this.props.slides.slideNoLocal].url;
    }
    catch (e) {}
    console.log('SlideShow', slideUrl);
    return (
      <div className="row">
        <div className="row"><img src={slideUrl} className="slide-show" /></div>
        <div className="row">
          <div className="btn-group btn-group-sm" role="group">
            <button type="button" className="btn btn-default" onClick={this.props.onFirst}>
              <span className="glyphicon glyphicon-fast-backward" aria-hidden="true"></span>
            </button>
            <button type="button" className="btn btn-default" onClick={this.props.onPrev}>
              <span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
            </button>
            <button type="button" className="btn btn-default" onClick={this.props.onNext}>
              <span className="glyphicon glyphicon-forward" aria-hidden="true"></span>
            </button>
            <button type="button" className="btn btn-default" onClick={this.props.onLast}>
              <span className="glyphicon glyphicon-fast-forward" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
