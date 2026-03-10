import type { ICategory } from '@/mock-data';
import CategorySelector from './ui/category-selector';
interface Props {
  categories: ICategory[];
}

const Categories = ({ categories }: Props) => {
  return (
    <div className="py-5">
      <CategorySelector categories={categories} />
    </div>
  );
};

export default Categories;
