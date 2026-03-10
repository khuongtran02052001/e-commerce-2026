'use client';
import { cn } from '@/lib/utils';
import type { ICategory } from '@/mock-data';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface Props {
  categories: ICategory[];
}

const CategorySelector = ({ categories }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const router = useRouter();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? categories.find((category) => category?.id === value)?.title
            : 'Filter by Category'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search category..."
            className="h-9"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const selectedCategory = categories.find((c) =>
                  c.title?.toLowerCase().includes(e.currentTarget.value.toLowerCase()),
                );
                if (selectedCategory?.slug) {
                  setValue(selectedCategory?.id);
                  router.push(`/category/${selectedCategory.slug}`);
                  setOpen(false);
                }
              }
            }}
          />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category?.id}
                  value={category?.title}
                  onSelect={() => {
                    setValue(value === category?.id ? '' : category?.id);
                    router.push(`/category/${category.slug}`);
                    setOpen(false);
                  }}
                >
                  {category?.title}
                  <Check
                    className={cn('ml-auto', value === category.id ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelector;
