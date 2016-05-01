var request = require("supertest");
describe("starting express", function() {
    var server;
    beforeEach(function() {
        server = require("../server")();
    });
    afterEach(function(done) {
        server.close(done);
    });
    it("responds to root", function testRoot(done) {
        request(server)
            .get("/")
            .expect(200, done);
    });
    it("responds to task index", function testTaskIndex(done) {
        request(server)
            .get("/tasks")
            .expect(200, done);
    });
    it("responds to task show", function testTaskShow(done) {
        request(server)
            .get("/tasks/1")
            .expect(200, done);
    });
    it("404s a bad index", function testBadIndex(done) {
        request(server)
            .get("/foo")
            .expect(404, done);
    });
    it("404s a bad show", function testBadShow(done) {
        request(server)
            .get("/foo/1")
            .expect(404, done);
    });
});
