var request = require("supertest");
describe("starting express", function() {
    var server;
    beforeEach(function() {
        server = require("../server")();
    });
    afterEach(function(done) {
        server.close(done);
    });
    it("receives welcome page from root", function testRoot(done) {
        request(server)
            .get("/")
            .expect("Content-type", "text/html; charset=UTF-8")
            .expect(200, done);
    });
    it("responds to task index", function testTaskIndex(done) {
        request(server)
            .get("/tasks")
            .expect(200, {title: "Task Index"}, done);
    });
    it("responds to task show", function testTaskShow(done) {
        var id = "1";
        request(server)
            .get("/tasks/" + id)
            .expect(200, {id: id, title: "Task Show"}, done);
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
