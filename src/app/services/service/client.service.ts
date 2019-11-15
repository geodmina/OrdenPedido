import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Client } from '../../models/client';

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    constructor(
        public afs: AngularFirestore
    ) {
    }

    getClients() {
        return this.afs.collection('clients', ref => ref.orderBy('name', 'asc')).snapshotChanges();
    }

    getCliente(uid: any) {
        return this.afs.collection('clients').doc(uid).snapshotChanges();
    }

    addClient(client: Client) {
        delete client.id;
        return this.afs.collection('clients').add(client);
    }

    updateClient(client: Client) {
        const id = client.id;
        delete client.id;
        return this.afs.doc('clients/' + id).update(client);
    }

    getCities() {
        return this.afs.collection('cities', ref => ref.orderBy('name', 'asc')).snapshotChanges();
    }

    updateDoc(uid: any) {
        let doc = this.afs.collection('clients', ref => ref.where('code', '==', uid));
        return doc.snapshotChanges();
    }

    restauraCupo(uid: any, cu: any) {
        return this.afs.collection('clients').doc(uid).update({ cu: cu });
    }

}
