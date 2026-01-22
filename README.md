# Prayer Times Widget (iOS Only)

A Scriptable widget for iOS/macOS that displays Islamic prayer times based on your current location. The widget fetches real-time prayer times from the Aladhan API and caches data locally for offline access.

## Overview

This script creates responsive widgets in three sizes:
- **Small**: Prayer times list and Next prayer name
- **Medium**: Prayer times list and time until next prayer
- **Lockscreen**: Next prayer name and time only

## Features

- **Location-based**: Automatically detects your current location
- **12-Hour Format**: Displays prayer times in 12-hour format with AM/PM
- **Next Prayer Countdown**: Shows hours and minutes until the next prayer
- **Local Caching**: Saves prayer times locally for offline access

## Main Functions

### Widget Creation

#### `updateScript(hasGoodInternet)`
Pulls the lates version of the script from github
- **Input**: Variable that tells the function whether there is an internet connection
- **Output**: Update Status (success/error)

#### `createSmallWidget(timings)`
Creates a medium-sized widget displaying all prayer times in a clean list format.
- **Input**: Object with prayer names and times
- **Output**: ListWidget with prayer times, and next prayer name

#### `createMediumWidget(timings)`
Creates a medium-sized widget displaying all prayer times in a clean list format.
- **Input**: Object with prayer names and times
- **Output**: ListWidget with prayer times, and time until next prayer

#### `createLockscreenWidget(timings)`
Creates a lockscreen widget showing only the next prayer and its time.
- **Input**: Object with next prayer information
- **Output**: Compact ListWidget for lockscreen

#### `createWidget(timings)`
Main function that creates the appropriate widget based on `config.widgetFamily`.

### Time Management

#### `formatPrayerTimes(timings)`
Converts 24-hour prayer times from the API to 12-hour format with AM/PM.
- Handles all 7 prayer times: Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, Midnight
- **Returns**: Object with formatted times (e.g., "5:30 AM")

#### `getTimeUntilNextPrayer(timings)`
Calculates which prayer comes next and how much time remains.
- Compares current time with all prayer times
- Handles day rollover (if no prayers remain today, next is Fajr tomorrow)
- **Returns**: Object with `prayer` name, `hours`, and `minutes` until next prayer

### Network & Data

#### `hasGoodInternet(timeoutSeconds = 2)`
Async function that tests internet connectivity by pinging Google's connectivity check server.
- **Default timeout**: 2 seconds
- **Returns**: `true` if connected, `false` if offline or timeout

### Data Flow

1. **Internet Check**: Tests connectivity with `hasGoodInternet()`
2. **Online Path**:
   - Gets current location using `Location.current()`
   - Formats today's date as DD-MM-YYYY
   - Calls Aladhan API: `https://api.aladhan.com/v1/timings/{date}?latitude={lat}&longitude={lon}`
   - Saves response to local file: `prayer_timings.json`
3. **Offline Path**:
   - Retrieves cached `prayer_timings.json` from Scriptable's documents folder
   - Uses cached data if available; shows error message if not

## API Integration

**Service**: Aladhan Prayer Times API (v1)
- **Endpoint**: `https://api.aladhan.com/v1/timings/{date}`
- **Parameters**: 
  - `date`: DD-MM-YYYY format
  - `latitude`: Device latitude
  - `longitude`: Device longitude
- **Response**: JSON with prayer times for the specified date and location

## File Storage

- **Cache Location**: Scriptable's local documents folder
- **Cache File**: `prayer_timings.json`
- **Purpose**: Enables offline access when internet is unavailable

## Times Displayed

1. **Fajr**
2. **Sunrise**
3. **Dhuhr**
4. **Asr**
5. **Maghrib**
6. **Isha**
7. **Midnight**

## Color Scheme

- **Background**: Dark gray (#1A1A1A)
- **Text**: White
- **Accent**: Orange (for next prayer countdown)

## Usage

1. Add this script to Scriptable app
2. Create a new widget on your home screen or lock screen
3. Select this script as the widget source
4. Choose widget size (small/medium)
5. Widget will automatically update every few minutes with new prayer times
6. To pull the latest version of the script, run the script directly from Scriptable

