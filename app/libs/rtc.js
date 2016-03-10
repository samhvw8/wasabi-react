const rtc = {
	rtcConfig : {
		iceServers: [ {urls: "stun:stun.l.google.com:19302"} ]
	},
	sdpConstraintsReceive : {
		'mandatory': {
      'OfferToReceiveAudio':true, 
      'OfferToReceiveVideo':true 
    }
	},
	sdpConstraintsSend : {
		'mandatory': {
      'OfferToReceiveAudio':false, 
      'OfferToReceiveVideo':false
    }
	},
	userMediaAudio : {video: false, audio: true},
	userMediaVideo : {video: true, audio: true},
	userMediaVideoOnly : {video: true, audio: false},
	userMediaScreen : {video: {mandatory: {chromeMediaSource: 'desktop'}}}
}

if (window) {
	if (!window.RTCPeerConnection) {
    window.RTCPeerConnection = window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection || window.msRTCPeerConnection;
  }
	if (!window.RTCSessionDescription) {
    window.RTCSessionDescription = window.webkitRTCSessionDescription ||
    window.mozRTCSessionDescription || window.msRTCSessionDescription;
  }
	if (!window.RTCIceCandidate) {
    window.RTCIceCandidate = window.webkitRTCIceCandidate ||
    window.mozRTCIceCandidate || window.msRTCIceCandidate;
  }
}

if (navigator) {
	if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.webkitGetUserMedia || 
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
	}
}

export default rtc;