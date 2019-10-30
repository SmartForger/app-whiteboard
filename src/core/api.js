import Axios from 'axios';

const BASE_URL = `${window.__whiteboardBaseUrl}/streaming-service/api/v1/stream/realm`;
const KEYCLOAK_URL = `${window.__whiteboardSSOUrl}auth/admin/realms`;
// const BASE_URL = 'http://localhost:49177/api/v1/stream/realm';

export const getSessionList = ({ userId, token, realm }) =>
  Axios.get(`${BASE_URL}/${realm}/users/${userId}/sessions`, {
    params: {
      app: 'white-board'
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

export const createWhiteBoard = (
  { userId, userName, token, realm },
  title,
  tags
) =>
  Axios.post(
    `${BASE_URL}/${realm}/users/${userId}/sessions`,
    {
      app: 'white-board',
      title,
      tags,
      userName
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

export const getUsers = ({ token, realm }) =>
  Axios.get(`${KEYCLOAK_URL}/${realm}/roles/Approved/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
