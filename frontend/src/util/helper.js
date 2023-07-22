import dayjs from "dayjs";

/**
 * check the string type dom is valid
 * @param stringV any string value
 * @returns {boolean} if the string is not null
 */
export const isNotNull = (stringV)=>{
    return stringV !== "";
}


/**
 * change the timezone to show a user friendly time
 * @param time  ISO string
 * @returns {string} LocalString
 */
export const transferTimeStamp = (time)=>{
    const date = new Date(time);
    // with date and time
    return date.toLocaleString();
}

/**
 * check the string type dom is valid
 * @param stringV any string value
 * @returns {boolean} if the string is not only spaces or blank
 */
export const isNotBlank = (stringV)=>{
    // have content
    if (stringV!==""){
        // not allow delete the spaces no content
        return RegExp(/^(?!(\s+$))/ ).test(stringV);
    }
    return false;
}

/**
 * check the email valid
 * @param emailV :the email value
 * @returns {boolean} if the email is valid
 */
export const isValidEmail = (emailV)=>{
    return RegExp(/.+@.+\..+/).test(emailV);
}

export const isSmallScreen = ()=> {
    return window.innerWidth < 600;
}

export const isMediumScreen = ()=> {
    return window.innerWidth < 900 && window.innerWidth >= 600;
}

export const isLargeScreen = ()=> {
    return window.innerWidth >= 900;
}

/**
 * check date range is valid for a customer or a host
 * @param availability :the listing's availability
 * @param minDate :the choose minDate from DayRangeChoose
 * @param maxDate :the choose maxDate from DayRangeChoose
 * @returns {boolean} if the date range in availability
 */
 export const isAvailableForDayjs = (availability,minDate,maxDate)=>{
    return isAvailableForDateRange(availability,transferDateRange(minDate,maxDate));
}

/**
 * check date range is valid for a customer or a host
 * @param availability :the listing's availability
 * @param minDate :the minDate string 'DD/MM/YYYY'
 * @param maxDate :the minDate string 'DD/MM/YYYY'
 * @returns {boolean} if the date range in availability
 */
 export const isAvailableForString = (availability,minDate,maxDate)=>{
    const availabilitySet = new Set(availability[0]);
    // check the date range
    let dateRange = dayjs(minDate, 'DD/MM/YYYY');
    const maxDateDayjs = dayjs(maxDate, 'DD/MM/YYYY');
    while(dateRange.isBefore(maxDateDayjs)){
        if(!availabilitySet.has(dateRange.format('DD/MM/YYYY'))){
            return false;
        }
        dateRange = dateRange.add(1, 'day');
    }
    return true;
}


/**
 * check date range is valid for a customer or a host
 * @param availability :the listing's availability
 * @param dateRange : booking's dateRange list  (An array) if book 15-17 then list[15,16]
 * @returns {boolean} if the date range in availability
 */
 export const isAvailableForDateRange = (availability,dateRange)=>{
    const availabilitySet = new Set(availability[0]);
    const dateRangeSet = new Set(dateRange);
    // check the date range
    const flag = new Set([...availabilitySet, ...dateRangeSet]).size === availabilitySet.size;
    return flag;
}


/**
 * transfer the minDate and maxDate to booking's dateRange [minDate,maxDate)
 * @param minDate :the choose minDate from DayRangeChoose
 * @param maxDate :the choose maxDate from DayRangeChoose
 * @returns dateRange : booking's dateRange list  (An array) if book 15-17 then list[15,16]
 */
 export const transferDateRange = (minDate,maxDate)=>{
    const dateRangeList = [];
    let dateRange = minDate.clone();
    while(dateRange.isBefore(maxDate)){
        dateRangeList.push(dateRange.format('DD/MM/YYYY'));
        dateRange = dateRange.add(1, 'day');
    }
    return dateRangeList;
}