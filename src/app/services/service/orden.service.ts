import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Client } from '../../models/client';

@Injectable({
    providedIn: 'root'
})
export class OrdenService {

    constructor(
        public afs: AngularFirestore
    ) {
    }

    getOrdenes() {
        return this.afs.collection('orders', ref => ref.orderBy('numero', 'asc')).snapshotChanges();
    }

    getOrdenesTodas(inicio: any, fin: any) {
        const start = new Date(inicio);
        const end = new Date(fin);
        return this.afs.collection('orders', ref => ref.where('proceso', '==', true)
        .orderBy('fecha', 'asc')
        .where('fecha', '>=', start)
        .where('fecha', '<=', end)
        .orderBy('numero', 'asc')).snapshotChanges();
    }


    getOrdenesFechas(inicio: any, fin: any) {
        const start = new Date(inicio);
        const end = new Date(fin);
        return this.afs.collection('orders', ref => ref.where('facturada', '==', true)
                                    .orderBy('fecha', 'asc')
                                    .where('fecha', '>=', start)
                                    .where('fecha', '<=', end)
                                    .orderBy('numero', 'asc')).snapshotChanges();
    }

    getFacturas() {
        return this.afs.collection('orders', ref => ref.where('facturada', '==', true)
                                    .orderBy('numero', 'asc')).snapshotChanges();
    }

    getFacturasFechas(inicio: any, fin: any) {
        const start = new Date(inicio);
        const end = new Date(fin);
        return this.afs.collection('orders', ref => ref.where('facturada', '==', true)
                                    .orderBy('fecha', 'asc')
                                    .where('fecha', '>=', start)
                                    .where('fecha', '<=', end)
                                    .orderBy('numero', 'asc')).snapshotChanges();
    }

    getGuias(inicio: any, fin: any) {
        const start = new Date(inicio);
        const end = new Date(fin);
        return this.afs.collection('orders', ref => ref.where('despachadas', '==', true)
                                    .orderBy('fecha', 'asc')
                                    .where('fecha', '>=', start)
                                    .where('fecha', '<=', end)
                                    .orderBy('numero', 'asc')).snapshotChanges();
    }

    getFacturaPorVendedor(uid: string) {
        return this.afs.collection('orders', ref => ref.where('facturada', '==', true)
                                    .where('vendedor', '==', uid)
                                    .orderBy('numero', 'asc')).snapshotChanges();
    }

    getFacturaPorVendedorFechas(uid: string, inicio: any, fin: any) {
        const start = new Date(inicio);
        const end = new Date(fin);
        return this.afs.collection('orders', ref => ref.where('vendedor', '==', uid)
                                    .where('facturada', '==', true)
                                    .orderBy('fecha', 'asc')
                                    .where('fecha', '>', start)
                                    .where('fecha', '<', end)).snapshotChanges();
    }

    getOrdenesVendedor(uid: string) {
        return this.afs.collection('orders', ref => ref.where('vendedor', '==', uid)
                                    .orderBy('numero', 'asc')).snapshotChanges();
    }

    getOrdenesVendedorFecha(uid: string, inicio: any, fin: any) {
        const start = new Date(inicio);
        const end = new Date(fin);
        return this.afs.collection('orders', ref => ref.where('vendedor', '==', uid)
                                    .orderBy('fecha', 'asc')
                                    .where('fecha', '>', start)
                                    .where('fecha', '<', end)).snapshotChanges();
    }

    addClient(client: Client) {
        delete client.id;
        return this.afs.collection('clients').add(client);
    }

    updateOrden(orden: any) {
        const id = orden.uid;
        delete orden.uid;
        return this.afs.doc('orders/' + id).update(orden);
    }

    getCities() {
        return this.afs.collection('cities', ref => ref.orderBy('name', 'asc')).snapshotChanges();
    }

    getMetas(vendedor: any, anio: any) {
        return this.afs.collection('metas', ref => ref.where('vendedor', '==', vendedor)
                                                        .where('anio', '==', anio)).snapshotChanges();
    }

    addMeta(meta: any) {
        return this.afs.collection('metas').add(meta);
    }

    updateMeta(meta: any) {
        const id = meta.id;
        delete meta.id;
        console.log(id);
        return this.afs.doc('metas/' + id).update(meta);
    }

}
