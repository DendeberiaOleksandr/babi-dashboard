import React from 'react'
import ReactPaginate from 'react-paginate';

type Props = {
    totalElements: number;
    page: number;
    elementsPerPage: number;
    setPage: (page: number) => void;
    setElementsPerPage: (elementsPerPage: number) => void;
};

function Pagination({totalElements, page, elementsPerPage, setPage, setElementsPerPage}: Props) {
  return (
    <ReactPaginate
        activeClassName='bg-primary py-1 px-2 rounded-md text-white'
        disabledClassName='text-primary p-2 rounded-md bg-transparent hover:bg-secondary hover:text-white '
        containerClassName='flex flex-row w-full gap-4 items-center'
        breakLabel="..."
        breakClassName='text-xl text-primary'
        nextLabel=">"
        nextClassName='text-primary text-xl'
        onPageChange={({selected}) => setPage(selected)}
        pageRangeDisplayed={5}
        pageCount={Math.ceil(totalElements / elementsPerPage)}
        previousLabel="<"
        previousClassName='text-primary text-xl'
        renderOnZeroPageCount={null}
    />
  )
}

export default Pagination