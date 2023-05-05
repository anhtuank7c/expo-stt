import ExpoModulesCore
import Speech
import AVFAudio
import AVFoundation

enum AuthorizationStatus {
    case notDetermined, denied, restricted, authorized
}
public class ExpoSttModule: Module {
    private var averagePowerForChannel0: Float?
    private var averagePowerForChannel1: Float?
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private var audioEngine: AVAudioEngine?
    private var audioSession: AVAudioSession?
    private var speechRecognizer: SFSpeechRecognizer?
    private var sessionId: String?
    private var priorAudioCategory: AVAudioSession.Category?
    private var priorAudioCategoryOptions: AVAudioSession.CategoryOptions?
    private var isTearingDown: Bool = false
    private var continuous: Bool = false
    
    private func teardown() {
        isTearingDown = true
        recognitionTask?.cancel()
        recognitionTask = nil

        // set back audio session category
        resetAudioSession()

        // end recognition request
        recognitionRequest?.endAudio()

        // stop audio engine and dereference it for re-allocation
        if (audioEngine != nil) {
            // remove tap on bus
            audioEngine?.inputNode.removeTap(onBus: 0)
            audioEngine?.inputNode.reset()
            if (audioEngine?.isRunning == true) {
                audioEngine?.stop()
                audioEngine?.reset()
            }
            audioEngine = nil
        }
        recognitionRequest = nil
        sessionId = nil
        isTearingDown = false
    }
    
    private func isHeadsetPluggedIn() -> Bool {
        let route = AVAudioSession.sharedInstance().currentRoute
        for desc in route.outputs {
            if desc.portType == .headphones || desc.portType == .bluetoothA2DP {
                return true
            }
        }
        return false
    }
    
    private func isHeadSetBluetooth() -> Bool {
        let input = AVAudioSession.sharedInstance().availableInputs ?? []
        for port in input {
            if port.portType == .bluetoothHFP {
                return true
            }
        }
        return false
    }
    
    private func setupAudioSession() -> Bool {
        guard let audioSession = audioSession else {
            return false
        }
        do {
            if isHeadsetPluggedIn() || isHeadSetBluetooth() {
                try audioSession.setCategory(.playAndRecord, options: .allowBluetooth)
            } else {
                try audioSession.setCategory(.playAndRecord, options: .defaultToSpeaker)
            }
            try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
            return true
        } catch {
            return false
        }
    }
    
    private func resetAudioSession() -> Void {
        if audioSession == nil {
            audioSession = AVAudioSession.sharedInstance()
        }
        guard let priorAudioCategory = priorAudioCategory, let priorAudioCategoryOptions = priorAudioCategoryOptions, let audioCategory = audioSession?.category, let audioCategoryOptions = audioSession?.categoryOptions else {
            return
        }
        if priorAudioCategory == audioCategory && priorAudioCategoryOptions == audioCategoryOptions {
            return
        }
        do {
            // reset back to the previous category
            if isHeadsetPluggedIn() || isHeadSetBluetooth() {
                try audioSession?.setCategory(priorAudioCategory, options: .allowBluetooth)
            } else {
                try audioSession?.setCategory(priorAudioCategory, options: priorAudioCategoryOptions)
            }
        } catch {
            print("Failed to reset to the previous category")
        }
        audioSession = nil
    }
    
    private func setupAndStartRecognizing(_ localeStr: String? = nil) throws {
        audioSession = AVAudioSession.sharedInstance()
        priorAudioCategory = audioSession?.category
        priorAudioCategoryOptions = audioSession?.categoryOptions
        teardown()
        sessionId = UUID().uuidString
        var locale: Locale?
        if localeStr != nil {
            locale = Locale(identifier: localeStr!)
        }
        if locale != nil {
            speechRecognizer = SFSpeechRecognizer(locale: locale!)
        } else {
            speechRecognizer = SFSpeechRecognizer()
        }
        if !setupAudioSession() {
            sendEvent(ReactEvents.onSpeechError.rawValue, ["cause": "Cannot setup audio session"])
            teardown()
            return
        }
        
        recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
        // Configure request so that results are returned before audio recording is finished
        recognitionRequest?.shouldReportPartialResults = true

        // Force speech recognition to be on-device
        if #available(iOS 13, *) {
            recognitionRequest?.requiresOnDeviceRecognition = true
        }
        if recognitionRequest == nil {
            sendEvent(ReactEvents.onSpeechError.rawValue, ["cause": "Cannot initialize recognition request"])
            teardown()
            return
        }
        if audioEngine == nil {
            audioEngine = AVAudioEngine()
        }
        let inputNode = audioEngine?.inputNode
        if inputNode == nil {
            sendEvent(ReactEvents.onSpeechError.rawValue, ["cause": "Missing input node"])
            teardown()
            return
        }
        sendEvent(ReactEvents.onSpeechStart.rawValue)
        let taskSessionid = sessionId
        recognitionTask = speechRecognizer?.recognitionTask(with: recognitionRequest!, resultHandler: { (result, error) in
            if taskSessionid != self.sessionId {
                self.teardown()
                return
            }
            if error != nil {
                self.sendEvent(ReactEvents.onSpeechError.rawValue, ["cause": error?.localizedDescription])
                self.teardown()
                return
            }
            if result == nil {
                self.sendEvent(ReactEvents.onSpeechEnd.rawValue)
                self.teardown()
                return
            }
            var finalResult = [String]()
            if let result = result?.bestTranscription.formattedString {
                finalResult.append(result)
            }
            self.sendEvent(ReactEvents.onSpeechResult.rawValue, ["value": finalResult])
            if result?.isFinal == true || self.recognitionTask?.isCancelled == true || self.recognitionTask?.isFinishing == true {
                self.sendEvent(ReactEvents.onSpeechEnd.rawValue)
                if !self.continuous {
                    self.teardown()
                }
            }
        })
        
        let recordingFormat = inputNode?.outputFormat(forBus: 0)
        let mixer = AVAudioMixerNode()
        audioEngine?.attach(mixer)

        // start recording and append recording buffer to speech recognizer
        mixer.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, _ in
            self.recognitionRequest?.append(buffer)
        }
        audioEngine?.connect(inputNode!, to: mixer, format: recordingFormat)
        audioEngine?.prepare()
        try audioEngine?.start()
    }

  public func definition() -> ModuleDefinition {
      Name("ExpoStt")
      Events(ReactEvents.allCases.map { $0.rawValue })
      OnCreate {
          self.appContext?.permissions?.register([MicrophoneRequester(), SpeechRecognitionRequester()])
      }
      
      OnDestroy {
          teardown()
      }
      
      AsyncFunction("requestRecognitionPermission", { (promise: Promise) -> Void in
          guard let permissions = self.appContext?.permissions else {
              return promise.reject(PermissionsModuleNotFoundException())
          }
          permissions.askForPermission(usingRequesterClass: SpeechRecognitionRequester.self, resolve: promise.resolver, reject: promise.legacyRejecter)
      })
      
      AsyncFunction("checkRecognitionPermission", { (promise: Promise) -> Void in
          guard let permissions = self.appContext?.permissions else {
              return promise.reject(PermissionsModuleNotFoundException())
          }
          permissions.getPermissionUsingRequesterClass(SpeechRecognitionRequester.self, resolve: promise.resolve, reject: promise.legacyRejecter)
      })
      
      Function("stopSpeech") {
          recognitionTask?.finish()
      }
      
      Function("cancelSpeech") {
          recognitionTask?.cancel()
      }
      
      Function("destroySpeech") {
          teardown()
      }
      
      Function("startSpeech") { () -> Bool in
          if recognitionTask != nil {
              sendEvent(ReactEvents.onSpeechError.rawValue, ["cause": "Speech recognition already started!"])
              return false
          }
          guard let permissions = self.appContext?.permissions else {
              sendEvent(ReactEvents.onSpeechError.rawValue, ["cause": "Permissions module not found. Are you sure that Expo modules are properly linked?"])
              return false
          }
          guard permissions.hasGrantedPermission(usingRequesterClass: SpeechRecognitionRequester.self) else {
              sendEvent(ReactEvents.onSpeechError.rawValue, ["cause": "Missing speech recognition or microphone permission"])
              return false
          }
          speechRecognizer = SFSpeechRecognizer()
          guard (speechRecognizer?.isAvailable) != nil else {
              sendEvent(ReactEvents.onSpeechError.rawValue, ["cause": "Speech recognition is not available. Please increase your minimum deployment target to 13.0 or higher."])
              return false
          }
          do {
              try setupAndStartRecognizing()
              return true
          } catch {
              return false
          }
      }
  }
}
