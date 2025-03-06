import { useState } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { axiosPublic } from '../../Hooks/usePublic';

// eslint-disable-next-line react/prop-types
const CantenStaffModal = ({ setIsRegisterOpen }) => {
  const [formData, setFormData] = useState({
    role: 'canteen_staff',
    name: '',
    gmail: '',
    contact: '',
    address: '',
    password: '', // Password will be hashed
    profile_picture: '',
    status: 'unblocked',
    staff_id: '',
    canteen_section: '',
    shift_timing: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nameParts = name.split('.'); // Split the name to target nested properties

    if (type === 'checkbox') {
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
      if (nameParts.length === 2) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for required fields
    if (!formData.name) {
      toast.warning('Name is required');
    } else if (!formData.gmail) {
      toast.warning('Email is required');
    } else if (!formData.password || formData.password.length < 6) {
      toast.warning('Password must be at least 6 characters');
    } else if (!formData.contact) {
      toast.warning('Contact number is required');
    } else if (!formData.staff_id) {
      toast.warning('Staff ID is required');
    } else if (!formData.canteen_section) {
      toast.warning('Canteen section is required');
    } else {
      // If validation passes, send the data to the server
      try {
        const response = await axiosPublic.post('/user/create-canteen-staff', formData);
        toast.success('Canteen Staff Registered Successfully');
        setIsRegisterOpen(false);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          const errorMessages = err.response.data.error.details.map((detail) => detail.message);
          errorMessages.forEach((msg) => toast.error(msg)); // Show all validation errors
        } else {
          toast.error('Something went wrong. Please try again.');
        }
        console.error(err);
      }
    }
  };

  return (
    <Box sx={{ padding: 3, maxHeight: '80vh', overflowY: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Canteen Staff Registration Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Personal Information */}
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
              type="password"
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

          <Grid item xs={12} sm={6}>
            <TextField
              label="Staff ID"
              variant="outlined"
              fullWidth
              name="staff_id"
              value={formData.staff_id}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Canteen Section"
              variant="outlined"
              fullWidth
              name="canteen_section"
              value={formData.canteen_section}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Shift Timing"
              variant="outlined"
              fullWidth
              name="shift_timing"
              value={formData.shift_timing}
              onChange={handleChange}
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

export default CantenStaffModal;
