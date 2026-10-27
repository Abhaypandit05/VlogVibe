// Format date to human-readable format
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Format relative time (e.g., "5 minutes ago", "2 hours ago", "yesterday")
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  return formatDate(dateString);
};

// Calculate estimated reading time
export const calculateReadingTime = (content) => {
  if (!content) return '1 min read';
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

// Generate fallback avatar URL
export const getAvatarUrl = (user) => {
  if (user?.avatar && user.avatar.trim() !== '') {
    return user.avatar;
  }
  const name = user?.name || user?.username || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=6366f1&color=fff&bold=true`;
};
