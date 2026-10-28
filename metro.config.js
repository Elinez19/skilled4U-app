const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const nativewindConfig = withNativewind(config);

const originalResolveRequest = nativewindConfig.resolver.resolveRequest;

nativewindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  // Always let react-native-css handle its own metro override mock
  if (moduleName.includes("react-native-css-metro-override")) {
    return originalResolveRequest(context, moduleName, platform);
  }

  const origin = (context.originModulePath || "").replace(/\\/g, "/").toLowerCase();

  // Any package inside node_modules requiring react-native should use the real
  // react-native package (not react-native-css/components proxy), which prevents:
  // 1. Missing React Native exports in newer RN versions (e.g. NativeComponentRegistry in expo-router).
  // 2. Circular resolution on Windows when react-native-css requires react-native.
  if (
    (moduleName === "react-native" || moduleName === "react-native-safe-area-context") &&
    origin.includes("/node_modules/")
  ) {
    const parentResolver = config.resolver?.resolveRequest ?? context.resolveRequest;
    return parentResolver(context, moduleName, platform);
  }

  return originalResolveRequest(context, moduleName, platform);
};

module.exports = nativewindConfig;