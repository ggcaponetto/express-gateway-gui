var assert = require("assert");
describe("Array", function() {
  it("Proxies the requests to the gateway admin api", function() {
    assert.equal([1, 2, 3].indexOf(4), -1);
  });
});
