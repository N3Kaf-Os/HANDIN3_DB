// tests/gatekeeper.test.js — unit tests for the public-site gatekeeper middleware.
const gatekeeper = require("../middleware/gatekeeper");

function mocks({ session, path }) {
  return {
    req: session === undefined ? { path } : { session, path },
    res: { redirect: jest.fn() },
    next: jest.fn(),
  };
}

describe("gatekeeper", () => {
  it("calls next() when session.entered === true", () => {
    const { req, res, next } = mocks({ session: { entered: true }, path: "/" });
    gatekeeper(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });

  it("redirects to /enter when session.entered is missing", () => {
    const { req, res, next } = mocks({ session: {}, path: "/" });
    gatekeeper(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith("/enter");
    expect(next).not.toHaveBeenCalled();
  });

  it("redirects safely when session is undefined (does not throw)", () => {
    const { req, res, next } = mocks({ session: undefined, path: "/" });
    expect(() => gatekeeper(req, res, next)).not.toThrow();
    expect(res.redirect).toHaveBeenCalledWith("/enter");
  });

  it("never redirects requests to /enter itself (no loop)", () => {
    const { req, res, next } = mocks({ session: {}, path: "/enter" });
    gatekeeper(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });

  it("lets /css/ static assets through", () => {
    const { req, res, next } = mocks({ session: {}, path: "/css/style.css" });
    gatekeeper(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("lets /uploads/ static assets through", () => {
    const { req, res, next } = mocks({ session: {}, path: "/uploads/foo.png" });
    gatekeeper(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("lets /admin routes through (admin has its own auth)", () => {
    const { req, res, next } = mocks({ session: {}, path: "/admin/login" });
    gatekeeper(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
