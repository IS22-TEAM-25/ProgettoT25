
const checkPw = function(pass){
    if(pass.length < 8 ){
        return false;
    }
    
    if(pass.includes("!") || pass.includes("?")
    || pass.includes(".") || pass.includes(",")
    || pass.includes(";") || pass.includes(":")
    || pass.includes("-") || pass.includes("+")
    || pass.includes("*") || pass.includes("//")){
        return true;
    } else {
        return false;
    }
}

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const validateDate = (data) => {
    return String(data).match(
        /\b\d{2}-\d{2}-\d{4}\b/
    );
}

// const today = new Date();
// const todayRightFormat = new Date(today.getFullYear() + "-" + (today.getMonth() +1) + "-" + today.getDate());

// console.log(today);
// console.log(todayRightFormat);


module.exports = {checkPw, validateEmail, validateDate};
