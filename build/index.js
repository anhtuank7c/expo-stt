import { NativeModulesProxy, EventEmitter, } from "expo-modules-core";
// Import the native module. On web, it will be resolved to ExpoStt.web.ts
// and on native platforms to ExpoStt.ts
import { ReactEvents, } from "./ExpoStt.types";
import ExpoSttModule from "./ExpoSttModule";
export function startSpeech() {
    return ExpoSttModule.startSpeech();
}
export function stopSpeech() {
    return ExpoSttModule.stopSpeech();
}
export function cancelSpeech() {
    return ExpoSttModule.cancelSpeech();
}
export function destroySpeech() {
    return ExpoSttModule.destroySpeech();
}
export function requestRecognitionPermission() {
    return ExpoSttModule.requestRecognitionPermission();
}
export function checkRecognitionPermission() {
    return ExpoSttModule.checkRecognitionPermission();
}
const emitter = new EventEmitter(ExpoSttModule ?? NativeModulesProxy.ExpoStt);
export function addOnSpeechStartListener(listener) {
    return emitter.addListener(ReactEvents.onSpeechStart, listener);
}
export function addOnSpeechEndListener(listener) {
    return emitter.addListener(ReactEvents.onSpeechEnd, listener);
}
export function addOnSpeechCancelledListener(listener) {
    return emitter.addListener(ReactEvents.onSpeechCancelled, listener);
}
export function addOnSpeechResultListener(listener) {
    return emitter.addListener(ReactEvents.onSpeechResult, listener);
}
export function addOnSpeechErrorListener(listener) {
    return emitter.addListener(ReactEvents.onSpeechError, listener);
}
export { ReactEvents };
//# sourceMappingURL=index.js.map