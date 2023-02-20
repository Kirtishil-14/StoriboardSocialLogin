/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {GoogleSignin} from '@react-native-google-signin/google-signin';

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://2bdb9269bc5f4680be727b563100304d@o4504676716511232.ingest.sentry.io/4504676726931456',
});

const App = () => {
  useEffect(() => {
    //throw new Error('My first Sentry error!');
    GoogleSignin.configure({
      webClientId:
        '834363926742-4n8rcvh9s5pq5megoq3jke8meumbt48t.apps.googleusercontent.com',
    });
  }, []);

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    const user = await auth().signInWithCredential(facebookCredential);
    console.log('facebook user', user);
    // Sign-in the user with the credential
    return user;
  }

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const user = await auth().signInWithCredential(googleCredential);
    console.log('google user', user);
    return user;
  }

  return (
    <SafeAreaView style={styles.demo}>
      <Button
        title="Facebook Sign-In"
        onPress={() =>
          onFacebookButtonPress().then(() =>
            console.log('Signed in with Facebook!'),
          )
        }
      />
      <Button
        title="Google Sign-In"
        onPress={() =>
          onGoogleButtonPress().then(() =>
            console.log('Signed in with Google!'),
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  demo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Sentry.wrap(App);
