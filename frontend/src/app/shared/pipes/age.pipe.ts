import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {
  transform(birthdate: number): number {
    const birthDate: Date = new Date(birthdate);
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();
    const currentDate: Date = new Date();
    const age: number = currentDate.getFullYear() - birthYear;
    const currentMonth = currentDate.getMonth();

    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDate.getDate() < birthDay)) {
      return age - 1;
    }

    return age;
  }
}
