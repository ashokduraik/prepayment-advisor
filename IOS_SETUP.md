# iOS Integration Steps — NativeFilePicker

This project includes a native Android file-picker plugin and a Swift iOS plugin stub at `ios/NativeFilePicker/NativeFilePicker.swift` that uses `UIDocumentPickerViewController` to return the selected file's text and name to JavaScript. You don't need an Apple developer account to build/run on the simulator, but you will need Xcode on macOS to compile and run the iOS app on simulator or device.

Follow these steps on a mac with Xcode installed when you are ready:

1. Build the web app

```bash
npm run build
```

2. Sync Capacitor iOS project

```bash
npx cap sync ios
```

3. (Optional) Ensure CocoaPods are installed and up-to-date

```bash
# from project root
cd ios/App
pod install
```

4. Open the iOS project in Xcode

```bash
npx cap open ios
```

5. Add the Swift plugin file to the Xcode app target

- In Xcode, drag `ios/NativeFilePicker/NativeFilePicker.swift` into the App project (App folder) and ensure the file's Target Membership is your app target (check the file inspector → Target Membership).
- When prompted to create a Bridging Header (only if your project is Obj-C), allow Xcode to generate it.

6. Verify Swift runtime embedding (if needed)

- In the app target → Build Settings, ensure `Always Embed Swift Standard Libraries` is `Yes` for older projects that require it.

7. Build & run on simulator or device

- Select a simulator or connected device and run.

8. Test the feature

- In the app UI use the Backup → Restore flow. The app will call the native `NativeFilePicker` plugin to present the document picker and return file contents as UTF-8 text.

Troubleshooting / Notes

- Automatic plugin discovery: Capacitor will expose Swift plugin classes marked with `@objc(...)` automatically if the `.swift` file is compiled into the app target. If the plugin is not available at runtime, ensure the `.swift` file is included in the app target and re-build.
- If automatic registration fails you can manually register the plugin following Capacitor's plugin registration docs (add an explicit register call in your AppDelegate if required). Refer to Capacitor iOS plugin docs: https://capacitorjs.com/docs/plugins/ios
- No extra Info.plist keys are required for `UIDocumentPickerViewController` to read user-selected documents.
- The plugin reads files using security-scoped URLs; file access should work for documents selected via the document picker without additional permissions. If you later change to direct file path access, you may need to request storage permission or update entitlements.
- After making project changes in Xcode, re-run `npx cap sync ios` only when you change the web build or Capacitor config; Xcode edits (adding files) are done inside the Xcode workspace.

If you'd like, I can also add an explicit `AppDelegate` registration snippet to this file — tell me and I will patch it in. When you're ready to test on mac/Xcode, follow the commands above and let me know if you hit any errors; I can suggest fixes or provide the exact Xcode edits to register the plugin manually.
