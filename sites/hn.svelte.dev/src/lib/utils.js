export const timeAgo = (/** @type {number}*/ timestampSeconds) => {
	const seconds = Math.floor(Date.now() / 1000) - timestampSeconds;
	const minutes = seconds / 60;
	const hours = minutes / 60;
	const days = hours / 24;
	const weeks = days / 7;
	const months = days / 30.436875; // 365.2425 days average split over 12 months
	const years = days / 365.2425;
	if (years >= 1) {
		const roundYears = Math.floor(years);
		return `${roundYears} year${roundYears !== 1 ? 's' : ''} ago`;
	} else if (months >= 1) {
		const roundMonths = Math.floor(months);
		return `${roundMonths} month${roundMonths !== 1 ? 's' : ''} ago`;
	} else if (weeks >= 1) {
		const roundWeeks = Math.floor(days);
		return `${roundWeeks} week${roundWeeks !== 1 ? 's' : ''} ago`;
	} else if (days >= 1) {
		const roundDays = Math.floor(days);
		return `${roundDays} day${roundDays !== 1 ? 's' : ''} ago`;
	} else if (hours >= 1) {
		const roundHours = Math.floor(hours);
		return `${roundHours} hour${roundHours !== 1 ? 's' : ''} ago`;
	} else if (minutes >= 1) {
		const roundMinutes = Math.floor(minutes);
		return `${roundMinutes} minute${roundMinutes !== 1 ? 's' : ''} ago`;
	}
	const roundSeconds = Math.floor(seconds);
	return `${roundSeconds} second${roundSeconds !== 1 ? 's' : ''} ago`;
};
