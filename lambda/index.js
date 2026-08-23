'use strict';
const Alexa=require('ask-sdk-core');
const STREAM='https://radio.radiofreccianera.com/listen/classical/radio128.mp3';
const isIT=h=>(Alexa.getLocale(h.requestEnvelope)||'en-GB').toLowerCase().startsWith('it');
function streamDirective(tokenPrefix){const nonce=Date.now();return{type:'AudioPlayer.Play',playBehavior:'REPLACE_ALL',audioItem:{stream:{url:STREAM,token:tokenPrefix+'-'+nonce,offsetInMilliseconds:0}}};}
async function play(h){const intro=isIT(h)?'Radio Freccia Nera Classica.':'Radio Freccia Nera Classical.';return h.responseBuilder.speak(intro).addDirective(streamDirective('rfn-classical')).withShouldEndSession(true).getResponse();}
async function recover(h){return h.responseBuilder.addDirective(streamDirective('rfn-classical-recover')).getResponse();}
const Launch={canHandle:h=>Alexa.getRequestType(h.requestEnvelope)==='LaunchRequest',handle:play};
const Play={canHandle:h=>Alexa.getRequestType(h.requestEnvelope)==='IntentRequest'&&['PlayRadioIntent','AMAZON.ResumeIntent'].includes(Alexa.getIntentName(h.requestEnvelope)),handle:play};
const Stop={canHandle:h=>Alexa.getRequestType(h.requestEnvelope)==='IntentRequest'&&['AMAZON.StopIntent','AMAZON.CancelIntent','AMAZON.PauseIntent'].includes(Alexa.getIntentName(h.requestEnvelope)),handle:h=>h.responseBuilder.addAudioPlayerStopDirective().withShouldEndSession(true).getResponse()};
const Help={canHandle:h=>Alexa.getRequestType(h.requestEnvelope)==='IntentRequest'&&['AMAZON.HelpIntent','AMAZON.FallbackIntent'].includes(Alexa.getIntentName(h.requestEnvelope)),handle:h=>h.responseBuilder.speak(isIT(h)?"Di': Alexa, apri Freccia Nera Classica.":'Say: Alexa, open Black Arrow Classical.').getResponse()};
const Recover={canHandle:h=>['AudioPlayer.PlaybackFailed','AudioPlayer.PlaybackFinished'].includes(Alexa.getRequestType(h.requestEnvelope)),handle:recover};
const Audio={canHandle:h=>Alexa.getRequestType(h.requestEnvelope).startsWith('AudioPlayer.'),handle:h=>h.responseBuilder.getResponse()};
const End={canHandle:h=>['SessionEndedRequest','System.ExceptionEncountered'].includes(Alexa.getRequestType(h.requestEnvelope)),handle:h=>h.responseBuilder.getResponse()};
const Err={canHandle:()=>true,handle:(h,e)=>{console.error(e);return h.responseBuilder.speak(isIT(h)?'Si è verificato un problema.':'There was a problem.').getResponse();}};
exports.handler=Alexa.SkillBuilders.custom().addRequestHandlers(Launch,Play,Stop,Help,Recover,Audio,End).addErrorHandlers(Err).lambda();
