import  { useState } from 'react';
import { TextField, Button, Grid, Box, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { toast } from 'react-toastify';
import { axiosPublic } from '../../Hooks/usePublic';

// eslint-disable-next-line react/prop-types
const StudentRegisterModal = ({ setIsRegisterOpen }) => {
  const [formData, setFormData] = useState({
    role:'student', 
    student_id: '',
    name: '',
    gmail: '',
    contact: '',
    address: '',
    password: '', // Password would be hashed before storing
    program: '',
    year_of_study: '',
    profile_picture: '',
    semester: '',
    preferences: {
      language: 'English',
      notification_preferences: {
        email_notifications: false,
        sms_notifications: false,
        push_notifications: false
      }
    },
    academic_info: {
      current_gpa: '',
      major: '',
      minor: ''
    },
    emergency_contact: {
      name: '',
      relationship: '',
      contact: ''
    },
    status: 'unblocked'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nameParts = name.split('.'); // Split the name to target nested properties
    
    if (type === 'checkbox') {
      // Handle checkbox state updates for nested properties (like notification preferences)
      if (nameParts[0] === 'preferences' && nameParts[1] === 'notification_preferences') {
        setFormData({
          ...formData,
          preferences: {
            ...formData.preferences,
            notification_preferences: {
              ...formData.preferences.notification_preferences,
              [nameParts[2]]: checked // Update specific checkbox (email_notifications, sms_notifications, etc.)
            }
          }
        });
      }
    } else {
      // If it's not a checkbox, update the nested values using the split name
      if (nameParts.length === 2) { // If it's like academic_info.current_gpa
        setFormData({
          ...formData,
          [nameParts[0]]: {
            ...formData[nameParts[0]],
            [nameParts[1]]: value
          }
        });
      } else if (nameParts.length === 3) { // If it's like preferences.notification_preferences.email_notifications
        setFormData({
          ...formData,
          preferences: {
            ...formData.preferences,
            notification_preferences: {
              ...formData.preferences.notification_preferences,
              [nameParts[2]]: value
            }
          }
        });
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    }
  };


  

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Ensure current_gpa is a number
    if (formData.academic_info && formData.academic_info.current_gpa) {
      formData.academic_info.current_gpa = parseFloat(formData.academic_info.current_gpa);
    }
  
    if (formData.name === '') {
      toast.warning('Name is required');
    } else if (formData.gmail === '') {
      toast.warning('Email is required');
    } else if (formData.password === '' || formData.password.length < 6) {
      toast.warning('Password must be at least 6 characters');
    } else if (formData.contact === '') {
      toast.warning('Contact number is required');
    }
  
    axiosPublic.post('/user/create-student', formData)
      .then((response) => {
        const user = response.data.data[0];
        console.log(user);
        toast.success('Please Login');
        setIsRegisterOpen(false); 
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.error) {
          const errorMessages = err.response.data.error.details.map(detail => detail.message);
          errorMessages.forEach(msg => toast.error(msg)); // Show all validation errors
        } else {
          toast.error('Something went wrong. Please try again.');
        }
        console.error(err);
      });
  };
  
  
  return (
    <Box sx={{ padding: 3, maxHeight: '80vh', overflowY: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Student Information Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Student ID"
              variant="outlined"
              fullWidth
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Gmail"
              variant="outlined"
              fullWidth
              name="gmail"
              value={formData.gmail}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} >
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact"
              variant="outlined"
              fullWidth
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
          </Grid>
        

          {/* Program and Semester */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Program"
              variant="outlined"
              fullWidth
              name="program"
              value={formData.program}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Year of Study"
              variant="outlined"
              fullWidth
              name="year_of_study"
              value={formData.year_of_study}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Semester"
              variant="outlined"
              fullWidth
              name="semester"
              value={formData.semester}
              onChange={handleChange}
            />
          </Grid>

          {/* Preferences */}
     
          <Grid item xs={12} sm={6}>
            <TextField
              label="Current CGPA"
              variant="outlined"
              fullWidth
              name="academic_info.current_gpa"
              value={formData.academic_info.current_gpa}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Major"
              variant="outlined"
              fullWidth
              name="academic_info.major"
              value={formData.academic_info.major}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Minor"
              variant="outlined"
              fullWidth
              name="academic_info.minor"
              value={formData.academic_info.minor}
              onChange={handleChange}
            />
          </Grid>

          {/* Emergency Contact */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Emergency Contact Name"
              variant="outlined"
              fullWidth
              name="emergency_contact.name"
              value={formData.emergency_contact.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Emergency Relationship"
              variant="outlined"
              fullWidth
              name="emergency_contact.relationship"
              value={formData.emergency_contact.relationship}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Emergency Contact Number"
              variant="outlined"
              fullWidth
              name="emergency_contact.contact"
              value={formData.emergency_contact.contact}
              onChange={handleChange}
            />
          </Grid>

          {/* Notification Preferences */}
          <Grid item xs={12}>
          <FormControlLabel
  control={
    <Checkbox
      checked={formData.preferences.notification_preferences.email_notifications}
      onChange={handleChange}
      name="preferences.notification_preferences.email_notifications"
    />
  }
  label="Email Notifications"
/>
<FormControlLabel
  control={
    <Checkbox
      checked={formData.preferences.notification_preferences.sms_notifications}
      onChange={handleChange}
      name="preferences.notification_preferences.sms_notifications"
    />
  }
  label="SMS Notifications"
/>
<FormControlLabel
  control={
    <Checkbox
      checked={formData.preferences.notification_preferences.push_notifications}
      onChange={handleChange}
      name="preferences.notification_preferences.push_notifications"
    />
  }
  label="Push Notifications"
/>

          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit"  fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default StudentRegisterModal;
