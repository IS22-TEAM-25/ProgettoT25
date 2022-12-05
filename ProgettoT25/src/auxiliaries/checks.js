
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

module.exports = {checkPw, validateEmail};
