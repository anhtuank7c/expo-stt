export type OnSpeechResultEventPayload = {
    value: string[];
};
export type OnSpeechErrorEventPayload = {
    cause: string;
};
export declare enum ReactEvents {
    onSpeechStart = "onSpeechStart",
    onSpeechEnd = "onSpeechEnd",
    onSpeechError = "onSpeechError",
    onSpeechResult = "onSpeechResult",
    onSpeechCancelled = "onSpeechCancelled"
}
//# sourceMappingURL=ExpoStt.types.d.ts.map