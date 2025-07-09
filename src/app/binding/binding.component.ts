import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-binding',
  imports: [CommonModule, FormsModule],
  templateUrl: './binding.component.html',
  styleUrl: './binding.component.css',
})
export class BindingComponent {
  title = 'Binding Example';
  description = 'This component demonstrates data binding in Angular.';

  // 1. INTERPOLATION BINDING - Properties for string interpolation
  userName: string = 'John Doe';
  userAge: number = 30;
  userEmail: string = 'john@example.com';
  currentDate = new Date();
  htmlContent = '<strong>Bold Text</strong>';

  // 2. PROPERTY BINDING - Properties for property binding
  imageUrl = 'https://placehold.co/600x400';
  imageAlt = 'Placeholder Image';
  isDisabled = false;
  backgroundColor = 'lightblue';
  borderWidth = 2;
  customClass = 'highlight';

  // 3. ATTRIBUTE BINDING - Properties for attribute binding
  colSpan = 2;
  dataValue = 'custom-data';
  ariaLabel = 'Custom Button';

  // 4. CLASS BINDING - Properties for class binding
  isActive = true;
  hasError = false;
  isPrimary = true;
  classObject = {
    'text-bold': true,
    'text-italic': false,
    'text-large': true,
  };

  // 5. STYLE BINDING - Properties for style binding
  textColor = 'red';
  fontSize = 18;
  styleObject = {
    'font-weight': 'bold',
    'text-decoration': 'underline',
    margin: '10px',
  };

  // 6. EVENT BINDING - Properties for event binding
  clickCount = 0;
  mousePosition = { x: 0, y: 0 };
  keyPressed = '';
  inputValue = '';

  // 7. TWO-WAY BINDING - Properties for two-way binding
  searchText = '';
  selectedOption = 'option1';
  isChecked = false;
  sliderValue = 50;

  // Example method to update user details
  updateUserDetails(name: string, age: number) {
    this.userName = name;
    this.userAge = age;
  }

  // Example method to reset user details
  resetUserDetails() {
    this.userName = '';
    this.userAge = 0;
    this.userEmail = '';
  }

  // Method for interpolation binding example
  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }

  // EVENT BINDING METHODS
  onButtonClick() {
    this.clickCount++;
    console.log('Button clicked!', this.clickCount);
  }

  onMouseMove(event: MouseEvent) {
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }

  onKeyPress(event: KeyboardEvent) {
    this.keyPressed = event.key;
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.inputValue = target.value;
  }

  // TOGGLE METHODS
  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }

  toggleError() {
    this.hasError = !this.hasError;
  }

  // STYLE METHODS
  changeBackgroundColor() {
    const colors = ['lightblue', 'lightgreen', 'lightcoral', 'lightyellow'];
    const currentIndex = colors.indexOf(this.backgroundColor);
    this.backgroundColor = colors[(currentIndex + 1) % colors.length];
  }

  increaseFontSize() {
    this.fontSize += 2;
  }

  decreaseFontSize() {
    if (this.fontSize > 10) {
      this.fontSize -= 2;
    }
  }

  incrementSlider(value: number) {
    this.sliderValue += value;
    if (this.sliderValue > 100) {
      this.sliderValue = 100;
    }
  }

  decrementSlider(value: number) {
    this.sliderValue -= value;
    if (this.sliderValue < 0) {
      this.sliderValue = 0;
    }
  }
}
