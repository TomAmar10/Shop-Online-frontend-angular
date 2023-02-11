import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, debounceTime, map } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  isFirst = true;
  isCityDirty: boolean;
  isStreetDirty: boolean;
  citySearchSubject = new BehaviorSubject<string>('');
  streetSearchSubject = new BehaviorSubject<string>('');
  cities: string[] = [];
  streets: string[] = [];
  error = '';
  authError = '';

  register1: FormGroup = new FormGroup({
    id_number: new FormControl('', [
      Validators.required,
      Validators.min(10000000),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    passConfirm: new FormControl('', [
      Validators.required,
      this.passwordMatch.bind(this),
    ]),
  });
  register2: FormGroup = new FormGroup({
    city: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      this.checkCity.bind(this),
    ]),
    street: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      this.checkStreet.bind(this),
    ]),
    first_name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    last_name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.citySearchSubject.pipe(debounceTime(300)),
      this.orderService.getCities(),
    ])
      .pipe(
        map(([searchWord, list]) =>
          list.filter((w, i) => w.includes(searchWord) && i !== 0)
        )
      )
      .subscribe((res) => (this.cities = res));

    this.register1.valueChanges.subscribe(() => (this.authError = ''));
    this.register2.valueChanges.subscribe(() => (this.error = ''));
  }

  submit() {
    if (this.register2.invalid) {
      this.register2.markAllAsTouched();
      return;
    }
    const user = { ...this.register1.value, ...this.register2.value };
    this.userService.register(user).subscribe(
      (res) => {
        this.userService.setUser(res);
        this.router.navigate(['home/login']);
      },
      (err) => (this.error = 'Something went wrong, please try again later')
    );
  }

  next() {
    if (this.register1.invalid) {
      this.register1.markAllAsTouched();
      return;
    }
    const form = this.register1.value;
    this.userService.checkUserId(form.id_number).subscribe(
      (res) =>
        this.userService.checkUserEmail(form.email).subscribe(
          (res) => (this.isFirst = false),
          (err) => (this.authError = err.error.msg)
        ),
      (err) => (this.authError = err.error.msg)
    );
  }

  passwordMatch(control: FormControl) {
    if (!this.register1) return { unMatch: null };
    const password = this.register1.get('password').value;
    return password === control.value ? null : { unMatch: true };
  }

  searchCity(city: string) {
    this.citySearchSubject.next(city);
    this.isCityDirty = city.length > 0;
  }

  searchStreet(street: string) {
    this.streetSearchSubject.next(street);
    this.isStreetDirty = street.length > 0;
  }

  chooseCity(city: string) {
    this.register2.patchValue({
      city,
    });
    this.isCityDirty = false;
    combineLatest([
      this.streetSearchSubject.pipe(debounceTime(300)),
      this.orderService.getStreets(city),
    ])
      .pipe(
        map(([searchWord, list]) =>
          list.filter((w, i) => w.includes(searchWord) && i !== 0)
        )
      )
      .subscribe((res) => (this.streets = res));
  }
  chooseStreet(street: string) {
    this.register2.patchValue({
      street,
    });
    this.isStreetDirty = false;
  }

  checkValid1(control: string) {
    return (
      this.register1.get(control).touched && this.register1.get(control).invalid
    );
  }
  checkValid2(control: string) {
    return (
      this.register2.get(control).touched && this.register2.get(control).invalid
    );
  }

  min(length: number) {
    return `Minimum ${length} characters`;
  }
  checkCity(control: FormControl) {
    if (!this.cities) return { notExist: true };
    return this.cities.includes(control.value) ? null : { notExist: true };
  }
  checkStreet(control: FormControl) {
    if (!this.streets) return { notExist: true };
    return this.streets.includes(control.value.trim())
      ? null
      : { notExist: true };
  }
}
