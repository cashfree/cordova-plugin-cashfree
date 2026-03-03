# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Cordova plugin (`cordova-plugin-cashfree-pg`) that bridges JavaScript apps to the native Cashfree Payment Gateway SDKs on Android and iOS. Current version: **1.0.12**.

## Build Commands

### Compile TypeScript (plugin source)
The TypeScript source in `www/` must be manually compiled — there is no npm build script:
```bash
npx tsc
# Output goes to dist/CFPaymentGateway.js and dist/CFPaymentGateway.d.ts
```

### Example App (inside `example-cordova/`)
```bash
npm run build:android     # cordova build android
npm run build:ios         # cordova build ios
npm run run:android       # cordova run android
npm run run:ios           # cordova run ios
```

### Adding the plugin for testing
```bash
# From local source (active development)
cd example-cordova
cordova plugin rm cordova-plugin-cashfree-pg
cordova plugin add ../

# From a GitHub branch
cordova plugin rm cordova-plugin-cashfree-pg
cordova plugin add https://github.com/cashfree/cordova-plugin-cashfree#<branch-name>

# Re-add platform if needed after plugin changes
cordova platform rm android && cordova platform add android
```

No automated tests exist; testing is done manually via the example app.

## Architecture

### Plugin Structure
```
www/CFPaymentGateway.ts     # JS source (compiled → dist/)
dist/CFPaymentGateway.js    # Compiled output referenced by plugin.xml
src/android/CFPaymentGateway.java   # Android native bridge
src/android/CashfreePGSDK.gradle    # Android SDK dependency config
src/ios/CFPaymentGateway.swift      # iOS native bridge
plugin.xml                          # Cordova plugin manifest
```

### JS-to-Native Bridge Flow

1. Consumer calls `CFPaymentGatewayService.setCallback({ onVerify, onError })` once
2. Consumer calls a payment method (e.g. `doDropPayment(obj)`)
3. JS validates the input object, then calls `cordova.exec("CFPaymentGateway", "<action>", [JSON.stringify(payment), version])`
4. Native layer parses JSON → Cashfree SDK objects → initiates payment
5. Native SDK result triggers either `onVerify(orderID)` or `onError({ status, message, code, type, orderID })`

### Supported Payment Actions

| JS Method | Native Action | Description |
|---|---|---|
| `doDropPayment()` | `doDropPayment` | Full drop-in UI (deprecated) |
| `doWebCheckoutPayment()` | `doWebCheckoutPayment` | Hosted web checkout |
| `doUPIPayment()` | `doUPIPayment` | UPI intent-based |
| `doSubscriptionPayment()` | `doSubscriptionPayment` | Recurring subscriptions |

### Native SDK Versions
- **Android:** Cashfree PG API `2.2.9` (via `CashfreePGSDK.gradle`)
- **iOS:** CashfreePG `~2.2.7` (via CocoaPods)

### Platform String Convention
Both native layers embed a platform/version identifier into each payment object for Cashfree telemetry.

Android uses a single pattern for all methods:
- `cordova-d-{version}-xx-m-s-x-a-{androidVersion}`

iOS platform strings vary by payment method:
| Method | Platform string |
|---|---|
| `doDropPayment` | `icor-d-{version}-xx-m-s-x-i-{iOSVersion}` |
| `doUPIPayment` | `icor-i-{version}-xx-m-s-x-i-{iOSVersion}` |
| `doWebCheckoutPayment` | `icor-c-{version}-xx-m-s-x-i-{iOSVersion}` |
| `doSubscriptionPayment` | `icor-sbc-{version}-xx-m-s-x-i-{iOSVersion}` |

The plugin version string (`1.0.12`) is hardcoded in `www/CFPaymentGateway.ts` and passed to native on every call — update it when releasing a new version.

### iOS-Specific Notes
- Requires `cordova-plugin-add-swift-support` v2.0.2
- `LSApplicationQueriesSchemes` registered in `plugin.xml` for UPI app intents: `phonepe`, `tez`, `paytmmp`, `bhim`, `upi`, `amazonpay`, `credpay`, `navipay`, `mobikwik`, `myairtel`, `popclubapp`, `super`, `kiwi`
- CocoaPods managed; run `pod install` inside the Xcode project if needed
- `doUPIPayment` on iOS uses `CFDropCheckoutPayment` (same as drop) but hardcodes the component to `["upi"]` only — it does **not** use a dedicated UPI SDK type
- Subscription uses `CFPaymentGatewayService.getInstance().startSubscription()`, not `doPayment()`

### Android-Specific Notes
- `CashfreePGSDK.gradle` is injected into the app's build via `plugin.xml` `<framework>` tag
- minSdkVersion: 23, targetSdkVersion/compileSdkVersion: 35
- AndroidX required (`AndroidXEnabled: true`)
- Drop/Web/UPI use `DropPaymentParser` helpers; Subscription parses JSON manually via `CFSubscriptionSession.CFSubscriptionSessionBuilder`
- Subscription registers its callback separately (`setSubscriptionCheckoutCallback`) inside `startSubscriptionPayment()`, whereas all other methods share the callback set via `setCallback` → `setCheckoutCallback`

## Key Files to Know

- [plugin.xml](plugin.xml) — Authoritative manifest; defines platform dependencies, file mappings, and config injections
- [www/CFPaymentGateway.ts](www/CFPaymentGateway.ts) — All JS validation logic and API surface; edit this, then recompile to `dist/`
- [src/android/CFPaymentGateway.java](src/android/CFPaymentGateway.java) — Android `execute()` dispatcher and callback handler
- [src/ios/CFPaymentGateway.swift](src/ios/CFPaymentGateway.swift) — iOS command handlers and `CFResponseDelegate` implementation
- [example-cordova/config.xml](example-cordova/config.xml) — Example app platform config
