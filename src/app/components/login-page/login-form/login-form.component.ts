import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  user: User;
  error: string;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((u) => (this.user = u));
    this.loginForm.valueChanges.subscribe((v) => (this.error = ''));
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.userService.login(this.loginForm.value).subscribe(
      (res) => {
        this.userService.setUser(res);
        if (res.role === 1) this.router.navigate(['/shopping']);
        this.loginForm.reset();
      },
      (err) =>
        (this.error =
          err.status === 401
            ? err.error.msg
            : 'something went wrong, please try again later')
    );
  }
}
