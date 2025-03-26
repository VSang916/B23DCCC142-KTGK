export interface Classroom {
    id: string;
    name: string;
    capacity: number;
    type: 'Lý thuyết' | 'Thực hành' | 'Hội trường';
    manager: string;
  }