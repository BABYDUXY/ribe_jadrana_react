const request = require("supertest"); // OVO DVOJE NAM SKORO VUIJEK TREBA
const app = require("../test-server.js");

it("Da ruta vraća sve ribe", async () => {
  const res = await request(app).get("/");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

it("Da ruta vraća sve bijele ribe", async () => {
  const res = await request(app).get("/bijele");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

it("Da ruta vraća sve plave ribe", async () => {
  const res = await request(app).get("/plave");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

it("Da ruta vraća sve otrovne ribe", async () => {
  const res = await request(app).get("/otrovne");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

it("Da ruta vraća sve ulove", async () => {
  const res = await request(app).get("/objave/ulovi");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});
