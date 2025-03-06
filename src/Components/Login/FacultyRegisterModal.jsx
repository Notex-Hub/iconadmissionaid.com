import { useState } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { axiosPublic } from '../../Hooks/usePublic';

// eslint-disable-next-line react/prop-types
const FacultyRegisterModal = ({ setIsRegisterOpen }) => {
  const [formData, setFormData] = useState({
    role: 'faculty',
    faculty_id: '',
    name: '',
    gmail: '',
    contact: '',
    address: '',
    password: '', // Password would be hashed before storing
    profile_picture: '',
    status: 'unblocked',
    department: '',
    office_location: '',
    courses_taught: [],
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
              [nameParts[2]]: checked, // Update specific checkbox (email_notifications, sms_notifications, etc.)
            },
          },
        });
      }
    } else {
      // If it's not a checkbox, update the nested values using the split name
      if (nameParts.length === 2) { // If it's like academic_info.current_gpa
        setFormData({
          ...formData,
          [nameParts[0]]: {
            ...formData[nameParts[0]],
            [nameParts[1]]: value,
          },
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.name === '') {
      toast.warning('Name is required');
    } else if (formData.gmail === '') {
      toast.warning('Email is required');
    } else if (formData.password === '' || formData.password.length < 6) {
      toast.warning('Password must be at least 6 characters');
    } else if (formData.contact === '') {
      toast.warning('Contact number is required');
    }

    axiosPublic
      .post('/user/create-faculty', formData)
      .then((response) => {
        const user = response.data.data[0];
        console.log(user);
        toast.success('Faculty Registered Successfully, Please Login');
        setIsRegisterOpen(false); 
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          const errorMessages = err.response.data.error.details.map((detail) => detail.message);
          errorMessages.forEach((msg) => toast.error(msg)); // Show all validation errors
        } else {
          toast.error('Something went wrong. Please try again.');
        }
        console.error(err);
      });
  };

  return (
    <Box sx={{ padding: 3, maxHeight: '80vh', overflowY: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Faculty Information Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Faculty ID"
              variant="outlined"
              fullWidth
              name="faculty_id"
              value={formData.faculty_id}
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
          <Grid item xs={12}>
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

          {/* Department and Office Location */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Department"
              variant="outlined"
              fullWidth
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Office Location"
              variant="outlined"
              fullWidth
              name="office_location"
              value={formData.office_location}
              onChange={handleChange}
            />
          </Grid>

          {/* Courses Taught */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Courses Taught (comma separated)"
              variant="outlined"
              fullWidth
              name="courses_taught"
              value={formData.courses_taught.join(', ')}
              onChange={(e) => setFormData({ ...formData, courses_taught: e.target.value.split(', ') })}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default FacultyRegisterModal;
