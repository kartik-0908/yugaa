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
