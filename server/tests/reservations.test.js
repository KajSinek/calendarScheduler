const request = require("supertest");
const baseURL = "http://localhost:8080";
const { MongoClient, ObjectId } = require("mongodb");

describe("POST /calendar", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(
      "mongodb+srv://KajSinek:159357Tt.@testingmongodb.44ljh.mongodb.net/?retryWrites=true&w=majority"
    );
    db = await connection.db("test");
  });

  afterAll(async () => {
    await connection.close();
  });

  const req = {};
  let id;

  req.body = {};
  req.body = {
    title: "Reserved",
    name: "Tibor Kratky",
    email: "tiborkratky9@gmail.com",
    telnum: "0904312302",
    dateStart: "2022-09-03",
    timeStart: "08:00",
    dateEnd: "2022-09-03",
    timeEnd: "08:30",
  };

  it("should return 201", async () => {
    expect.assertions(8);
    await request(baseURL)
      .post("/calendar")
      .send(req.body)
      .expect(201)
      .then(async (response) => {
        expect(response._body.data._id).toBeTruthy();
        expect(response._body.data.title).toBe(req.body.title);
        expect(response._body.data.email).toBe(req.body.email);
        expect(response._body.data.telnum).toBe(req.body.telnum);
        expect(response._body.data.dateStart).toBe(req.body.dateStart);
        expect(response._body.data.timeStart).toBe(req.body.timeStart);
        expect(response._body.data.dateEnd).toBe(req.body.dateEnd);
        expect(response._body.data.timeEnd).toBe(req.body.timeEnd);
        id = response._body.data._id;
      });
  });

  it("should return 400", async () => {
    expect.assertions(2);
    await request(baseURL)
      .post("/calendar")
      .send(req.body)
      .expect(400)
      .then(async (response) => {
        expect(response._body.error).toBeDefined();
        expect(response._body.message).toBeDefined();
        const calendar = db.collection("calendaradds");
        await calendar.deleteOne({
          _id: ObjectId(id),
        });
      });
  });

  it("should return 201", async () => {
    expect.assertions(1);
    req.body = {};
    req.body.dateStart = "2022-08-01";
    await request(baseURL)
      .post("/calendarGetWeek")
      .send(req.body)
      .expect(201)
      .then(async (response) => {
        expect(response._body.data).toBeDefined();
      });
  });

  it("should return 201", async () => {
    expect.assertions(1);
    req.body = {};
    req.body.dateStart = "2022-08-01";
    req.body.email = "tiborkratky9@gmail.com";
    await request(baseURL)
      .post("/calendarGetWeekEmail")
      .send(req.body)
      .expect(201)
      .then(async (response) => {
        expect(response._body.data).toBeDefined();
      });
  });

  it("should return 201", async () => {
    expect.assertions(1);
    req.body = {};
    req.body.dateStart = "2022-08-02";
    req.body.email = "tiborkratky9@gmail.com";
    await request(baseURL)
      .post("/calendarGetWeekEmail")
      .send(req.body)
      .expect(201)
      .then(async (response) => {
        expect(response._body.data).toBeDefined();
      });
  });
});
