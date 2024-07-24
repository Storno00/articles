export default function timeAgo(date: Date): string {
  const now = new Date();

  const msInMinute = 60 * 1000;
  const msInHour = 60 * msInMinute;
  const msInDay = 24 * msInHour;
  const msInMonth = 30 * msInDay;
  const msInYear = 365 * msInDay;

  const diff = now.getTime() - date.getTime();

  if (diff >= msInYear) {
    const years = Math.floor(diff / msInYear);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (diff >= msInMonth) {
    const months = Math.floor(diff / msInMonth);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (diff >= msInDay) {
    const days = Math.floor(diff / msInDay);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diff >= msInHour) {
    const hours = Math.floor(diff / msInHour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diff >= msInMinute) {
    const minutes = Math.floor(diff / msInMinute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `Just now`;
  }
}
