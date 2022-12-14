const HOST = "http://localhost:8080"
const APIrec = "/api/r"
const APItran = "/api/t"
const APIann = "/api/a"

var valore;

const commuteRating = async (id) => {
    const URL = HOST+APIrec+"/getrv/"+id;
     fetch(URL).then(data => {
        return data.text();
    }).then(items => {
        const list = JSON.parse("" + items);
        const n = list.length;
        let sum=0;
        for(let i =0;i<n;i++){
            sum+=list[i].stelle;
        }
        valore = sum/n;
        return sum/n;
    });
}

module.exports = {commuteRating, valore};
