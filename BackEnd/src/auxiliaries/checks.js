
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

module.exports = {checkPw, validateEmail, validateDate};
