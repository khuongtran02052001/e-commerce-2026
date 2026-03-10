import { Dispatch, SetStateAction } from 'react';
import Title from '../Title';

import { ICategory } from '@/mock-data';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
interface Props {
  categories: ICategory[];
  selectedCategory?: string | null;
  setSelectedCategory: Dispatch<SetStateAction<string | null>>;
}

const CategoryList = ({ categories, selectedCategory, setSelectedCategory }: Props) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Title className="text-base font-semibold text-gray-900">Categories</Title>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {categories?.length || 0}
        </span>
      </div>

      <RadioGroup value={selectedCategory || ''} className="space-y-1">
        {categories?.map((category, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(category?.slug as string)}
            className="group flex items-center space-x-3 px-2 py-1 -mx-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-150"
          >
            <RadioGroupItem
              value={category?.slug as string}
              id={category?.slug}
              className="border-gray-300 text-shop_dark_green focus:ring-shop_dark_green"
            />
            <Label
              htmlFor={category?.slug}
              className={`flex-1 cursor-pointer transition-colors duration-150 ${
                selectedCategory === category?.slug
                  ? 'font-medium text-shop_dark_green'
                  : 'text-gray-700 group-hover:text-gray-900'
              }`}
            >
              {category?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedCategory && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCategory(null);
          }}
          className="mt-4 text-xs font-medium text-gray-600 hover:text-shop_dark_green underline underline-offset-2 decoration-1 transition-colors duration-150"
        >
          Clear category filter
        </button>
      )}
    </div>
  );
};

export default CategoryList;
