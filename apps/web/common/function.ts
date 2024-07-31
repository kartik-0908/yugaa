export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    // Get day, month, year
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    const year = date.getFullYear();

    // Get hours and minutes
    let hours: number = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursString = hours.toString().padStart(2, '0');

    // Construct the formatted string
    return `${day}-${month}-${year} ${hoursString}:${minutes} ${ampm}`;
}

export function timeDifference(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const totalSeconds = Math.floor(diff / 1000);
    
    if (totalSeconds < 3600) { // Less than an hour
        const minutes = Math.floor(totalSeconds / 60);
        return `${minutes} m`;
    } else if (totalSeconds < 86400) { // Less than a day
        const hours = Math.floor(totalSeconds / 3600);
        return `${hours} h`;
    } else { // Days or more
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return `${days} d`;
    }
}

export function formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${Math.ceil(seconds)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      return `${hours}h`;
    }
  }
