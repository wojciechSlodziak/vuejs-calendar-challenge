export function getMonthName(monthNumber) {
  const monthNames = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June",
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
  ]
  return monthNames[monthNumber]
}

export function dateToString(date) {
  if (date) {
    let utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    return utcDate.toISOString().slice(0, 10);
  }
  return '';
}