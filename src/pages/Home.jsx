import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Hometable from '../components/Hometable'
import LoadingSpinner from '../components/LoadingSpinner'
import { registerContext } from './Contextshare'
import Alert from 'react-bootstrap/Alert';
import { allUsers, deleteUser } from '../services/AllApi'


function Home() {

  const[allUsersData,setAllUsersdata]=useState([])

  const { registerData, setregisterData } = useContext(registerContext)


  // spinner
  const [showspin, setshowpin] = useState(true)

  const[search,setSearch]=useState("")

  useEffect(() => {

    // call getAllEmployees function
    getAllEmployees()

    setTimeout(() => {
      setshowpin(false)
    }, 2000);

  }, [search])


  // function definition for get all data
  const getAllEmployees=async()=>{
    const response=await allUsers(search)
    console.log(response); 
    setAllUsersdata(response.data)
  }


  // delete employee
  const removeUser=async(id)=>{
    const response=await deleteUser(id)
    console.log(id);

    if (response.status===200){
      getAllEmployees()
    }
    else{
      alert("operation failed !!! please try after sometime")
    }
  }


  return (
    <>
      {
        registerData && <Alert variant='success' onClose={() => setregisterData("")} dismissible>{registerData.fname.toUpperCase()}registered successfully</Alert>
      }



      {
        showspin ?
          <LoadingSpinner /> :
          <div className='container'>
            <div className='search-all d-flex align-items-center'>

              <div className='search d-flex align-items-center mt-3'>
                <span className='fw-bolder'>Search :</span>
                <input type="text" onChange={e=>setSearch(e.target.value)} placeholder='Search By Employee Name' className='form-control ms-3' style={{ width: '400px' }} />
              </div>

              <Link to={'/add'} className='btn btn-secondary ms-auto'>Add <i class="fa-solid fa-user-plus"></i>
              </Link>

            </div>
            <div className='table mt-5'>
              <h1 className='fw-bolder'>List Of All Empolyees</h1>
              <Hometable displayData={allUsersData} removeuser={removeUser}/>
            </div>
          </div>
      }
    </>
  )
}

export default Home