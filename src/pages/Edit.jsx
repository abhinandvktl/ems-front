import React, { useEffect, useState } from 'react'
import { Button, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Select from 'react-select';
import LoadingSpinner from '../components/LoadingSpinner';
import { allUsers, editUser } from '../services/AllApi';
import { registerContext } from './Contextshare';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { BASE_URL } from '../services/baseUrl';

function Edit() {

  const { registerData, setregisterData } = useContext(registerContext)
  const navigate = useNavigate()

  // spinner
  const [showspin, setshowpin] = useState(true)

  // to hold normal user inputs
  const [normalInputs, setNormalUserInput] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    gender: "",
    location: ""
  })

  // to hold status
  const [status, setStatus] = useState("")
  const [profile, setProfile] = useState("")

  const [preview, setPreview] = useState("")

  useEffect(() => {

    if (profile) {

      setexistingImg("")
      setPreview(URL.createObjectURL(profile))
    }

    setTimeout(() => {
      setshowpin(false)
    }, 2000);

  }, [profile])

  // to get single item for edit
  const { id } = useParams()
  console.log(id);

  const[existingImg,setexistingImg]=useState("")

  useEffect(() => {
    getuser()
  }, [])


  // to get all employee details from database
  const getuser = async () => {
    const { data } = await allUsers("")
    console.log(data);

    let existingUser = data.find(item => item._id === id)
    // console.log(existingUser);
    setNormalUserInput(existingUser)
    setStatus(existingUser.status)
    setexistingImg(existingUser.profile)
  }



  // define normaluser input function
  const getandsetuserNormalInputs = (e) => {
    const { name, value } = e.target
    setNormalUserInput({ ...normalInputs, [name]: value })
  }

  const handlefile = (e) => {
    // console.log(e.target.files[0]);
    setProfile(e.target.files[0])
  }

  // console.log(normalInputs);
  // console.log(status);
  // console.log(profile);





  const options = [
    { value: 'Active', label: 'Active' },
    { value: 'InActive', label: 'InActive' },
  ];

  // define submit function
  const handleSubmit = async (e) => {
    e.preventDefault()

    const { fname, lname, email, mobile, gender, location } = normalInputs

    if (!fname || !lname || !email || !mobile || !gender || !status || !profile || !location) {
      alert('Please fill the form completely')
    }
    else {
      // alert('form filled completly')

      const data = new FormData()
      data.append("fname", fname)
      data.append("lname", lname)
      data.append("email", email)
      data.append("mobile", mobile)
      data.append("gender", gender)
      data.append("status", status)
      profile? data.append("profile", profile):data.append("profile",existingImg)
      data.append("location", location)

      if(profile){
        var headers = {
          "content-type": "multipart/form-data"
        }
      }else{
        var headers=""
      }


      


      // api call
      const response = await editUser(id,data,headers)
      console.log(response);

      if (response.status == 200) {
        
        navigate('/')
      }
      else {
        alert('request failed')
      }

    }
  }

  return (
    <>

      {
        showspin ?
          <LoadingSpinner /> :
          <div className='container mt-3'>
            <h1 className='text-center fw-bolder'>Update Employee Details</h1>

            <div className='mt-3 shadow border rounded p-2'>

              <div className='text-center'>
                <img style={{ width: '70px', height: '70px', borderRadius: '50%' }} src={preview ? preview : `${BASE_URL}/uploads/${existingImg}`} alt="no image" />
              </div>

              <Form className='mt-4'>
                <Row>

                  {/* first name */}
                  <FloatingLabel className='mb-3 col-lg-6' controlId="floatingInputfname" label="First name">
                    <Form.Control type="text" name='fname' placeholder="Fname" onChange={e => getandsetuserNormalInputs(e)} value={normalInputs.fname} />
                  </FloatingLabel>

                  {/* last name */}
                  <FloatingLabel className='mb-3 col-lg-6' controlId="floatingInputlname" label="Last name">
                    <Form.Control type="text" name='lname' placeholder="Last name" onChange={e => getandsetuserNormalInputs(e)} value={normalInputs.lname} />
                  </FloatingLabel>

                  {/* email */}
                  <FloatingLabel className='mb-3 col-lg-6' controlId="floatingInputemail" label="Email">
                    <Form.Control type="email" name='email' placeholder="Email" onChange={e => getandsetuserNormalInputs(e)} value={normalInputs.email} />
                  </FloatingLabel>

                  {/* Mobile */}
                  <FloatingLabel className='mb-3 col-lg-6' controlId="floatingInputmobile" label="Mobile">
                    <Form.Control type="text" name='mobile' placeholder="Mobile" onChange={e => getandsetuserNormalInputs(e)} value={normalInputs.mobile} />
                  </FloatingLabel>

                  {/* gender */}
                  <Form.Group className='mb-3 col-lg-6'>
                    <Form.Label>Select Gender</Form.Label>
                    <Form.Check type={"radio"} name='gender' value={"Male"} onChange={e => getandsetuserNormalInputs(e)} label={"Male"} checked={normalInputs.gender === "Male" ? true : false} />
                    <Form.Check type={"radio"} name='gender' value={"Female"} onChange={e => getandsetuserNormalInputs(e)} label={"Female"} checked={normalInputs.gender === "Female" ? true : false} />

                  </Form.Group>

                  {/* status */}
                  <Form.Group className='mb-3 col-lg-6'>
                    <Form.Label>Select Employee Status</Form.Label>
                    <Select placeholder={status} onChange={e => setStatus(e.value)}
                      options={options}
                    />
                  </Form.Group>

                  {/* file upload */}
                  <Form.Group className='mb-3 col-lg-6'>
                    <Form.Label>Choose a profile picture</Form.Label>
                    <Form.Control type="file" onChange={e => handlefile(e)} name='profile' />
                  </Form.Group>

                  {/* location */}
                  <FloatingLabel className='mb-3 mt-3 col-lg-6' controlId="floatingInputlocation" label="Location">
                    <Form.Control type="text" name='location' placeholder="Location" onChange={e => getandsetuserNormalInputs(e)} value={normalInputs.location} />
                  </FloatingLabel>

                  <Button onClick={e => handleSubmit(e)} type='submit' variant='primary'>Submit</Button>


                </Row>
              </Form>

            </div>

          </div>
      }

    </>
  )
}

export default Edit