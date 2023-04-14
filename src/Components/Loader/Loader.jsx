import React from 'react'
import { Circles} from  'react-loader-spinner'
const Loader = () => {
  return (
    <div id="Loader">
     <Circles
      height="80"
      width="80"
      color="#6D00B3"
      ariaLabel="circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
    </div>
  )
}

export default Loader