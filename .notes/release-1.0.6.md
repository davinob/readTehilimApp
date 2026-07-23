# Release 1.0.6 (versionCode 10008) — Jul 2026

## What's in this build
- **Favorites open on the lowest chapter.** Favorites are now sorted numerically on
  save/load/parse, so opening Favorites lands on the numerically-first favorite (top of
  the list) instead of whichever chapter was added first (which often showed up as the
  second item in the list). See commit `ddad10d`.

## Version
- `versionCode`: 10007 → **10008**
- `versionName`: 1.0.5 → **1.0.6**
- `android/app/build.gradle`

## Build / deploy notes
- Toolchain: **Capacitor 8 needs JDK 21** (`/opt/homebrew/opt/openjdk@21`). JDK 17 fails
  with `invalid source release: 21` on `:capacitor-android:compileReleaseJavaWithJavac`.
- Steps:
  ```bash
  npm run build
  npx cap sync android
  cd android && JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./gradlew bundleRelease
  ```
- Signed AAB output: `android/app/build/outputs/bundle/release/app-release.aab`
  (signed with `/Users/davidb/PycharmProjects/work/my-release-key.keystore`).
- **Play upload is manual** — no service account / Gradle Play Publisher is configured for
  this app. Upload the AAB in the Play Console (app `read.tehilim`).
