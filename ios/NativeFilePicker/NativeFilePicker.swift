import Foundation
import Capacitor
import UIKit
import MobileCoreServices

@objc(NativeFilePicker)
public class NativeFilePicker: CAPPlugin, UIDocumentPickerDelegate {

    private var savedCall: CAPPluginCall?

    @objc func pickFile(_ call: CAPPluginCall) {
        self.savedCall = call

        DispatchQueue.main.async {
            let supportedTypes: [String] = [String(kUTTypeJSON), String(kUTTypeData), String(kUTTypeItem)]
            let picker = UIDocumentPickerViewController(documentTypes: supportedTypes, in: .import)
            picker.delegate = self
            picker.modalPresentationStyle = .formSheet
            self.bridge?.viewController?.present(picker, animated: true, completion: nil)
        }
    }

    public func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        guard let call = self.savedCall else { return }
        guard let url = urls.first else {
            call.reject("No file selected")
            self.savedCall = nil
            return
        }

        var dataString: String? = nil
        do {
            let canAccess = url.startAccessingSecurityScopedResource()
            defer { if canAccess { url.stopAccessingSecurityScopedResource() } }

            let data = try Data(contentsOf: url)
            dataString = String(data: data, encoding: .utf8)
        } catch let err {
            call.reject("Failed to read file: \(err.localizedDescription)")
            self.savedCall = nil
            return
        }

        if let text = dataString {
            var ret = JSObject()
            ret.put("data", text)
            ret.put("name", url.lastPathComponent)
            call.resolve(ret)
        } else {
            call.reject("Unable to decode file contents")
        }

        self.savedCall = nil
    }

    public func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
        if let call = self.savedCall {
            call.reject("User cancelled")
            self.savedCall = nil
        }
    }
}
