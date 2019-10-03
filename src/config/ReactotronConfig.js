import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import ReactotronSaga from 'reactotron-redux-saga';

if (__DEV__) {
  const tron = Reactotron.configure()
    .useReactNative()
    .use(reactotronRedux())
    .use(ReactotronSaga())
    .connect();

  tron.clear();

  console.tron = tron;
}
