import Axios from 'axios';

let BASE_URL = `${window.__whiteboardBaseUrl}/streaming-service/api/v1/stream/realm`;
let EVENTS_PROXY = `${window.__whiteboardBaseUrl}/events-proxy-service/api/v1/events/realm`;
let KEYCLOAK_URL = `${window.__whiteboardSSOUrl}auth/admin/realms`;
// const BASE_URL = 'http://localhost:49177/api/v1/stream/realm';

export const setBaseURLs = (service, sso) => {
  BASE_URL = `${service}/streaming-service/api/v1/stream/realm`;
  EVENTS_PROXY = `${service}/events-proxy-service/api/v1/events/realm`;
  KEYCLOAK_URL = `${sso}auth/admin/realms`;
};

export const getSessionList = ({ userId, token, realm, eventId }) =>
  Axios.get(`${BASE_URL}/${realm}/users/${userId}/sessions`, {
    params: {
      app: 'white-board',
      eventId
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

export const createWhiteBoard = (
  { userId, userName, token, realm, eventId },
  title,
  tags
) =>
  Axios.post(
    `${BASE_URL}/${realm}/users/${userId}/sessions`,
    {
      app: 'white-board',
      title,
      tags,
      userName,
      eventId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

export const updateWhiteBoard = (
  { userId, token, realm },
  sessionId,
  title,
  tags
) =>
  Axios.put(
    `${BASE_URL}/${realm}/users/${userId}/sessions/${sessionId}`,
    {
      title,
      tags
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

export const deleteWhiteBoard = ({ userId, token, realm }, sessionId) =>
  Axios.delete(`${BASE_URL}/${realm}/users/${userId}/sessions/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

export const inviteUsers = ({ userId, token, realm }, sessionId, users) =>
  Axios.post(
    `${BASE_URL}/${realm}/users/${userId}/sessions/${sessionId}/invite`,
    { users },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

export const leaveBoard = ({ userId, token, realm }, sessionId) =>
  Axios.post(
    `${BASE_URL}/${realm}/users/${userId}/sessions/${sessionId}/leave`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

export const getHistory = ({ userId, token, realm }, sessionId) =>
  Axios.get(
    `${BASE_URL}/${realm}/users/${userId}/sessions/${sessionId}/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

export const claimControl = ({ userId, token, realm }, sessionId) =>
  Axios.post(
    `${BASE_URL}/${realm}/users/${userId}/sessions/${sessionId}/control`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

export const getUsers = ({ token, realm, eventId }) => {
  if (eventId) {
    return Axios.get(`${EVENTS_PROXY}/${realm}/${eventId}/members`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(({ data }) =>
      data.map(u => ({
        userId: u.email,
        userName: u.name
      }))
    );
  }

  return Axios.get(`${KEYCLOAK_URL}/${realm}/roles/Approved/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(({ data }) =>
    data.map(u => ({
      userId: u.id,
      userName: u.firstName + ' ' + u.lastName
    }))
  );
};
