import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Product } from '../../models/product';
import { Observable} from 'rxjs';
import { finalize, take} from 'rxjs/operators';

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

  getProduct(uid: any) {
    return this.afs.collection('products').doc(uid).snapshotChanges();
  }

  getProductStock(uid: any) {
    return this.afs.collection('products', ref => ref.where('productId', '==', uid));
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

  updateDoc(uid: any) {
    let doc = this.afs.collection('products', ref => ref.where('productId', '==', uid));
    return doc.snapshotChanges();
  }

  updateFiled(uid: any, stock: number, price: number, offer: boolean, priceoffer: number) {
    return this.afs.collection('products').doc(uid).update({stock: stock, price: price, offer: offer, priceOffer: priceoffer});
  }

  restauraStock(uid: any, stock: any) {
    return this.afs.collection('products').doc(uid).update({ stock: stock });
}

  /*updateStock(product: Product) {
    console.log(product);
    const id = product.productId;
    return this.afs.doc('products/' + id).update(product);
  }*/

}
