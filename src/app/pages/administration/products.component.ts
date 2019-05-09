import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/service.index';
import { NgForm, FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styles: []
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  oculto = 'oculto';
  objProduct: Product = new Product();
  action = '';
  titleModal = '';
  titleCancel = '';

  imageLoad: File;
  imageTemp: string;

  loading = true;

  constructor(
    private productService: ProductService,
    private _storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  selectImage( file: File ) {
    if ( !file ) {
      this.imageLoad = null;
      return;
    }

    if ( file.type.indexOf('image') < 0 ) {
      this.swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imageLoad = null;
      return;
    }

    this.imageLoad = file;

    const reader = new FileReader();
    const urlImageTemp = reader.readAsDataURL( file );

    reader.onloadend = () => this.imageTemp = reader.result.toString();
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      products => {
        this.products = products.map(
            e => {
                return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data()
                } as Product;
            }
        );
        this.loading = false;
      }
    );
  }

  newProduct() {
    this.oculto = '';
    this.objProduct = new Product();
    this.objProduct.offer = false;
    this.action = 'new';
    this.titleModal = 'Registro de producto';
    this.titleCancel = '¿Desea descartar el ingreso del nuevo producto?';
  }

  actionForm( form: NgForm ) {
    if ( this.action === 'new' ) {
      this.createProduct(form);
    }
    if ( this.action === 'edit' ) {
      this.updateProduct(form);
    }
  }

  createProduct( form: NgForm ) {
    if (!this.imageLoad){
      this.swal('Error', 'Debe elegir una imagen para el producto', 'error');
      return;
    }
    if ( form.invalid ) { return; }
    // Generate a random ID
    const randomId = Math.random().toString(36).substring(2);
    console.log(randomId);
    const filepath = `images/${randomId}`;
    const fileRef = this._storage.ref(filepath);
    // Upload image
    const task = this._storage.upload(filepath, this.imageLoad);
    return task.snapshotChanges()
    .pipe(
      finalize(
        () => {
          fileRef.getDownloadURL().subscribe(url => {
            form.value.image = url;
            this.productService.addProduct(form.value)
              .then(
                data => {
                  this.oculto = 'oculto';
                  this.action = '';
                  this.swal('Registro guardado', 'Producto registrado de manera exitosa', 'success');
                  form.resetForm();
                  this.objProduct = new Product();
                }
              )
              .catch(
                error => {
                  this.swal('Error', 'Error al registrar cliente', 'error');
                }
              );
          });
        }
      )
    ).subscribe();

  }

  editProduct(product: Product) {
    this.oculto = '';
    this.objProduct = product;
    this.action = 'edit';
    this.titleModal = 'Modificación de producto';
    this.titleCancel = '¿Desea descartar la modificación del producto?';
  }

  updateProduct(form: NgForm) {
    if ( form.invalid ) { return; }
    if (this.imageLoad){
      // Generate a random ID
      const randomId = Math.random().toString(36).substring(2);
      console.log(randomId);
      const filepath = `images/${randomId}`;
      const fileRef = this._storage.ref(filepath);
      // Upload image
      const task = this._storage.upload(filepath, this.imageLoad);
      return task.snapshotChanges()
      .pipe(
        finalize(
          () => {
            fileRef.getDownloadURL().subscribe(url => {
              form.value.image = url;
              this.productService.updateProduct(form.value)
                .then(
                  data => {
                    this.oculto = 'oculto';
                    this.action = '';
                    this.swal('Registro modificado', 'Producto modificado de manera exitosa', 'success');
                    form.resetForm();
                    this.objProduct = new Product();
                  }
                );
            });
          }
        )
      ).subscribe();
    } else {
      this.productService.updateProduct(form.value)
      .then(
        data => {
          this.oculto = 'oculto';
          this.action = '';
          this.swal('Registro modificado', 'Producto modificado de manera exitosa', 'success');
          form.resetForm();
          this.objProduct = new Product();
        }
      );
    }
  }

  closeModal() {
    Swal.fire({
      title: '¿Está seguro?',
      text: this.titleCancel,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'No',
      cancelButtonColor: '#d33'
    })
    .then((result) => {
      if (result.value) {
          this.objProduct = new Product();
          this.objProduct.offer = false;
          this.oculto = 'oculto';
          this.action = '';
      }
    });
  }

  swal(title: string, text: string, type: any) {
    Swal.fire(
      {
        title: title,
        text: text,
        type: type
      }
    );
  }

}
