import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Select from 'react-select';
import LoadingSpinner from '../components/LoadingSpinner';
import { addUser } from '../services/AllApi';
import { registerContext } from './Contextshare';
import { useNavigate } from 'react-router-dom';


function Add() {

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



  useEffect(() => {

    if (profile) {

      setPreview(URL.createObjectURL(profile))
    }

    setTimeout(() => {
      setshowpin(false)
    }, 2000);

  }, [profile])

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
      data.append("profile", profile)
      data.append("location", location)


      const headers = {
        "content-type": "multipart/form-data"
      }


      // api call
      const response = await addUser(data, headers)

      console.log(response);

      if (response.status == 200) {
        setNormalUserInput({
          ...normalInputs,

          fname: "",
          lname: "",
          email: "",
          mobile: "",
          gender: "",
          location: ""
        })

        setStatus("")
        setProfile("")
        setregisterData(response.data)
        navigate('/')
      }
      else{
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
            <h1 className='text-center fw-bolder'>Add New Employee Details</h1>

            <div className='mt-3 shadow border rounded p-2'>

              <div className='text-center'>
                <img style={{ width: '70px', height: '70px', borderRadius: '50%' }} src={preview ? preview : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt="no image" />
              </div>

              <Form className='mt-4'>
                <Row>

                  {/* first name */}
                  <FloatingLabel className='mb-3 col-lg-6' controlId="floatingInputfname" label="First name">
                    <Form.Control type="text" name='fname' placeholder="Fname" onChange={e => getandsetuserNormalInputs(e)} value={normalInputs.value} />
                  </FloatingLabel>

                  {/* last name */}
                  <FloatingLabel className='mb-3 col-lg-6' controlId="floatingInputlname" label="Last name">
                    <Form.Control type="text" name='lname' placeholder="Last name" onChange={e => getandsetuserNormalInputs(e)} value={normalInputs.value} />
                  </FloatingLabel>

                  {/* email */}
                  <FloatingLabel className='mb-3 col-lg-6' controlId="floatingInputemail" label="Email">
                    <Form.Control type="email" name='email' placeholder="Email" onChange={e => getandsetuserNormalInputs(e)} value={normalInputs.value} />
                  </FloatingLabel>

                  {/* Mobile */}
                  <FloatingLabel className='mb-3 col-lg-6' controlId="floatingInputmobile" label="Mobile">
                    <Form.Control type="text" name='mobile' placeholder="Mobile" onChange={e => getandsetuserNormalInputs(e)} value={normalInputs.value} />
                  </FloatingLabel>

                  {/* gender */}
                  <Form.Group className='mb-3 col-lg-6'>
                    <Form.Label>Select Gender</Form.Label>
                    <Form.Check type={"radio"} name='gender' value={"Male"} onChange={e => getandsetuserNormalInputs(e)} label={"Male"} />
                    <Form.Check type={"radio"} name='gender' value={"Female"} onChange={e => getandsetuserNormalInputs(e)} label={"Female"} />

                  </Form.Group>

                  {/* status */}
                  <Form.Group className='mb-3 col-lg-6'>
                    <Form.Label>Select Employee Status</Form.Label>
                    <Select onChange={e => setStatus(e.value)}
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
                    <Form.Control type="text" name='location' placeholder="Location" onChange={e => getandsetuserNormalInputs(e)} value={normalInputs.value} />
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

export default Add