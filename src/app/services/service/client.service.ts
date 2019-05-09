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
        return this.afs.collection('clients', ref => ref.orderBy('name', 'asc').limit(20)).snapshotChanges();
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

}
