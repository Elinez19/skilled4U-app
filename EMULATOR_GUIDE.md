# Android Emulator Commands Guide

Quick reference commands for launching your Android Emulator and running **skilled4U-app** on Windows (PowerShell).

---

## 1. List Available Emulators

Check which Android Virtual Devices (AVDs) are installed on your machine:

```powershell
emulator -list-avds
```

*(Available devices: `Medium_Phone_API_37.0`, `Pixel_10_Pro`)*

---

## 2. Start the Emulator

Run this command in a PowerShell window and wait for the virtual phone to finish booting to its home screen:

```powershell
emulator -avd Medium_Phone_API_37.0
```

> **Fallback (full path if a terminal hasn't loaded `PATH`):**
> ```powershell
> & "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd Medium_Phone_API_37.0
> ```

---

## 3. Run the Expo App on the Emulator

Once the emulator has booted to the home screen, open a **second terminal tab** in the project root (`c:\Users\elija\Desktop\skilled4U-app`) and run:

```powershell
npx expo start --android
```

Or start the Expo server normally and press **`a`** once the menu loads:

```powershell
npx expo start
```

---

## 4. Useful Troubleshooting Commands

### Check if the emulator is connected to ADB
```powershell
adb devices
```
*(Should display `emulator-5554   device` when ready)*

### Clear stuck emulator crash dialogs
If the emulator hangs on startup due to a previous crash dump:
```powershell
Remove-Item "$env:LOCALAPPDATA\Temp\AndroidEmulator\*" -Recurse -Force -ErrorAction SilentlyContinue
```

### Re-apply Android SDK Environment Variables (if ever needed)
```powershell
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')
$userPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$sdkEmulator = "$env:LOCALAPPDATA\Android\Sdk\emulator"
$sdkTools = "$env:LOCALAPPDATA\Android\Sdk\platform-tools"
$pathsToAdd = @($sdkEmulator, $sdkTools) | Where-Object { $userPath -notlike "*$_*" }
if ($pathsToAdd) {
    $newPath = ($userPath.TrimEnd(';') + ';' + ($pathsToAdd -join ';')).Trim(';')
    [System.Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
}
```

