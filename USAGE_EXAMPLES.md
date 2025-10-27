# Usage Examples

## Aggregate Records (New Feature)

The `aggregateRecords` method allows you to efficiently retrieve aggregated health data grouped by time periods. This is much more efficient than reading all individual records and aggregating them manually.

### Get Daily Steps for a Month

```typescript
import { HealthConnect } from '@devmaxime/capacitor-health-connect';

// Get daily step counts for October 2025
const result = await HealthConnect.aggregateRecords({
  type: 'Steps',
  start: '2025-10-01T00:00:00Z',
  end: '2025-10-31T23:59:59Z',
  groupBy: 'day' // Optional: defaults to 'day'
});

console.log(result.aggregates);
// Output:
// [
//   { startTime: "2025-10-01T00:00:00Z", endTime: "2025-10-02T00:00:00Z", value: 8543, unit: "steps" },
//   { startTime: "2025-10-02T00:00:00Z", endTime: "2025-10-03T00:00:00Z", value: 12456, unit: "steps" },
//   { startTime: "2025-10-03T00:00:00Z", endTime: "2025-10-04T00:00:00Z", value: 9876, unit: "steps" },
//   ...
// ]

// Process the data
const totalSteps = result.aggregates.reduce((sum, day) => sum + day.value, 0);
const averageSteps = totalSteps / result.aggregates.length;

console.log(`Total steps: ${totalSteps}`);
console.log(`Average steps per day: ${averageSteps.toFixed(0)}`);
```

### Get Hourly Steps for a Day

```typescript
// Get hourly step counts for today
const today = new Date();
const startOfDay = new Date(today.setHours(0, 0, 0, 0));
const endOfDay = new Date(today.setHours(23, 59, 59, 999));

const result = await HealthConnect.aggregateRecords({
  type: 'Steps',
  start: startOfDay.toISOString(),
  end: endOfDay.toISOString(),
  groupBy: 'hour'
});

console.log(result.aggregates);
// Output:
// [
//   { startTime: "2025-10-26T00:00:00Z", endTime: "2025-10-26T01:00:00Z", value: 0, unit: "steps" },
//   { startTime: "2025-10-26T01:00:00Z", endTime: "2025-10-26T02:00:00Z", value: 0, unit: "steps" },
//   ...
//   { startTime: "2025-10-26T08:00:00Z", endTime: "2025-10-26T09:00:00Z", value: 1234, unit: "steps" },
//   ...
// ]
```

### Get Weekly Distance

```typescript
// Get weekly distance for the last 3 months
const endDate = new Date();
const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 3);

const result = await HealthConnect.aggregateRecords({
  type: 'Distance',
  start: startDate.toISOString(),
  end: endDate.toISOString(),
  groupBy: 'week'
});

console.log(result.aggregates);
// Output:
// [
//   { startTime: "2025-07-26T00:00:00Z", endTime: "2025-08-02T00:00:00Z", value: 45230.5, unit: "meters" },
//   { startTime: "2025-08-02T00:00:00Z", endTime: "2025-08-09T00:00:00Z", value: 52100.2, unit: "meters" },
//   ...
// ]

// Convert to kilometers
result.aggregates.forEach(week => {
  const km = (week.value / 1000).toFixed(2);
  console.log(`Week starting ${week.startTime}: ${km} km`);
});
```

### Get Daily Calories Burned

```typescript
// Get daily total calories burned for the last 7 days
const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - 7);

const result = await HealthConnect.aggregateRecords({
  type: 'TotalCaloriesBurned',
  start: startDate.toISOString(),
  end: endDate.toISOString(),
  groupBy: 'day'
});

console.log(result.aggregates);
// Output:
// [
//   { startTime: "2025-10-19T00:00:00Z", endTime: "2025-10-20T00:00:00Z", value: 2345.6, unit: "kcal" },
//   { startTime: "2025-10-20T00:00:00Z", endTime: "2025-10-21T00:00:00Z", value: 2198.3, unit: "kcal" },
//   ...
// ]
```

### Get Heart Rate Statistics

```typescript
// Get daily average heart rate for the last month
const endDate = new Date();
const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);

const result = await HealthConnect.aggregateRecords({
  type: 'HeartRate',
  start: startDate.toISOString(),
  end: endDate.toISOString(),
  groupBy: 'day'
});

console.log(result.aggregates);
// Output (includes min, max, and average):
// [
//   { startTime: "2025-09-26T00:00:00Z", endTime: "2025-09-27T00:00:00Z", value: 72, min: 58, max: 145, unit: "bpm" },
//   { startTime: "2025-09-27T00:00:00Z", endTime: "2025-09-28T00:00:00Z", value: 70, min: 55, max: 152, unit: "bpm" },
//   ...
// ]
```

## Comparison: Aggregate vs Read Records

### Using aggregateRecords (Recommended for totals)

```typescript
// Efficient: Gets pre-aggregated daily totals
const result = await HealthConnect.aggregateRecords({
  type: 'Steps',
  start: '2025-10-01T00:00:00Z',
  end: '2025-10-31T23:59:59Z',
  groupBy: 'day'
});

// Result: 30 aggregated records (one per day)
console.log(result.aggregates.length); // 30
```

### Using readRecords (For detailed individual records)

```typescript
// Less efficient for totals: Gets all individual step records
const result = await HealthConnect.readRecords({
  type: 'Steps',
  start: '2025-10-01T00:00:00Z',
  end: '2025-10-31T23:59:59Z'
});

// Result: Potentially hundreds of individual records
console.log(result.records.length); // Could be 500+ records

// You need to manually aggregate by day
const stepsByDay = {};
result.records.forEach(record => {
  const day = record.startTime.split('T')[0];
  if (!stepsByDay[day]) {
    stepsByDay[day] = 0;
  }
  stepsByDay[day] += record.count;
});
```

**Use `aggregateRecords` when:**
- You need totals, averages, or statistics
- You want data grouped by time periods
- Performance is important
- You're dealing with large date ranges

**Use `readRecords` when:**
- You need individual record details (timestamps, metadata, source app, etc.)
- You need to filter or process records in custom ways
- You need access to all record fields

## Supported Aggregate Types

- **Steps**: Total step count
- **Distance**: Total distance in meters
- **TotalCaloriesBurned**: Total calories burned in kcal
- **ActiveCaloriesBurned**: Active calories burned in kcal
- **HeartRate**: Average, min, and max heart rate in bpm

## Supported Group By Periods

- **hour**: Aggregate by hour
- **day**: Aggregate by day (default)
- **week**: Aggregate by week (7 days)
- **month**: Aggregate by month (approximately 30 days)

## Complete Example: Health Dashboard

```typescript
import { HealthConnect } from '@devmaxime/capacitor-health-connect';

async function loadHealthDashboard() {
  // Check if Health Connect is available
  const { availability } = await HealthConnect.checkAvailability();
  if (availability !== 'Available') {
    console.error('Health Connect not available');
    return;
  }

  // Request permissions
  await HealthConnect.requestPermissions({
    read: ['Steps', 'Distance', 'TotalCaloriesBurned', 'HeartRate'],
    write: []
  });

  // Get data for the last 7 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  // Load all metrics in parallel
  const [steps, distance, calories, heartRate] = await Promise.all([
    HealthConnect.aggregateRecords({
      type: 'Steps',
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      groupBy: 'day'
    }),
    HealthConnect.aggregateRecords({
      type: 'Distance',
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      groupBy: 'day'
    }),
    HealthConnect.aggregateRecords({
      type: 'TotalCaloriesBurned',
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      groupBy: 'day'
    }),
    HealthConnect.aggregateRecords({
      type: 'HeartRate',
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      groupBy: 'day'
    })
  ]);

  // Process and display data
  const dashboard = {
    totalSteps: steps.aggregates.reduce((sum, day) => sum + day.value, 0),
    totalDistance: distance.aggregates.reduce((sum, day) => sum + day.value, 0) / 1000, // km
    totalCalories: calories.aggregates.reduce((sum, day) => sum + day.value, 0),
    avgHeartRate: heartRate.aggregates.reduce((sum, day) => sum + day.value, 0) / heartRate.aggregates.length
  };

  console.log('7-Day Health Summary:');
  console.log(`Total Steps: ${dashboard.totalSteps.toLocaleString()}`);
  console.log(`Total Distance: ${dashboard.totalDistance.toFixed(2)} km`);
  console.log(`Total Calories: ${dashboard.totalCalories.toFixed(0)} kcal`);
  console.log(`Average Heart Rate: ${dashboard.avgHeartRate.toFixed(0)} bpm`);

  return dashboard;
}

// Call the function
loadHealthDashboard();
```

