// tests/requireAuth.test.js — unit tests for the admin auth middleware
const requireAuth = require("../middleware/requireAuth");

function mocks(session) {
  return {
    req: session === undefined ? {} : { session },
    res: { redirect: jest.fn() },
    next: jest.fn(),
  };
}

describe("requireAuth", () => {
  it("calls next() when session.admin === true", () => {
    const { req, res, next } = mocks({ admin: true });
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });

  it("redirects when session.admin === false", () => {
    const { req, res, next } = mocks({ admin: false });
    requireAuth(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith("/admin/login");
    expect(next).not.toHaveBeenCalled();
  });

  it("redirects safely when session is undefined (does not throw)", () => {
    const { req, res, next } = mocks(undefined);
    expect(() => requireAuth(req, res, next)).not.toThrow();
    expect(res.redirect).toHaveBeenCalledWith("/admin/login");
    expect(next).not.toHaveBeenCalled();
  });

  it("redirects for truthy non-boolean (strict === true contract)", () => {
    const { req, res, next } = mocks({ admin: "true" });
    requireAuth(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith("/admin/login");
    expect(next).not.toHaveBeenCalled();
  });
});
