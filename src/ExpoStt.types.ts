export type OnSpeechResultEventPayload = {
  value: string[];
};
export type OnSpeechErrorEventPayload = {
  cause: string;
};
export enum ReactEvents {
  onSpeechStart = "onSpeechStart",
  onSpeechEnd = "onSpeechEnd",
  onSpeechError = "onSpeechError",
  onSpeechResult = "onSpeechResult",
  onSpeechCancelled = "onSpeechCancelled",
}
