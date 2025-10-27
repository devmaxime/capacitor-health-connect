# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-10-26

### Added
- **Aggregate Records API**: New `aggregateRecords()` method for efficiently retrieving aggregated health data
  - Get totals, averages, min/max values grouped by time periods (hour, day, week, month)
  - Supported metrics: Steps, Distance, TotalCaloriesBurned, ActiveCaloriesBurned, HeartRate
  - Much more efficient than reading individual records and aggregating manually
  - Example: Get daily step counts for a month in a single call

### Changed
- Updated TypeScript definitions with new aggregate types and interfaces
- Enhanced documentation with aggregate API examples

## [1.0.0] - 2025-09-26

### Added
- **SleepSession Record Support**: Added support for reading sleep session data from Android Health Connect
  - Includes sleep stages (AWAKE, SLEEPING, OUT_OF_BED, LIGHT, DEEP, REM)
  - Provides detailed sleep session information including start/end times, title, notes, and metadata
  
- **RestingHeartRate Record Support**: Added support for reading resting heart rate data
  - Provides beats per minute measurements with timestamp and metadata