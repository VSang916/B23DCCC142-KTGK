import { Classroom } from '../models/Classroom';

export class ClassroomService {
  private static STORAGE_KEY = 'classrooms';

  static getClassrooms(): Classroom[] {
    const classrooms = localStorage.getItem(this.STORAGE_KEY);
    return classrooms ? JSON.parse(classrooms) : [];
  }

  static saveClassrooms(classrooms: Classroom[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(classrooms));
  }

  static addClassroom(classroom: Classroom): void {
    const classrooms = this.getClassrooms();
    classrooms.push(classroom);
    this.saveClassrooms(classrooms);
  }

  static updateClassroom(updatedClassroom: Classroom): void {
    const classrooms = this.getClassrooms().map(c => 
      c.id === updatedClassroom.id ? updatedClassroom : c
    );
    this.saveClassrooms(classrooms);
  }

  static deleteClassroom(id: string): void {
    const classrooms = this.getClassrooms().filter(c => c.id !== id);
    this.saveClassrooms(classrooms);
  }

  static isClassroomNameUnique(name: string, excludeId?: string): boolean {
    const classrooms = this.getClassrooms();
    return !classrooms.some(c => 
      c.name.toLowerCase() === name.toLowerCase() && c.id !== excludeId
    );
  }
}