import { Component, OnInit, inject } from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatCard, MatCardImage, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card'
import { Meta } from '@angular/platform-browser'
import { UserService } from '../../services/user.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    standalone: true,
    imports: [
        MatCard,
        MatCardImage,
        MatCardHeader,
        MatCardTitle,
        FormsModule,
        ReactiveFormsModule,
        MatCardContent,
        MatFormField,
        MatLabel,
        MatInput,
        MatIcon,
        MatSuffix,
        MatIconButton,
        MatCardActions,
        MatButton,
    ],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup
  submitted: boolean = false

  // Variables สำหรับรับค่าจากฟอร์ม
  userData = {
    username: '',
    email: '',
    password: '',
  }

  // สำหรับซ่อนแสดง password
  hide = true

  private meta = inject(Meta)
  private router = inject(Router)
  private formBuilder = inject(FormBuilder)
  private http = inject(UserService)
  private dialog = inject(MatDialog)

  ngOnInit(): void {
    // กำหนด Meta Tag description
    this.meta.addTag({ name: 'description', content: 'Login page for Stock Management' })

    // Validate form
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  // ฟังก์ชัน Submit สำหรับ Register
  submitRegister(){
    this.submitted = true;
    if (this.registerForm.invalid){
      return;
    }else{
      this.userData.username = this.registerForm.value.username
      this.userData.email = this.registerForm.value.email
      this.userData.password = this.registerForm.value.password

      this.http.Register(this.userData).subscribe({
        next: (data: any) => {

          if (data && data.status === 'Success') {
            this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'สมัครสมาชิกสําเร็จ',
                icon: 'check_circle',
                iconColor: 'green',
                subtitle: 'รอสักครู่...',
              },
              disableClose: true,
            });
            setTimeout(() => {
              this.dialog.closeAll()
              this.router.navigate(['/login']);
            }, 3000);
            
          }
        },
        error: (error) => {
          console.log(error)
          const errorMessage = error?.error?.message || 'มีข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่';
          this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'มีข้อผิดพลาด',
              icon: 'error',
              iconColor: 'red',
              subtitle: errorMessage,
            },
            disableClose: true,
          })
        }
    });
  }
}

  onClickCancel() {
    this.router.navigate(['/login'])
  }
}