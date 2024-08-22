import { Component, OnInit, inject } from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'
import { MatIconButton, MatButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatInput } from '@angular/material/input'
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatCard, MatCardImage, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card'
import { Meta } from '@angular/platform-browser'
import { UserService } from '../../services/user.service'
import { AuthService } from '../../services/auth.service'
import { MatDialog } from '@angular/material/dialog'
//alertDialog
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component'
// Import user service

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: true,
    imports: [
        MatCard,
        MatCardImage,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatFormField,
        MatLabel,
        MatInput,
        MatIcon,
        MatSuffix,
        MatIconButton,
        MatCardActions,
        MatButton,
        ReactiveFormsModule
    ],
})
export class LoginComponent implements OnInit {


  private meta = inject(Meta)
  private http = inject(UserService)
  private router = inject(Router)
  private formBuilder = inject(FormBuilder)
  private auth = inject(AuthService)
  private dialog = inject(MatDialog)


  // Form Validation
  loginForm!: FormGroup
  submitted: boolean = false

  // Variables สำหรับรับค่าจากฟอร์ม
  userData = {
    username: '',
    password: '',
  }

  // สร้างตัวแปรเก็บข้อมูลการ Login
  userLogin = {
    "username": "",
    "email": "",
    "role": "",
    "token": ""
  }

  // สำหรับซ่อนแสดง password
  hide = true



  ngOnInit() {

    // กำหนด Meta Tag description
    this.meta.addTag({ name: 'description', content: 'Login page for Stock Management' })

    // กำหนดค่าให้กับ Form
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // iamsamit
      password: ['', [Validators.required, Validators.minLength(8)]], // Samit@1234
    })

    //เช็คว่า login อยู่แล้ว
    if (this.auth.isLoggedIn()) {
      window.location.href = '/dashboard'
    }
  }

  // ฟังก์ชัน Submit สำหรับ Login
  submitLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.userData.username = this.loginForm.value.username;
      this.userData.password = this.loginForm.value.password;
  
      // Log ข้อมูลที่ส่งไปยังเซิร์ฟเวอร์
      //console.log('Sending login request with:', this.userData);
  
      this.http.Login(this.userData).subscribe({
        next: (data: any) => {
          // Log ข้อมูลที่ได้รับจากเซิร์ฟเวอร์
          //console.log('Received response from server:', data);
          if (data.token != null) {
            // show dialog
            this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'เข้าสู่ระบบ',
                icon: 'check_circle',
                iconColor: 'green',
                subtitle: 'รอสักครู่...',
              },
              disableClose: true,
            });

            // เก็บค่าลงตัวแปร userLogin
            this.userLogin = {
              username: data.userData.userName,
              email: data.userData.email,
              role: data.userData.roles[0],
              token: data.token,
            };
            //เก็ย cookie
            this.auth.setUser(this.userLogin);

            //ส่งไปหน้า Home
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 3000);
          }
        },
        error: (error) => {
          console.log(error)
          this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'มีข้อผิดพลาด',
              icon: 'error',
              iconColor: 'red',
              subtitle: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
            },
            disableClose: true,
          })
        }
      })

    }
  }

  // สำหรับลิงก์ไปหน้า Register
  onClickRegister() {
    this.router.navigate(['/register'])
  }
}