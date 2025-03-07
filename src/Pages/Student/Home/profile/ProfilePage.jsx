/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Typography,
  Divider,
  Chip,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  Box,
  Paper,
} from "@mui/material";
import {
  CameraAlt,
  Save,
  Edit,
  School,
  Person,
  Settings,
  ContactPhone,
  NotificationsActive,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import useProfile from "../../../../Hooks/useProfile";
import { axiosPublic } from "../../../../Hooks/usePublic";
import StudentNavbar from "../../../StudentDashboard/StudentNavbar/StudentNavbar";

const ProfilePage = () => {
  // States for user data and UI
  const [profileImage, setProfileImage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Get profile data from hook
  const { profile, refetch } = useProfile();

  // States for editable profile sections
  const [studentData, setStudentData] = useState({
    name: "",
    contact: "",
    address: "",
  });

  // Academic info state
  const [academicInfo, setAcademicInfo] = useState({
    student_id: "",
    program: "",
    major: "",
    minor: "",
    current_gpa: "",
    year_of_study: "",
    semester: "",
  });

  // Emergency contact state
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    contact: "",
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    language: "English",
    notification_preferences: {
      email_notifications: true,
      sms_notifications: true,
      push_notifications: false,
    },
  });

  // Fetch student data when profile loads
  useEffect(() => {
    if (profile?._id) {
      fetchStudentData(profile._id);
    }
  }, [profile]);

  // Fetch student data from API
  const fetchStudentData = async (studentId) => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(`/student/${studentId}`);

      if (response.data && response.data.status) {
        const data = response.data.data;

        // Update basic information
        setStudentData({
          name: data.name || profile?.name || "",
          contact: data.contact || profile?.contact || "",
          address: data.address || profile?.address || "",
        });

        // Update academic information
        setAcademicInfo({
          student_id: data.student_id || "",
          program: data.program || "",
          major: data.academic_info?.major || "",
          minor: data.academic_info?.minor || "",
          current_gpa: data.academic_info?.current_gpa || "",
          year_of_study: data.year_of_study || "",
          semester: data.semester || "",
        });

        // Update emergency contact
        setEmergencyContact({
          name: data.emergency_contact?.name || "",
          relationship: data.emergency_contact?.relationship || "",
          contact: data.emergency_contact?.contact || "",
        });

        // Update preferences
        if (data.preferences) {
          setPreferences({
            language: data.preferences.language || "English",
            notification_preferences: {
              email_notifications:
                data.preferences.notification_preferences
                  ?.email_notifications ?? true,
              sms_notifications:
                data.preferences.notification_preferences?.sms_notifications ??
                true,
              push_notifications:
                data.preferences.notification_preferences?.push_notifications ??
                false,
            },
          });
        }

        // Set profile image if available
        if (data.profile_picture) {
          setProfileImage(data.profile_picture);
        }
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to load student profile data");
    } finally {
      setLoading(false);
    }
  };

  // File upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle form field changes for basic info
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: value,
    });
  };

  // Handle form field changes for emergency contact
  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setEmergencyContact({
      ...emergencyContact,
      [name]: value,
    });
  };

  // Handle notification preference changes
  const handleNotificationChange = (name) => (e) => {
    setPreferences({
      ...preferences,
      notification_preferences: {
        ...preferences.notification_preferences,
        [name]: e.target.checked,
      },
    });
  };

  // Handle language preference change
  const handleLanguageChange = (e) => {
    setPreferences({
      ...preferences,
      language: e.target.value,
    });
  };

  // Save profile updates
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      // Create the update object with the right structure
      const updateData = {
        // Basic info
        name: studentData.name,
        contact: studentData.contact,
        address: studentData.address,

        // Include nested objects directly (not as JSON strings)
        emergency_contact: emergencyContact,
        preferences: preferences,
      };

      // If there's a new profile image, use FormData
      if (profileImage && typeof profileImage !== "string") {
        const formData = new FormData();
        formData.append("profile_picture", profileImage);

        // First update the profile picture
        const token = localStorage.getItem("token");
        await axiosPublic.patch(
          `/student/${profile._id}/profile-picture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Then update the other data as JSON
      const token = localStorage.getItem("token");
      await axiosPublic.patch(`/student/${profile._id}`, updateData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Toggle editing mode off and show success message
      setEditing(false);
      toast.success("Profile updated successfully");

      // Refresh profile data
      refetch();
      fetchStudentData(profile._id);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
    <StudentNavbar />
      <div className="max-w-5xl mx-auto">
        {/* Profile Header Card */}
        <Paper elevation={2} className="mb-6 overflow-hidden rounded-xl">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 relative"></div>
          <div className="p-6 pb-8 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="relative -mt-16">
                <Avatar
                  src={profileImage}
                  sx={{ width: 120, height: 120 }}
                  className="border-4 border-white shadow-lg bg-white"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Typography
                      variant="h4"
                      className="font-bold text-gray-800"
                    >
                      {studentData.name || profile?.name || "Student Profile"}
                    </Typography>
                    <Typography variant="body1" className="text-gray-500">
                      {academicInfo.student_id
                        ? `ID: ${academicInfo.student_id}`
                        : ""}
                      {academicInfo.program ? ` • ${academicInfo.program}` : ""}
                    </Typography>
                  </div>
                  <Button
                    variant={editing ? "contained" : "outlined"}
                    color="primary"
                    startIcon={editing ? <Save /> : <Edit />}
                    onClick={
                      editing ? handleUpdateProfile : () => setEditing(true)
                    }
                    className={`${
                      editing
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "border-indigo-500 text-indigo-500"
                    }`}
                    disabled={loading}
                  >
                    {editing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <Chip
                    label={profile?.role || "Student"}
                    size="small"
                    className="bg-blue-100 text-blue-800"
                  />
                  <Chip
                    label={academicInfo.semester || "Current Semester"}
                    size="small"
                    className="bg-green-100 text-green-800"
                  />
                  {academicInfo.current_gpa && (
                    <Chip
                      label={`GPA: ${academicInfo.current_gpa}`}
                      size="small"
                      className="bg-amber-100 text-amber-800"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Paper>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <Paper elevation={1} className="rounded-xl overflow-hidden">
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              className="border-b"
            >
              <Tab icon={<Person />} label="Personal Info" />
              <Tab icon={<School />} label="Academic" />
              <Tab icon={<Settings />} label="Preferences" />
            </Tabs>

            <Box className="p-6">
              {/* Personal Information Tab */}
              {activeTab === 0 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <TextField
                      label="Full Name"
                      name="name"
                      variant="outlined"
                      fullWidth
                      value={studentData.name}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                    <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      value={profile?.gmail || ""}
                      disabled
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <TextField
                      label="Phone Number"
                      name="contact"
                      variant="outlined"
                      fullWidth
                      value={studentData.contact}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                    <TextField
                      label="Address"
                      name="address"
                      variant="outlined"
                      fullWidth
                      value={studentData.address}
                      onChange={handleInputChange}
                      disabled={!editing}
                      multiline
                      rows={1}
                    />
                  </div>

                  <Divider />

                  <div>
                    <Typography
                      variant="h6"
                      className="mb-4 flex items-center gap-2"
                    >
                      <ContactPhone color="primary" />
                      Emergency Contact
                    </Typography>

                    <div className="grid md:grid-cols-3 gap-6">
                      <TextField
                        label="Contact Name"
                        name="name"
                        variant="outlined"
                        fullWidth
                        value={emergencyContact.name}
                        onChange={handleEmergencyContactChange}
                        disabled={!editing}
                      />
                      <TextField
                        label="Relationship"
                        name="relationship"
                        variant="outlined"
                        fullWidth
                        value={emergencyContact.relationship}
                        onChange={handleEmergencyContactChange}
                        disabled={!editing}
                      />
                      <TextField
                        label="Contact Number"
                        name="contact"
                        variant="outlined"
                        fullWidth
                        value={emergencyContact.contact}
                        onChange={handleEmergencyContactChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Information Tab */}
              {activeTab === 1 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <Typography
                      variant="h6"
                      className="flex items-center gap-2"
                    >
                      <School color="primary" />
                      Academic Information
                    </Typography>
                    <Chip
                      label="Year of Study: 2"
                      variant="outlined"
                      color="primary"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="p-4 border rounded-lg">
                      <Typography
                        variant="subtitle2"
                        className="text-gray-500 mb-1"
                      >
                        Student ID
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {academicInfo.student_id}
                      </Typography>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Typography
                        variant="subtitle2"
                        className="text-gray-500 mb-1"
                      >
                        Program
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {academicInfo.program}
                      </Typography>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Typography
                        variant="subtitle2"
                        className="text-gray-500 mb-1"
                      >
                        Major
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {academicInfo.major}
                      </Typography>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Typography
                        variant="subtitle2"
                        className="text-gray-500 mb-1"
                      >
                        Minor
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {academicInfo.minor}
                      </Typography>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Typography
                        variant="subtitle2"
                        className="text-gray-500 mb-1"
                      >
                        Current GPA
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {academicInfo.current_gpa}
                      </Typography>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Typography
                        variant="subtitle2"
                        className="text-gray-500 mb-1"
                      >
                        Current Semester
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {academicInfo.semester}
                      </Typography>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
                    <Typography variant="body2">
                      Academic information is managed by the university
                      registrar&apos;s office and cannot be edited here. Please
                      contact the registrar for any changes to your academic
                      records.
                    </Typography>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 2 && (
                <div className="space-y-6">
                  <Typography
                    variant="h6"
                    className="mb-4 flex items-center gap-2"
                  >
                    <NotificationsActive color="primary" />
                    Notification Preferences
                  </Typography>

                  <div className="space-y-4">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            preferences.notification_preferences
                              .email_notifications
                          }
                          onChange={handleNotificationChange(
                            "email_notifications"
                          )}
                          disabled={!editing}
                          color="primary"
                        />
                      }
                      label="Email Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            preferences.notification_preferences
                              .sms_notifications
                          }
                          onChange={handleNotificationChange(
                            "sms_notifications"
                          )}
                          disabled={!editing}
                          color="primary"
                        />
                      }
                      label="SMS Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            preferences.notification_preferences
                              .push_notifications
                          }
                          onChange={handleNotificationChange(
                            "push_notifications"
                          )}
                          disabled={!editing}
                          color="primary"
                        />
                      }
                      label="Push Notifications"
                    />
                  </div>

                  <Divider />

                  <div>
                    <Typography variant="subtitle1" className="mb-2">
                      Language Preference
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      variant="outlined"
                      value={preferences.language}
                      onChange={handleLanguageChange}
                      disabled={!editing}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="English">English</option>
                      <option value="Bengali">Bengali</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Arabic">Arabic</option>
                    </TextField>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 mt-4">
                    <Typography variant="body2">
                      These preferences control how you receive information
                      about important university announcements, course updates,
                      and events.
                    </Typography>
                  </div>
                </div>
              )}
            </Box>
          </Paper>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;