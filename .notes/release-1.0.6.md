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
## Automated Play publishing (Gradle Play Publisher)

Wired up `com.github.triplet.play` 3.12.1 (same setup as the Unlokid app; shares the
same keystore and the same service-account JSON):

- `android/build.gradle` — plugin classpath.
- `android/app/build.gradle` — `apply plugin: 'com.github.triplet.play'` + `play { }`
  block. Defaults: **internal** track, status COMPLETED, `defaultToAppBundles`,
  `resolutionStrategy = FAIL` (hard-errors on a duplicate versionCode). Plugin
  auto-disables if no credential is found.
- `android/local.properties` (gitignored) — `googlePlayApiKey=/Users/davidb/.config/unlokid/play-publisher.json`.

Commands:

```bash
# build web + sync first
npm run build && npx cap sync android
# upload signed AAB to the internal track
cd android && JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./gradlew :app:publishReleaseBundle
# promote internal -> production when ready
JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./gradlew :app:promoteArtifact --from-track internal --promote-track production
```

### One-time blocker (2026-07-24): grant the service account access

First `publishReleaseBundle` returned **403 PERMISSION_DENIED** on
`applications/read.tehilim/edits`. The service account
`unlokid-play-publisher@unlokid-499004.iam.gserviceaccount.com` is not yet authorized
on the `read.tehilim` app. Fix in the Play Console of the account that owns
`read.tehilim`:

1. **Users and permissions → Invite new users** → enter the service-account email above.
2. Grant app access to **Read Tehilim** with at least *Release to testing tracks*
   (and *Release to production* if you want to promote from here).
3. Save. Re-run `./gradlew :app:publishReleaseBundle`.

If `read.tehilim` lives in a different developer account than `app.unlokid`, that
account must also have Play Android Developer API access enabled before the invite
works. Until then, upload `app-release.aab` manually.
