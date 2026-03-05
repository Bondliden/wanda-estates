
const p1 = '1022290';
const p2 = '13b9e88dcae7bf03423e2e5c08f2df629a103c1a';
const url = `https://webapi.resales-online.com/V6/SearchProperties?p1=${p1}&p2=${p2}&p_output=json&p_PropertyStatus=Available&p_MustHavePictures=1&p_PageSize=5&p_PageIndex=1&p_min=1500000`;
console.log("Testing URL:", url);
fetch(url).then(r => r.json()).then(d => {
    console.log("Prices:", d.Property ? d.Property.map(x => x.Price) : "No Property field");
    console.log("Full data keys:", Object.keys(d));
    if (d.transaction) console.log("Transaction:", d.transaction);
}).catch(console.error);
