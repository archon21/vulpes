import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage'
import { config } from '../../secrets.js';

firebase.initializeApp(config);

export const storage = firebase.storage()
export const db = firebase.firestore();
export const Auth = firebase.auth();
