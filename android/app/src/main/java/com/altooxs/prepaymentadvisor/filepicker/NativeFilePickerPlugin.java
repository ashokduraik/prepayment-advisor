package com.altooxs.prepaymentadvisor.filepicker;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.OpenableColumns;

import com.getcapacitor.Bridge;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

@CapacitorPlugin(name = "NativeFilePicker")
public class NativeFilePickerPlugin extends Plugin {

    private static final int PICK_FILE_REQUEST = 10001;
    private PluginCall savedCall;

    public void pickFile(PluginCall call) {
        savedCall = call;
        Activity activity = getActivity();
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "application/*"});
        try {
            activity.startActivityForResult(intent, PICK_FILE_REQUEST);
        } catch (Exception e) {
            savedCall.reject("Failed to start picker: " + e.getMessage());
            savedCall = null;
        }
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);
        if (requestCode != PICK_FILE_REQUEST) return;
        if (savedCall == null) return;

        if (resultCode == Activity.RESULT_OK && data != null) {
            Uri uri = data.getData();
            if (uri == null) {
                savedCall.reject("No file selected");
                savedCall = null;
                return;
            }
            try {
                String name = "";
                Cursor cursor = getContext().getContentResolver().query(uri, null, null, null, null);
                if (cursor != null) {
                    try {
                        int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                        if (nameIndex >= 0 && cursor.moveToFirst()) {
                            name = cursor.getString(nameIndex);
                        }
                    } finally {
                        cursor.close();
                    }
                }

                InputStream is = getContext().getContentResolver().openInputStream(uri);
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                int read;
                while (is != null && (read = is.read(buffer)) != -1) {
                    baos.write(buffer, 0, read);
                }
                if (is != null) is.close();

                String text = new String(baos.toByteArray(), "UTF-8");

                JSObject res = new JSObject();
                res.put("data", text);
                res.put("name", name != null ? name : "");
                savedCall.resolve(res);
            } catch (Exception e) {
                savedCall.reject("Failed to read file: " + e.getMessage());
            }
        } else {
            savedCall.reject("User cancelled");
        }
        savedCall = null;
    }
}
