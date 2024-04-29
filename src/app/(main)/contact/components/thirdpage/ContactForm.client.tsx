"use client";

import React, { useState, useEffect, useRef, FormEvent } from 'react';
// import { TextField, Grid, Button, FormLabel, Checkbox, FormControlLabel } from '@mui/material';
import emailjs from 'emailjs-com';
// import { ToastContainer, toast } from 'react-toastify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//to try to increase speed
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import '../Contact.css';
import { emailPattern,namePattern } from '@/lib/util/regex';


const ContactForm = () => {

  const [firstNameValid, setFirstNameValid] = useState(true);
const [lastNameValid, setLastNameValid] = useState(true);
const [emailValid, setEmailValid] = useState(true);

const [firstNameError, setFirstNameError] = useState('');
const [lastNameError, setLastNameError] = useState('');
const [emailError, setEmailError] = useState('');

const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const isValid = namePattern.test(event.target.value);
  setFirstNameValid(isValid);
  setFirstNameError(isValid ? '' : 'Invalid first name');
};

const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const isValid = namePattern.test(event.target.value);
  setLastNameValid(isValid);
  setLastNameError(isValid ? '' : 'Invalid last name');
};

const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const isValid = emailPattern.test(event.target.value);
  setEmailValid(isValid);
  setEmailError(isValid ? '' : 'Invalid email address');
};

  const form = useRef<HTMLFormElement>(null);

  // State to hold the current grid spacing
  const [gridSpacing, setGridSpacing] = useState<number>(10);

  // Effect hook to set grid spacing based on window width
  useEffect(() => {
    const updateGridSpacing = () => {
      // Assuming 'md' breakpoint is at 768px
      setGridSpacing(window.innerWidth >= 768 ? 10 : 2);
    };

    // Set initial spacing
    updateGridSpacing();

    // Add event listener for window resize
    window.addEventListener('resize', updateGridSpacing);

    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', updateGridSpacing);
  }, []);


  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.current) {
      emailjs.sendForm('service_wyejb7i', 'template_vzyxmnu', form.current, '0_YtEx01a1OusTTDW')
        .then((result) => {
          console.log(result.text);
          toast.success("Question submitted successfully!!!");
        }, (error) => {
          console.log(error.text);
          toast.error("Failed to submit form");
        });

      form.current.reset();
    }
  };

  // Inline style for the red asterisk
  const redAsteriskStyle = { color: 'red', marginRight: '4px' };

  // Inline style for the label customization
  const labelStyle = {
    fontSize: '12.6px',
    letterSpacing: '0.5em',
    color: "rgba(0,0,0,0.3)",
    fontWeight: "500",
    marginLeft: "14px"
  };

  const checkboxLabelStyle = {
    fontSize: '2px',
    color: 'rgba(0,0,0,0.6)', // Updated color for the text "processing of personal data"
    fontWeight: 'normal',
  };

  return (
    <div style={{ background: "#FFF", width: "52%" }}>
      <ToastContainer></ToastContainer>
      <form ref={form} onSubmit={sendEmail}>
        <div>
          <Grid container className='input-grid' spacing={gridSpacing}>
            <Grid item xs={12} sm={6}>
            <TextField
  id="firstName"
  name="firstName"
  label="FIRSTNAME"
  variant="standard"
  fullWidth
  required
  error={!firstNameValid}
  helperText={firstNameError}
  onChange={handleFirstNameChange}
  InputLabelProps={{
    style: labelStyle,
    className: 'red-asterisk', // If you're still applying the red-asterisk class
  }}
  
/>

            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="lastName"
                name="lastName"
                label="LASTNAME"
                variant="standard"
                fullWidth
                required
                error={!lastNameValid}
                helperText={lastNameError}
                onChange={handleLastNameChange}
                InputLabelProps={{
                  style: labelStyle,
                  className: 'red-asterisk', // If you're still applying the red-asterisk class
                }}
              />
            </Grid>
          </Grid>
        </div>
        <div className="mt-6">
          <Grid container className='input-grid' spacing={gridSpacing}>
            <Grid item xs={12} sm={6}>
              <TextField id="email" name="email" label="EMAIL" variant="standard" fullWidth required
               error={!emailValid}
               helperText={emailError}
               onChange={handleEmailChange}
                InputLabelProps={{
                  style: labelStyle,
                  className: 'red-asterisk', // If you're still applying the red-asterisk class
                }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="subject" name="subject" label="SUBJECT" variant="standard" fullWidth required
                InputLabelProps={{
                  style: labelStyle,
                  className: 'red-asterisk', // If you're still applying the red-asterisk class
                }} />
            </Grid>
          </Grid>
        </div>


        <div className="mt-6">

          <div className="mb-2 mt-1" style={{ display: "flex", justifyContent: "left", alignItems: "flex-start" }}>
            <FormLabel style={{
              fontFamily: "AvenirNextCyr-Regular", fontSize: "14px", textAlign: "left", letterSpacing: '0.2em',
              color: "rgba(0,0,0,0.3)",
              fontWeight: "500", marginLeft: "12px"
            }}>
              ASK A QUESTION<span style={redAsteriskStyle}>*</span>
            </FormLabel>
          </div>


          <TextField id="message" name="message" multiline required
            rows={4} fullWidth />
        </div>
        <div style={{  alignItems: 'center', marginTop: '20px' }}>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                sx={{
                  color: '#7F3F98', // Normal state color
                  '&.Mui-checked': {
                    color: '#7F3F98', // Color when checked
                  },
                }}
              />
            }
            label=""
            style={checkboxLabelStyle}
          />
          <span className='mr-1' style={{ fontFamily: "AvenirNextCyr-Regular", fontSize: "14px", color: 'rgba(0,0,0,0.9)', marginLeft: "-3%" }}>I agree with the rules </span>
          <span style={{ fontFamily: "AvenirNextCyr-Regular", fontSize: "14px", color: '#7F3F98' }}>processing of personal data</span>
          <span style={{ fontFamily: "AvenirNextCyr-Regular", fontSize: "14px", color: 'red', marginLeft: '4px' }}>*</span>
        </div>
        <div className="mt-6 mb-4" style={{ display: 'flex', justifyContent: 'center', }}>
          <Button type="submit" variant="text" style={{ border: "1.5px solid rgba(0,0,0,0.2)", borderRadius: "30px", fontFamily: "AvenirNextCyr-Regular", color: 'rgba(0,0,0,0.8)', letterSpacing: '0.1em', padding: "1.7% 6.5%" }}>
            ASK A QUESTION
          </Button>

        </div>

      </form>
      
    </div>

  );
};
export default ContactForm;