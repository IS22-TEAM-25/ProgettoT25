//da dd-mm-yyyy a yyyy-mm-dd
const convertDate = (data) => {
    const [day, month, year] = date.split('-');
    const result = [year, month, day].join('-');
    return result;
}

//da yyyy-mm-dd a dd-mm-yyyy
const convertDate2 = (data) => {
    const [year, month, day] = date.split('-');
    const result = [day, month, year].join('-');
    return result;
}

//To Check all > 0, month <13, day <32

//in formato dd-mm-yyyy
const validateDate = (data) => {
    return String(data).match(
        /\b\d{2}-\d{2}-\d{4}\b/
    );
}

//in formato yyyy-mm-dd
const validateDate2 = (data) => {
    return String(data).match(
        /\b\d{4}-\d{2}-\d{2}\b/
    );
}

module.exports = {validateDate, validateDate2, convertDate, convertDate2};