# Recovery Guide for Visa Checker

This guide helps you recover from common development environment issues.

## Package Manager: npm

This project uses **npm** (not yarn). Stick with npm to avoid lockfile conflicts.

## Quick Reference

| Problem | Solution |
|---------|----------|
| Metro won't connect | `npm run clean:cache && npm start` |
| Bundling errors | `npm run clean:metro && npm start` |
| Dependency issues | `npm run reinstall` |
| Everything broken | `npm run nuke` |

---

## Issue: Metro/Expo Dev Server Won't Connect

**Symptoms:**
- "Could not connect to development server"
- Expo Go can't reach Metro bundler
- Hot reload stopped working

**Fix:**
```bash
# 1. Kill existing processes
pkill -f "expo start"
pkill -f "metro"

# 2. Clear caches
npm run clean:cache
npm run clean:metro

# 3. Restart
npm start --clear
```

---

## Issue: node_modules Corrupted (ENOTEMPTY errors)

**Symptoms:**
- `rm -rf node_modules` fails with "directory not empty"
- `npm install` hangs or fails
- Random "module not found" errors

**Fix (Standard):**
```bash
# Try the built-in script first
npm run clean:modules
npm install
```

**Fix (If standard fails):**
```bash
# 1. Close all terminals, editors, and apps using the project

# 2. Kill any node processes
pkill -f node

# 3. Wait 5 seconds for file handles to release
sleep 5

# 4. Force remove with sudo
sudo rm -rf node_modules

# 5. Clear npm cache
npm cache clean --force

# 6. Reinstall
npm install
```

**Fix (Nuclear option - if sudo rm still fails):**
```bash
# 1. Reboot your Mac (releases all file handles)

# 2. After reboot, immediately run:
cd /path/to/visa-checker-clean
rm -rf node_modules
npm install
```

---

## Issue: Wrong Node Version

**Symptoms:**
- `toReversed is not a function`
- Syntax errors in modern JS
- Expo commands fail silently

**Fix:**
```bash
# 1. Install Node 20 via nvm
nvm install 20

# 2. Use it
nvm use 20

# 3. Set as default
nvm alias default 20

# 4. Verify
node --version  # Should show v20.x.x
```

---

## Issue: Low Disk Space Causing Corruption

**Symptoms:**
- Install fails partway through
- Random file corruption
- "No space left on device" errors

**Prevention:**
```bash
# Check disk space
df -h /

# Should have >20% free (shown in "Avail" column)
```

**Fix:**
```bash
# 1. Free up space first
# - Empty Trash
# - Clear ~/Library/Caches
# - Remove old Xcode simulators: xcrun simctl delete unavailable

# 2. Clean npm global cache
npm cache clean --force

# 3. Clean this project
npm run clean:full

# 4. Reinstall
npm install
```

---

## Issue: Tunnel Mode Not Working

**Symptoms:**
- QR code won't scan
- "Tunnel URL not found"
- Timeout connecting via tunnel

**Fix:**
```bash
# 1. Check ngrok/cloudflared isn't blocked
# (Some corporate networks block tunneling)

# 2. Restart with fresh tunnel
pkill -f "expo start"
npm run start:tunnel

# 3. If still failing, try local network instead
npm start
# Then press 'l' to switch to LAN mode
```

---

## Issue: TypeScript Errors in Tests

**Symptoms:**
- `Cannot find name 'describe'`
- `Cannot find name 'jest'`

**This is expected.** Test files are excluded from `tsconfig.json` to avoid conflicts with Jest's own types. Tests still run correctly via `npm test`.

---

## Full Reset Procedure

When nothing else works:

```bash
# 1. Stop everything
pkill -f "expo start"
pkill -f "metro"
pkill -f "node"

# 2. Nuclear clean
npm run nuke

# 3. If nuke fails, do it manually:
rm -rf node_modules
rm -rf .expo
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*
rm -f package-lock.json
npm cache clean --force
npm install
npm start --clear
```

---

## Prevention Tips

1. **Always use Node 20**: The `.nvmrc` file ensures this. Run `nvm use` when entering the project.

2. **Keep disk space >20% free**: Low disk space during `npm install` causes corruption.

3. **Don't force-kill npm install**: Let it finish or fail naturally. Interrupting causes partial installs.

4. **Use tunnel mode for iPhone testing**: More reliable than local network on complex WiFi setups.

5. **Clear caches weekly**: Run `npm run clean:cache` periodically to prevent Metro cache bloat.

---

## Available Scripts

```bash
npm run clean:cache    # Clear .expo and Metro caches
npm run clean:metro    # Clear Metro bundler temp files
npm run clean:npm      # Clear npm global cache
npm run clean:modules  # Remove node_modules and package-lock.json
npm run clean:full     # All of the above combined
npm run reinstall      # Clean + fresh npm install
npm run nuke           # Clean + install + start with cleared cache
```
