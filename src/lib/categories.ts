import { BookOpen, FileQuestion, Library } from "lucide-react";

export interface CategoryConfig {
  id: string;
  name: string;
  description: string;
  icon: typeof BookOpen;
  color: {
    bg: string;
    border: string;
    text: string;
    icon: string;
  };
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'modules',
    name: 'Modules',
    description: 'Course modules and lecture notes',
    icon: BookOpen,
    color: {
      bg: 'bg-blue-50',
      border: 'border-blue-200', 
      text: 'text-blue-700',
      icon: 'bg-blue-100'
    }
  },
  {
    id: 'pyqs',
    name: "PYQ's",
    description: 'Previous year question papers',
    icon: FileQuestion,
    color: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700', 
      icon: 'bg-green-100'
    }
  },
  {
    id: 'additional',
    name: 'Additional Study Materials',
    description: 'Extra resources and references',
    icon: Library,
    color: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      icon: 'bg-purple-100'
    }
  }
];

export const getCategoryById = (id: string): CategoryConfig | undefined => {
  return CATEGORIES.find(category => category.id === id);
};

export const getCategoryOptions = () => {
  return CATEGORIES.map(category => ({
    value: category.id,
    label: category.name
  }));
};