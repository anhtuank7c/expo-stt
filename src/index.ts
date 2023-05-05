import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
  PermissionResponse,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to ExpoStt.web.ts
// and on native platforms to ExpoStt.ts
import {
  OnSpeechResultEventPayload,
  OnSpeechErrorEventPayload,
  ReactEvents,
} from "./ExpoStt.types";
import ExpoSttModule from "./ExpoSttModule";

// Get the native constant value.
export const PI = ExpoSttModule.PI;

export function startSpeech(): boolean {
  return ExpoSttModule.startSpeech();
}
export function stopSpeech(): void {
  return ExpoSttModule.stopSpeech();
}
export function cancelSpeech(): void {
  return ExpoSttModule.cancelSpeech();
}
export function destroySpeech(): void {
  return ExpoSttModule.destroySpeech();
}
export function requestRecognitionPermission(): Promise<PermissionResponse> {
  return ExpoSttModule.requestRecognitionPermission();
}
export function checkRecognitionPermission(): Promise<PermissionResponse> {
  return ExpoSttModule.checkRecognitionPermission();
}

const emitter = new EventEmitter(ExpoSttModule ?? NativeModulesProxy.ExpoStt);

export function addOnSpeechStartListener(listener: () => void): Subscription {
  return emitter.addListener<void>(ReactEvents.onSpeechStart, listener);
}
export function addOnSpeechEndListener(listener: () => void): Subscription {
  return emitter.addListener(ReactEvents.onSpeechEnd, listener);
}
export function addOnSpeechCancelledListener(
  listener: () => void
): Subscription {
  return emitter.addListener<void>(ReactEvents.onSpeechCancelled, listener);
}
export function addOnSpeechResultListener(
  listener: (event: OnSpeechResultEventPayload) => void
): Subscription {
  return emitter.addListener<OnSpeechResultEventPayload>(
    ReactEvents.onSpeechResult,
    listener
  );
}

export function addOnSpeechErrorListener(
  listener: (event: OnSpeechErrorEventPayload) => void
): Subscription {
  return emitter.addListener<OnSpeechErrorEventPayload>(
    ReactEvents.onSpeechError,
    listener
  );
}
export { OnSpeechResultEventPayload, OnSpeechErrorEventPayload };
