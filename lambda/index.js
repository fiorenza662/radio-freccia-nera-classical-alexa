'use strict';
const Alexa=require('ask-sdk-core');
const STREAM='https://www.radiofreccianera.com/classical.mp3';
const ART='https://www.radiofreccianera.com/wp-content/themes/radio-freccia-nera-thematic-network-en-v2.2/assets/img/cards-pro/classical.png';
const isIT=h=>(Alexa.getLocale(h.requestEnvelope)||'en-GB').toLowerCase().startsWith('it');
function play(h){if(!STREAM)return h.responseBuilder.speak(isIT(h)?'Questo canale sarà disponibile a breve.':'This channel will be available soon.').withShouldEndSession(true).getResponse();const title=isIT(h)?'Radio Freccia Nera Classica':'Radio Freccia Nera Classical';const intro=isIT(h)?'Radio Freccia Nera Classica.':'Radio Freccia Nera Classical.';return h.responseBuilder.speak(intro).addDirective({type:'AudioPlayer.Play',playBehavior:'REPLACE_ALL',audioItem:{stream:{url:STREAM,token:'rfn-classical-'+Date.now(),offsetInMilliseconds:0},metadata:{title,subtitle:'Radio Freccia Nera',art:{sources:[{url:ART}]},backgroundImage:{sources:[{url:ART}]}}}}).withShouldEndSession(true).getResponse();}
const Launch={canHandle:h=>Alexa.getRequestType(h.requestEnvelope)==='LaunchRequest',handle:play};
const Play={canHandle:h=>Alexa.getRequestType(h.requestEnvelope)==='IntentRequest'&&['PlayRadioIntent','AMAZON.ResumeIntent'].includes(Alexa.getIntentName(h.requestEnvelope)),handle:play};
const Stop={canHandle:h=>Alexa.getRequestType(h.requestEnvelope)==='IntentRequest'&&['AMAZON.StopIntent','AMAZON.CancelIntent','AMAZON.PauseIntent'].includes(Alexa.getIntentName(h.requestEnvelope)),handle:h=>h.responseBuilder.addAudioPlayerStopDirective().withShouldEndSession(true).getResponse()};
const Help={canHandle:h=>Alexa.getRequestType(h.requestEnvelope)==='IntentRequest'&&['AMAZON.HelpIntent','AMAZON.FallbackIntent'].includes(Alexa.getIntentName(h.requestEnvelope)),handle:h=>h.responseBuilder.speak(isIT(h)?"Di': Alexa, apri Freccia Nera Classica.":'Say: Alexa, open Black Arrow Classical.').getResponse()};
const Audio={canHandle:h=>Alexa.getRequestType(h.requestEnvelope).startsWith('AudioPlayer.'),handle:h=>h.responseBuilder.getResponse()};
const End={canHandle:h=>['SessionEndedRequest','System.ExceptionEncountered'].includes(Alexa.getRequestType(h.requestEnvelope)),handle:h=>h.responseBuilder.getResponse()};
const Err={canHandle:()=>true,handle:(h,e)=>{console.error(e);return h.responseBuilder.speak(isIT(h)?'Si è verificato un problema.':'There was a problem.').getResponse();}};
exports.handler=Alexa.SkillBuilders.custom().addRequestHandlers(Launch,Play,Stop,Help,Audio,End).addErrorHandlers(Err).lambda();
