import { Component, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
  // Main user form
  userForm!: FormGroup;

  // Nested form for address
  addressForm!: FormGroup;

  // Form with FormArray for dynamic fields
  dynamicForm!: FormGroup;

  // Form submission status
  submitted = false;
  formData: any = null;

  // Validation messages
  validationMessages = {
    firstName: {
      required: 'First name is required',
      minlength: 'First name must be at least 2 characters long',
      maxlength: 'First name cannot exceed 50 characters',
    },
    lastName: {
      required: 'Last name is required',
      minlength: 'Last name must be at least 2 characters long',
    },
    email: {
      required: 'Email is required',
      email: 'Please enter a valid email address',
      emailTaken: 'This email is already taken',
    },
    phone: {
      required: 'Phone number is required',
      pattern: 'Please enter a valid phone number',
    },
    age: {
      required: 'Age is required',
      min: 'Age must be at least 18',
      max: 'Age cannot exceed 120',
    },
    password: {
      required: 'Password is required',
      minlength: 'Password must be at least 8 characters long',
      pattern:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    },
    confirmPassword: {
      required: 'Please confirm your password',
      passwordMismatch: 'Passwords do not match',
    },
    street: {
      required: 'Street address is required',
    },
    city: {
      required: 'City is required',
    },
    zipCode: {
      required: 'Zip code is required',
      pattern: 'Please enter a valid zip code',
    },
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createUserForm();
    this.createAddressForm();
    this.createDynamicForm();
    this.setupFormSubscriptions();
  }

  // Create the main user form
  createUserForm() {
    this.userForm = this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: [
          '',
          [Validators.required, Validators.email],
          [this.emailAsyncValidator.bind(this)],
        ], // Async validator
        phone: [
          '',
          [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)],
        ],
        age: [
          '',
          [Validators.required, Validators.min(18), Validators.max(120)],
        ],
        gender: ['', Validators.required],
        country: ['', Validators.required],
        interests: this.fb.array([]), // FormArray for multiple interests
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
        agreeToTerms: [false, Validators.requiredTrue],
        newsletter: [false],
      },
      {
        validators: this.passwordMatchValidator, // Cross-field validator
      }
    );
  }

  // Create nested address form
  createAddressForm() {
    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      zipCode: [
        '',
        [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)],
      ],
      country: ['', Validators.required],
    });

    // Add address form as a nested form control
    this.userForm.addControl('address', this.addressForm);
  }

  // Create form with FormArray for dynamic fields
  createDynamicForm() {
    this.dynamicForm = this.fb.group({
      skills: this.fb.array([this.createSkillControl()]),
    });
  }

  // Create individual skill control
  createSkillControl(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      level: ['', Validators.required],
      yearsOfExperience: ['', [Validators.required, Validators.min(0)]],
    });
  }

  // Setup form value changes subscriptions
  setupFormSubscriptions() {
    // Listen to form value changes
    this.userForm.valueChanges.subscribe((value) => {
      console.log('Form value changed:', value);
    });

    // Listen to specific field changes
    this.userForm.get('country')?.valueChanges.subscribe((country) => {
      console.log('Country changed:', country);
      // You could update states based on country selection
    });

    // Listen to form status changes
    this.userForm.statusChanges.subscribe((status) => {
      console.log('Form status:', status);
    });
  }

  // CUSTOM VALIDATORS

  // Custom password validator
  passwordValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);

    if (hasUpperCase && hasLowerCase && hasNumber) {
      return null; // Valid
    }

    return { pattern: true }; // Invalid
  }

  // Cross-field validator for password confirmation
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  // Async validator for email uniqueness (simulated)
  emailAsyncValidator(control: AbstractControl) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const email = control.value;
        const takenEmails = ['admin@example.com', 'test@example.com'];

        if (takenEmails.includes(email)) {
          resolve({ emailTaken: true });
        } else {
          resolve(null);
        }
      }, 1000); // Simulate API call delay
    });
  }

  // FORM ARRAY METHODS

  get skillsArray(): FormArray {
    return this.dynamicForm.get('skills') as FormArray;
  }

  addSkill() {
    this.skillsArray.push(this.createSkillControl());
  }

  removeSkill(index: number) {
    this.skillsArray.removeAt(index);
  }

  // INTERESTS FORM ARRAY METHODS

  get interestsArray(): FormArray {
    return this.userForm.get('interests') as FormArray;
  }

  addInterest() {
    this.interestsArray.push(new FormControl('', Validators.required));
  }

  removeInterest(index: number) {
    this.interestsArray.removeAt(index);
  }

  // UTILITY METHODS

  // Get form control for easier access in template
  getControl(
    formGroup: FormGroup,
    controlName: string
  ): AbstractControl | null {
    return formGroup.get(controlName);
  }

  // Check if field has error
  hasError(
    formGroup: FormGroup,
    controlName: string,
    errorType?: string
  ): boolean {
    const control = formGroup.get(controlName);
    if (!control) return false;

    if (errorType) {
      return control.hasError(errorType) && (control.dirty || control.touched);
    }

    return control.invalid && (control.dirty || control.touched);
  } // Get error message for a field
  getErrorMessage(formGroup: FormGroup, controlName: string): string {
    const control = formGroup.get(controlName);
    if (!control || !control.errors) return '';

    const fieldMessages = (this.validationMessages as any)[controlName];
    if (!fieldMessages) return '';

    const firstError = Object.keys(control.errors)[0];
    return fieldMessages[firstError] || '';
  }

  // Helper method for skills FormArray validation
  getSkillControl(index: number, controlName: string): AbstractControl | null {
    return this.skillsArray.at(index).get(controlName);
  }

  hasSkillError(index: number, controlName: string): boolean {
    const control = this.getSkillControl(index, controlName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  // FORM ACTIONS

  onSubmit() {
    this.submitted = true;

    if (this.userForm.valid) {
      // Combine main form with skills
      this.formData = {
        ...this.userForm.value,
        skills: this.dynamicForm.value.skills,
      };

      console.log('Form submitted:', this.formData);
      alert('Form submitted successfully!');
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched(this.userForm);
      this.markFormGroupTouched(this.dynamicForm);
    }
  }

  // Mark all fields as touched to show validation errors
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl) => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  resetForm() {
    this.userForm.reset();
    this.dynamicForm.reset();
    this.submitted = false;
    this.formData = null;

    // Reset FormArrays
    while (this.skillsArray.length !== 0) {
      this.skillsArray.removeAt(0);
    }
    this.addSkill(); // Add one default skill

    while (this.interestsArray.length !== 0) {
      this.interestsArray.removeAt(0);
    }
  }

  // Patch form with sample data
  loadSampleData() {
    this.userForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-123-4567',
      age: 30,
      gender: 'male',
      country: 'USA',
      password: 'StrongPass123',
      confirmPassword: 'StrongPass123',
      agreeToTerms: true,
      newsletter: true,
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
    });

    // Add sample interests
    this.addInterest();
    this.interestsArray.at(0).setValue('Programming');
    this.addInterest();
    this.interestsArray.at(1).setValue('Reading');

    // Add sample skills
    this.skillsArray.at(0).patchValue({
      name: 'JavaScript',
      level: 'Advanced',
      yearsOfExperience: 5,
    });
    this.addSkill();
    this.skillsArray.at(1).patchValue({
      name: 'Angular',
      level: 'Expert',
      yearsOfExperience: 3,
    });
  }
}
