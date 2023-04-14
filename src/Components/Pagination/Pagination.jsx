import React from 'react'
import Pagination from "@mui/material/Pagination";
const PaginationUI = ({ perPage, totalMeetings, setCurrentPage }) => {

    const NoOfPage = Math.ceil(totalMeetings / perPage);
    const handleChange = (e, p) => {
      setCurrentPage(p);
    }
  return (
    <div id="Pagination">
      <Pagination count={NoOfPage} color="secondary"  size="medium"  onChange={handleChange} />
    </div>
  )
}

export default PaginationUI