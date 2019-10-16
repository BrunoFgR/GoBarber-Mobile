import { Alert } from 'react-native';
import { all, takeLatest, call, put } from 'redux-saga/effects';

import api from '~/services/api';

import { signInSucess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const { user, token } = response.data;

    if (user.provider) {
      Alert.alert(
        'Erro de login',
        'O usuário não pode ser prestador de serviço'
      );
      return;
    }

    yield put(signInSucess(token, user));

    api.defaults.headers.Authorization = `Bearer ${token}`;

    // history.push('/dashboard');
  } catch (error) {
    Alert.alert(
      'Falha na autentificação',
      'Houve erro no login, verifique os seus dados'
    );

    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'users', {
      name,
      email,
      password,
    });

    // history.push('/');
  } catch (error) {
    Alert.alert(
      'Falha no cadastro',
      'Houve erro de cadastro, verifique os seus dados'
    );

    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
