import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Product } from '../../models/product';
import { Observable} from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  uploadURL: Observable<string>;

  constructor(
    public afs: AngularFirestore
  ) { }

  getProducts() {
    return this.afs.collection('products', ref => ref.orderBy('name', 'asc')).snapshotChanges();
  }

  addProduct(product: Product) {
    delete product.id;
    return this.afs.collection('products').add(product);
  }

  updateProduct(product: Product) {
    const id = product.id;
    delete product.id;
    return this.afs.doc('products/' + id).update(product);
  }

}
