import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Product } from '../../models/product';
import { ProductService } from '../../services/service.index';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-carga-inventario',
  templateUrl: './carga-inventario.component.html',
  styleUrls: []
})
export class CargaInventarioComponent implements OnInit {

  arrayBuffer: any;
  file: File;
  arreglo: any = [];
  errores = [];
  actualizados = 0;

  constructor(
    public productService: ProductService,
  ) { }

  ngOnInit() {
  }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  Upload() {
    this.actualizados = 0;
    this.arreglo = [];
    this.errores = [];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.arreglo = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      for (let i = 0; i < this.arreglo.length; i++) {
        console.log(this.arreglo[i]);

        const editSubscribeP = this.productService.getProduct(this.arreglo[i].CODIGO.toString()).subscribe(
          (producto) => {
            this.productService.updateFiled(
              this.arreglo[i].CODIGO.toString(),
              this.arreglo[i].CANTIDAD,
              parseFloat(this.arreglo[i].PRECIO),
              Boolean(JSON.parse(this.arreglo[i].OFFER)),
              parseFloat(this.arreglo[i].PRICEOFFER)).then(() => {
                console.log('Documento editado exitósamente');
                this.actualizados++;

              }, (error) => {
                console.log(error);
                this.errores.push(this.arreglo[i].CODIGO);
              });
            editSubscribeP.unsubscribe();
          });

        /*this.productService.updateDoc(this.arreglo[i].CODIGO).subscribe((res: any) => {
          if (res.length > 0) {
            this.actualizados++;
            let id = res[0].payload.doc.id;
            this.productService.updateFiled(id, this.arreglo[i].CANTIDAD,
              parseFloat(this.arreglo[i].PRECIO), Boolean(JSON.parse(this.arreglo[i].OFFER)), parseFloat(this.arreglo[i].PRICEOFFER));
          } else {
            this.errores.push(this.arreglo[i].CODIGO);
          }
        });*/
      }
    };
    fileReader.readAsArrayBuffer(this.file);
  }

}