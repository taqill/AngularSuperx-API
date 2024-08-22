import { Component, inject, EventEmitter } from '@angular/core';

//Form Import
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

// Form field ,select, button, icon and input imports
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

//Card Import
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';

import {
  MatDialogRef,
  MatDialog,
  MatDialogContent,
} from '@angular/material/dialog';

// import ProductService
import { ProductService } from '../../services/product.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

//import datePicker
// Date Picker
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule, NativeDateAdapter, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core'
import { formatDate } from '@angular/common';
const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];
export class ThaiDateAdapter2 extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1; // Monday
  }

  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    // Return the custom Thai month names
    return THAI_MONTHS;
  }
  override format(date: Date, displayFormat: any): string {
    // Format the date according to the Buddhist calendar
    let formatString = displayFormat;
    if (displayFormat === 'input') {
      formatString = 'dd/MM/yyyy';
    }
    return formatDate(new Date(date.getFullYear() + 543, date.getMonth(), date.getDate()), formatString, this.locale);
  }

}
export const THAI_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  }
};

@Component({
  selector: 'app-create-product-dialog',
  standalone: true,
  imports: [
  MatCard,
    MatCardHeader,
    MatCardTitle,
    FormsModule,
    ReactiveFormsModule,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIcon,
    MatSelectModule,
    MatDialogContent,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: DateAdapter, useClass: ThaiDateAdapter2 },
    { provide: MAT_DATE_LOCALE, useValue: 'th-TH' },
    { provide: MAT_DATE_FORMATS, useValue: THAI_DATE_FORMATS }
  ],
  templateUrl: './create-product-dialog.component.html',
  styleUrl: './create-product-dialog.component.scss',
})
export class CreateProductDialogComponent {
  private formBuilder = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<CreateProductDialogComponent>);
  private dialog = inject(MatDialog);
  private http = inject(ProductService);

  //Form
  formProduct!: FormGroup;
  submitted: boolean = false;
  imageURL = null;
  imageFile = null;
  // function FOrm
  initForm() {
        // format date "2024-04-26T00:00:00"
        const date = new Date()
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')
        const dateNow = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`



    this.formProduct = this.formBuilder.group({
      productname: ['', [Validators.required, Validators.minLength(3)]],
      unitprice: ['', [Validators.required]],
      unitinstock: ['', [Validators.required]],
      productpicture: [''],
      categoryid: ['', [Validators.required]],
      createddate: [dateNow],
      modifieddate: [dateNow],
      thaidate: []
    });
  }
  // ฟังก์ชันสำหรับเลือกรูปภาพ
  onChangeImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageURL = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      this.imageFile = event.target.files[0];
    }
  }
  // ฟังก์ชันสำหรับล้างรูปภาพ
  removeImage() {
    this.imageURL = null;
    this.imageFile = null;
    // ล้างค่าใน input file
    const input = document.getElementById('image') as HTMLInputElement;
    input.value = '';
  }
  //ตัวแปรข้อมูลประเภทสินค้า
  categories = [
    { value: 1, viewValue: 'Sneakers' },
    { value: 2, viewValue: 'Boots' },
    { value: 3, viewValue: 'Sandals' },
    { value: 4, viewValue: 'Heels' },
  ];
  ngOnInit() {
    this.initForm();
  }


  // Method onSubmit() จะถูกเรียกเมื่อมีการกดปุ่ม Submit
  onSubmit() {
    this.submitted = true
    if (this.formProduct.invalid) {
      return
    } else {

      // สร้าง object ชื่อ formData และกำหนดค่าเป็น new FormData()
      const formData: any = new FormData()

      // วนลูปดูค่าที่อยู่ใน formProduct
      for (let key in this.formProduct.value) {
        formData.append(key, this.formProduct.value[key])
      }

      // ถ้ามีการเลือกรูปภาพ
      if (this.imageFile) {
        formData.append('image', this.imageFile)
      }

      // วนลูปดูค่าที่อยู่ใน formData
      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1])
      }

      //ส่งข้อมูลไป API
      this.http.createProduct(formData).subscribe({
        next: (result) => {
          console.log(result)
          //แสดง dialog สําเร็จ
          this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'เพิ่มสินค้าสําเร็จ',
              icon: 'check_circle_outline',
              iconColor: 'green',
              subtitle: 'สินค้าของคุณได้เพิ่มเรียบร้อยแล้ว',
        },
      })
      //resetandclose form
      this.formProduct.reset()
      this.dialogRef.close(true)

      // Emit event to parent component
      this.onCreateSuccess()
    },
        error: (error) => {
          console.error(error)
        },
      })

    }
  }
  //Emit event to parent component
  productCreated = new EventEmitter<boolean>()

  // create success
  onCreateSuccess() {
    this.productCreated.emit(true)
  }
  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
