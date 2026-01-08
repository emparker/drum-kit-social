/**
 * Date formatting utilities
 */

/**
 * Format a date string into a readable format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string (e.g., "Jan 15, 2024 at 3:45 PM")
 */
export function formatDate(date) {
  const dateObj = new Date(date);

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return dateObj.toLocaleString('en-US', options);
}

/**
 * Get relative time from now (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
  const now = new Date();
  const dateObj = new Date(date);
  const diffMs = now - dateObj;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    // For older dates, show the actual date
    return formatDate(date);
  }
}

/**
 * Format date for short display (e.g., "Jan 15, 2024")
 * @param {string|Date} date - Date to format
 * @returns {string} Short formatted date string
 */
export function formatShortDate(date) {
  const dateObj = new Date(date);

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return dateObj.toLocaleDateString('en-US', options);
}
