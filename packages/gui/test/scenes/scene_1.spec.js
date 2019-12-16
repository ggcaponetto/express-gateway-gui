const requests = require("../../src/App.js").requests;

const config = {
  host: "http://localhost:9877"
};

describe("Users", function() {
  it("Fills the express-gateway with users.", async function() {
    const allRequests = [];
    for(let i = 0; i < 5; i++){
      let request = requests.createUser({
        "username": `steve-${i}`,
        "firstname": `Com-${i}`,
        "lastname": `Truise-${i}`,
        "email": `com.truise-${i}@somesite.com`,
        "redirectUri": "http://somesite.com"
      }, config).catch((e) => {
        console.error("error", e);
      });
      allRequests.push(request);
    }
    return await Promise.all(allRequests);
  });
});
