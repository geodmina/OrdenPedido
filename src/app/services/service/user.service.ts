import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Username } from '../../models/username';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(public afs: AngularFirestore) {
    }

    getUsers() {
        return this.afs.collection('users', ref => ref.orderBy('name', 'asc')).snapshotChanges();
    }

    getSellers() {
        return this.afs.collection('users', ref => ref.where('role', '==', 'VENDEDOR').orderBy('name', 'asc')).snapshotChanges();
    }

    getUser(uid: any) {
        return this.afs.collection('users').doc(uid).snapshotChanges();
    }

    addUser(user: any) {
        const uid = user.uid;
        delete user.uid;
        delete user.password;
        return this.afs.collection('users').doc(uid).set(user);
    }

    updateUser(user: Username) {
        const uid = user.uid;
        delete user.uid;
        return this.afs.doc('users/' + uid).update(user);
    }

}
