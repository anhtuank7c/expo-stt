import ExpoModulesCore
import Speech

public class SpeechRecognitionRequester: NSObject, EXPermissionsRequester {
    public static func permissionType() -> String! {
        return "speechRecognition"
    }
    
    public func requestPermissions(resolver resolve: EXPromiseResolveBlock!, rejecter reject: EXPromiseRejectBlock!) {
        SFSpeechRecognizer.requestAuthorization { status in
            resolve(self.getPermissions())
        }
    }
    
    public func getPermissions() -> [AnyHashable: Any]! {
        var status: EXPermissionStatus
        var systemStatus: SFSpeechRecognizerAuthorizationStatus
        let speechRecognitionUsageDescription = Bundle.main.object(forInfoDictionaryKey: "NSSpeechRecognitionUsageDescription")
        if speechRecognitionUsageDescription == nil {
            EXFatal(EXErrorWithMessage("This app is missing 'NSSpeechRecognitionUsageDescription' so speech recognition will fail"))
            systemStatus = SFSpeechRecognizerAuthorizationStatus.denied
        } else {
            systemStatus = SFSpeechRecognizer.authorizationStatus()
        }
        switch systemStatus {
        case .authorized:
            status = EXPermissionStatusGranted
        case .denied, .restricted:
            status = EXPermissionStatusDenied
        case .notDetermined:
            fallthrough
        @unknown default:
            status = EXPermissionStatusUndetermined
        }
        return ["status": status.rawValue]
    }
}
