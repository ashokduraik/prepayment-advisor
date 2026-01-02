package com.altooxs.prepaymentadvisor;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.altooxs.prepaymentadvisor.filepicker.NativeFilePickerPlugin;

public class MainActivity extends BridgeActivity {
	@Override
	public void onCreate(android.os.Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		registerPlugin(NativeFilePickerPlugin.class);
	}
}
