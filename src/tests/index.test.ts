import request from 'supertest';
import { singleServer } from '../server/singleServer';
import { BASE_URL } from '../constants';
import { HttpStatusCode } from '../types';
import { flushDB } from '../controllers';
import { MAP_ERROR } from '../errors/apiError';
import { v4 as uuidv4 } from 'uuid';

const user = {
  username: 'Sasha',
  hobbies: ['sport', 'js'],
  age: 35,
};

const userToUpdate = {
  username: 'Julia',
  hobbies: ['reading'],
  age: 32,
};

const invalidId = '92';
const invalidRoute = '/some-non/existing/resource';
const randomUserId = uuidv4();

const server = singleServer();

describe('Testing of CRUD API', () => {
  beforeAll(async () => {
    await flushDB();
  });

  afterAll(done => {
    server.close();
    flushDB();
    done();
  });

  describe('Scenario with correct data:', () => {
    test('should return empty array of users', async () => {
      await request(server).get(BASE_URL).expect(HttpStatusCode.OK, { users: [] });
    });

    test('should create user and return newly created record', async () => {
      await request(server)
        .post(BASE_URL)
        .send(user)
        .expect(res => {
          expect(res.statusCode).toEqual(HttpStatusCode.CREATED);
          expect(res.body).toStrictEqual({
            id: expect.any(String),
            age: user.age,
            hobbies: user.hobbies,
            username: user.username,
          });
        });
    });

    test('should return array with new user', async () => {
      await request(server)
        .get(BASE_URL)
        .expect(res => {
          expect(res.statusCode).toEqual(HttpStatusCode.OK);
          expect(res.body).toStrictEqual({
            users: [
              {
                id: expect.any(String),
                age: user.age,
                hobbies: user.hobbies,
                username: user.username,
              },
            ],
          });
        });
    });

    test('should return user by id', async () => {
      const response = await request(server).get(BASE_URL);
      const [user] = response.body.users;
      await request(server)
        .get(`${BASE_URL}/${user.id}`)
        .expect(res => {
          expect(res.statusCode).toEqual(HttpStatusCode.OK);
          expect(res.body).toStrictEqual({
            id: user.id,
            age: user.age,
            hobbies: user.hobbies,
            username: user.username,
          });
        });
    });

    test('should update user by id and return updated record', async () => {
      const response = await request(server).get(BASE_URL);
      const [user] = response.body.users;

      await request(server)
        .put(`${BASE_URL}/${user.id}`)
        .send(userToUpdate)
        .expect(res => {
          expect(res.statusCode).toEqual(HttpStatusCode.OK);
          expect(res.body).toStrictEqual({
            id: user.id,
            age: userToUpdate.age,
            hobbies: userToUpdate.hobbies,
            username: userToUpdate.username,
          });
        });
    });

    test('should delete user by id', async () => {
      const response = await request(server).get(BASE_URL);
      const [user] = response.body.users;

      await request(server).delete(`${BASE_URL}/${user.id}`).expect(HttpStatusCode.NO_CONTENT);
    });

    test('should return empty array of users', async () => {
      await request(server).get(BASE_URL).expect(HttpStatusCode.OK, { users: [] });
    });
  });

  describe('Scenario with invalid id:', () => {
    test('should return NOT_VALID_ID error when get user by invalid id', async () => {
      await request(server)
        .get(`${BASE_URL}/${invalidId}`)
        .expect(HttpStatusCode.BAD_REQUEST, {
          error: { message: MAP_ERROR.NOT_VALID_ID.message },
        });
    });

    test('should return NOT_VALID_ID error when update user by invalid id', async () => {
      await request(server)
        .put(`${BASE_URL}/${invalidId}`)
        .send(userToUpdate)
        .expect(HttpStatusCode.BAD_REQUEST, {
          error: { message: MAP_ERROR.NOT_VALID_ID.message },
        });
    });

    test('should return NOT_VALID_ID error when delete user by invalid id', async () => {
      await request(server)
        .delete(`${BASE_URL}/${invalidId}`)
        .expect(HttpStatusCode.BAD_REQUEST, {
          error: { message: MAP_ERROR.NOT_VALID_ID.message },
        });
    });
  });

  describe('Scenario with not founded user or non-existing endpoint:', () => {
    test('should return PAGE_NOT_FOUND error for non-existing endpoint', async () => {
      await request(server)
        .get(invalidRoute)
        .expect(HttpStatusCode.NOT_FOUND, { error: { message: MAP_ERROR.PAGE_NOT_FOUND.message } });
    });

    test('should return USER_NOT_EXIST error for not founded user', async () => {
      await request(server)
        .get(`${BASE_URL}/${randomUserId}`)
        .expect(HttpStatusCode.NOT_FOUND, { error: { message: MAP_ERROR.USER_NOT_EXIST.message } });
    });

    test('should return USER_NOT_EXIST error for trying to update not founded user', async () => {
      await request(server)
        .get(`${BASE_URL}/${randomUserId}`)
        .send(userToUpdate)
        .expect(HttpStatusCode.NOT_FOUND, { error: { message: MAP_ERROR.USER_NOT_EXIST.message } });
    });

    test('should return USER_NOT_EXIST error for trying to delete not founded user', async () => {
      await request(server)
        .delete(`${BASE_URL}/${randomUserId}`)
        .expect(HttpStatusCode.NOT_FOUND, { error: { message: MAP_ERROR.USER_NOT_EXIST.message } });
    });
  });
});
