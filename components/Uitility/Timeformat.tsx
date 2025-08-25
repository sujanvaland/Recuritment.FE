
// Helper function to get relative time
function  getRelativeTime  (dateString: string): string  {
  const now = new Date()
  const appliedDate = new Date(dateString)
  const diffInMs = now.getTime() - appliedDate.getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  // Check if it's today
  const today = new Date()
  const isToday = appliedDate.toDateString() === today.toDateString()
  
  if (isToday) {
    return "Today"
  }
  
  // Check if it's yesterday
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = appliedDate.toDateString() === yesterday.toDateString()
  
  if (isYesterday) {
    return "Yesterday"
  }
  
  if (diffInYears >= 1) {
    return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`
  }
  
  if (diffInMonths >= 1) {
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`
  }
  
  if (diffInWeeks >= 1) {
    return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`
  }
  
  if (diffInDays >= 1) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`
  }
  
  if (diffInHours >= 1) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`
  }
  
  if (diffInMinutes >= 1) {
    return diffInMinutes === 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`
  }
  
  return "Just now"
}

export { getRelativeTime }