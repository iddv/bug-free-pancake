# Platform Statistics API Requirements

## Overview
We need to implement a new API endpoint to provide real platform statistics instead of hardcoded values. This data will be displayed on the home page and should reflect actual usage metrics from our database.

## Endpoint Specification

### GET /api/stats

This endpoint should return the following statistics:

```json
{
  "activePlayers": 1234,  // Number of active users in the platform
  "gamesWeekly": 456,     // Average number of games per week
  "padelVenues": 25,      // Number of unique venues in the system
  "playerRating": 4.7     // Average player rating from all event ratings
}
```

## Implementation Details

### Active Players
- Count unique users who have joined at least one event in the last 90 days
- Include both registered users and guest participants

### Games Weekly
- Calculate the average number of events per week over the last 30 days
- Round to the nearest whole number

### Padel Venues
- Count unique venues where events have been held
- Only include venues that have hosted events in the last 180 days

### Player Rating
- Calculate the average rating from all player reviews/ratings
- Return as a float with one decimal place (e.g., 4.7)
- If no ratings exist yet, use a default value of 4.8

## Caching Strategy
Since these statistics don't need to be real-time:
- Implement a caching mechanism to store the statistics for 6 hours
- Update the cache when a new event is created or a user joins an event

## Error Handling
- If the database query fails, return appropriate HTTP status code (500)
- Include error details in the response for debugging

## Sample Implementation Pseudocode

```javascript
async function getStats() {
  // Try to get from cache first
  const cachedStats = await cache.get('platform_stats');
  if (cachedStats) return cachedStats;
  
  // Calculate stats from database
  const activePlayers = await countActiveUsers();
  const gamesWeekly = await calculateWeeklyGames();
  const padelVenues = await countUniqueVenues();
  const playerRating = await calculateAverageRating();
  
  const stats = {
    activePlayers,
    gamesWeekly,
    padelVenues,
    playerRating
  };
  
  // Store in cache for 6 hours
  await cache.set('platform_stats', stats, 60 * 60 * 6);
  
  return stats;
}
```

## Timeline
Please implement this endpoint as soon as possible as it is currently showing fake data on the production site. 