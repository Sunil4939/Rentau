export default (date, time) => {
    console.log("combine date time : ", date, time)
 
    console.log("convertTime12to24 : ", convertTime12to24(time))
    time = convertTime12to24(time)
    var timeString = time + ':00Z';
    // var timeString = time.getHours() + ':' + time.getMinutes() + ':00Z';

    // var ampm = time.getHours() >= 12 ? 'PM' : 'AM';
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1; // Jan is 0, dec is 11
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var dateString = year + '-' + month + '-' + day;
    var datec = dateString + 'T' + timeString;
    var combined = new Date(datec);
    console.log("combine combined : ", datec, combined)

    return combined;
};

const convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
}