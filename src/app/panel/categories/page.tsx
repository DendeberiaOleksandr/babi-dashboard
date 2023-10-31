'use client';
import CategoriesFilterPan from '@/components/CategoriesFilterPan'
import CategoriesList, { CategoriesFilter } from '@/components/CategoriesList'
import CategoryForm from '@/components/CategoryForm'
import React, { useState } from 'react'

function CategoriesPage() {

  const [filter, setFilter] = useState<CategoriesFilter>({})

  return (
    <div className='flex flex-1 flex-col gap-2'>
        <CategoryForm/>
        <CategoriesFilterPan filter={filter} setFilter={setFilter}/>
        <CategoriesList filter={filter} setFilter={setFilter}/>
    </div>
  )
}

export default CategoriesPage