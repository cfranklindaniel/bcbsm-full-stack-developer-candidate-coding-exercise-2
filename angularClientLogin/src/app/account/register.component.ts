import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            userMode: [''],
            streetAddress: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zip: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        if (!this.accountService.isAlphaNumeric(this.f.username.value)) {
          alert("User Name must be Alphanumeric");
          return;
        }
      if (!this.accountService.isHavingNumbers(this.f.password.value)) {
        alert("Password must have atleast one number");
        return;
      }
      if (!this.accountService.isHavingSpecialChar(this.f.password.value)) {
        alert("Password must have atleast one special character");
        return;
      }
      if (!this.accountService.containsUppercase(this.f.password.value)) {
        alert("Password must have atleast one upper case letter character");
        return;
      }
      this.form.patchValue({userMode: 'Register'});
        this.loading = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    alert("User Name already taken");
                    this.alertService.error(error);
                   this.loading = false;
                }
            });
    }

}
