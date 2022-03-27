import { useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Nav from '../components/Nav';


const Onboarding = () => {

  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  const [formData, setFormData] = useState({
    user_id: cookies.UserId, //UserId is used in video, but seems like userId works?
    first_name: '',
    dob_day: '',
    dob_month: '',
    dob_year: '',
    show_gender: false,
    gender_identity: 'man',
    gender_interest: 'woman',
    url: '',
    about: '',
    matches: [],
  })

  let navigate = useNavigate()

  //we are sending over the data from our update function in index.js
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.put('http://localhost:8000/user', { formData })
      const success = response.status === 200
      if (success) navigate('/dashboard')
    } catch (error) {
      console.log(error)
    }

  }

  const handleChange = (e) => {

    // If we set the value to '= e.target.value', it will set the 'show_gender' button to just 'on'. We want it to be TRUE or FALSE. So we change it to "= e.target.type === ..." and check if the type is 'checked' or not. If it is, we display it as TRUE.
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    const name = e.target.name

    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <>
      <Nav
        minimal={true}
        setShowModal={() => { }}
        showModal={false}
      />
      <div className='onboarding'>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <section>

            {/* ---- Naming ---- */}
            <label htmlFor='first_name'>First Name</label>
            <input
              id='first_name'
              type='text'
              name='first_name'
              placeholder='First Name'
              required={true}
              value={formData.first_name}
              onChange={handleChange}
            />


            {/* ---- Birthday Select ---- */}
            <label>Birthday</label>
            <div className='multiple-input-container'>
              <input
                id='dob_day'
                type='number' //not date?
                name='dob_day'
                placeholder='DD'
                required={true}
                value={formData.dob_day}
                onChange={handleChange}
              />

              <input
                id='dob_month'
                type='number' //not date?
                name='dob_month'
                placeholder='MM'
                required={true}
                value={formData.dob_month}
                onChange={handleChange}
              />

              <input
                id='dob_year'
                type='number' //not date?
                name='dob_year'
                placeholder='YYYY'
                required={true}
                value={formData.dob_year}
                onChange={handleChange}
              />
            </div>

            {/* ---- Gender Selects ---- */}
            <label>Gender</label>

            <div className='multiple-input-container'>
              <input
                id="man-gender-identity"
                type='radio'
                name="gender_identity"  //naming convention from DB  
                value='man'
                onChange={handleChange}
                checked={formData.gender_identity === 'man'} //this is needed to mark the check box
              />
              <label htmlFor='man-gender-identity'>Man</label>

              <input
                id="woman-gender-identity"
                type='radio'
                name="gender_identity"
                value='woman'
                onChange={handleChange}
                checked={formData.gender_identity === 'woman'}
              />
              <label htmlFor='woman-gender-identity'>Woman</label>

              <input
                id="more-gender-identity"
                type='radio'
                name='gender_identity'
                value='more'
                onChange={handleChange}
                checked={formData.gender_identity === 'more'}
              />
              <label htmlFor='more-gender-identity'>More</label>
            </div>

            {/* Choose to show gender or not */}
            <label htmlFor='show-gender'>Show gender on my profile</label>
            <input
              id="show-gender"
              type="checkbox"
              name="show_gender"
              onChange={handleChange}
              checked={formData.show_gender}
            />

            {/* ---- Show Me ---- */}
            <label>Show Me</label>

            <div className="multiple-input-container">
              <input
                id="man-gender-interest"
                type="radio"
                name="gender_interest"
                value="man"
                onChange={handleChange}
                checked={formData.gender_interest === 'man'}
              />
              <label htmlFor='man-gender-interest'>Man</label>

              <input
                id="woman-gender-interest"
                type='radio'
                name="gender_interest"
                value='woman'
                onChange={handleChange}
                checked={formData.gender_interest === 'woman'}
              />
              <label htmlFor='woman-gender-interest'>Woman</label>

              <input
                id="everyone-gender-interest"
                type='radio'
                name="gender_interest"
                value='everyone'
                onChange={handleChange}
                checked={formData.gender_interest === 'everyone'}
              />
              <label htmlFor='everyone-gender-interest'>Everyone</label>
            </div>


            {/* ---- About Me ---- */}
            <label htmlFor='about'>About Me</label>
            <input
              id='about'
              type='text'
              name='about'
              required={true}
              placeholder='Tell us about yourself'
              value={formData.about}
              onChange={handleChange}
            />
            <input type="submit" />
          </section>


          {/* ---- Picture Stuff ---- */}
          <section>
            <label htmlFor='about'>Profile Picture (url)</label>
            <input
              type='url'
              name='url'
              id='url'
              onChange={handleChange}
              required={true}
            />
            <div className="photo-container">
              {/* We only want to show the picture if it actually exists */}
              {formData.url && <img src={formData.url} alt='profile pic preview' />}
            </div>
          </section>

        </form>

      </div>
    </>
  )
}

export default Onboarding