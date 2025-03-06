import { useState } from 'react';
import { Avatar, Button, Grid, Typography, Divider, Chip, IconButton, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { CameraAlt, CloudUpload, Add, Delete, Save } from '@mui/icons-material';
import useUser from '../../../../Hooks/useUser';

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [skills, setSkills] = useState(["JavaScript", "React", "Node.js"]);
  const [newSkill, setNewSkill] = useState("");


  const { profile, isLoading, isError, refetch } = useUser();
  console.log(profile);


  const [experienceList, setExperienceList] = useState([
    { title: "Frontend Developer", company: "Tech Co", duration: "2 years" }
  ]);


  const [educationList, setEducationList] = useState([
    { degree: "BSc in CSE", institution: "XYZ University", year: 2022 }
  ]);

  const [preferences, setPreferences] = useState({
    remote_work: true,
    location: "Dhaka",
    salary_range: "50,000 - 70,000 BDT"
  });

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => setProfileImage(e.target.result);
        reader.readAsDataURL(file);
      } else if (type === 'resume') {
        setResumeFile(file);
      
      }
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...experienceList];
    updatedExperiences[index][field] = value;
    setExperienceList(updatedExperiences);
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...educationList];
    updatedEducation[index][field] = value;
    setEducationList(updatedEducation);
  };


  const handleUpdateJobSeeker =() =>{

  }



  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={3} className="relative">
            <Avatar
              src={profileImage}
              sx={{ width: 150, height: 150 }}
              className="mx-auto border-4 border-indigo-100"
            />
            <input
              accept="image/*"
              id="icon-button-file"
              type="file"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'image')}
            />
            <label htmlFor="icon-button-file" className="absolute bottom-2 right-4 md:right-8">
              <IconButton
                color="primary"
                component="span"
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <CameraAlt />
              </IconButton>
            </label>
          </Grid>

          <Grid item xs={12} md={9}>
            <div className="flex justify-between items-start mb-4">
              <Typography variant="h4" className="font-bold text-gray-800">
                {profile?.name}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={() => setEditing(!editing)}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                {editing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
          
              <TextField
          
                variant="outlined"
                value={profile?.email}
                disabled
                size="small"
              />
              <TextField
                label="Phone Number"
                variant="outlined"
                value="01608371608"
                disabled
                size="small"
              />
            </div>

            <div className="flex items-center gap-4">
              <input
                accept=".pdf"
                id="resume-upload"
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'resume')}
              />
              <label htmlFor="resume-upload">
                <Button
                  variant="outlined"
                  color="primary"
                  component="span"
                  startIcon={<CloudUpload />}
                >
                  Upload Resume
                </Button>
              </label>
              {resumeFile && (
                <Typography variant="body2" className="text-gray-600">
                  {resumeFile.name}
                </Typography>
              )}
            </div>
          </Grid>
        </Grid>

        <Divider className="!my-8" />

        <h1 className='my-2 font-semibold'>This is your Job Seeker Profile Section</h1>
        <Grid container spacing={6}>
      
          <Grid item xs={12} md={6}>
         
            <Section title="Skills">
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    className="bg-indigo-100 text-indigo-800"
                    onDelete={editing ? () => setSkills(skills.filter((_, i) => i !== index)) : null}
                    deleteIcon={<Delete className="w-4 h-4" />}
                  />
                ))}
              </div>
              {editing && (
                <div className="flex gap-2">
                  <TextField
                    label="Add Skill"
                    variant="outlined"
                    size="small"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddSkill}
                    className="bg-indigo-500 hover:bg-indigo-600 h-[40px]"
                  >
                    <Add />
                  </Button>
                </div>
              )}
            </Section>

            <Section className={"!mb-5"} title="Experience">
              {experienceList.map((exp, index) => (
                <div key={index} className="!mb-6 !space-y-4">
                  <TextField
                    label="Title"
                    fullWidth
                    value={exp.title}
                    onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                    disabled={!editing}
                  />
                  <TextField
                    label="Company"
                    fullWidth
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    disabled={!editing}
                  />
                  <TextField
                    label="Duration"
                    fullWidth
                    value={exp.duration}
                    onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                    disabled={!editing}
                  />
                  {editing && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => setExperienceList(experienceList.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {editing && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => setExperienceList([...experienceList, { title: '', company: '', duration: '' }])}
                >
                  Add Experience
                </Button>
              )}
            </Section>
          </Grid>

      
          <Grid item xs={12} md={6}>
            <Section title="Education" className="">
              {educationList.map((edu, index) => (
                <div key={index} className="!mb-6 !space-y-4 !mt-5 ">
                  <TextField
                    label="Degree"
                    fullWidth
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    disabled={!editing}
                  />
                  <TextField
                    label="Institution"
                    fullWidth
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    disabled={!editing}
                  />
                  <TextField
                    label="Graduation Year"
                    fullWidth
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                    disabled={!editing}
                  />
                  {editing && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => setEducationList(educationList.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {editing && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => setEducationList([...educationList, { degree: '', institution: '', year: '' }])}
                >
                  Add Education
                </Button>
              )}
            </Section>

            <Section title="Preferences">
              <div className="!space-y-4">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={preferences.remote_work}
                      onChange={(e) => setPreferences({ ...preferences, remote_work: e.target.checked })}
                      disabled={!editing}
                      color="primary"
                    />
                  }
                  label="Remote Work Preferred"
                />
                <TextField
                  label="Location"
                  fullWidth
                  value={preferences.location}
                  onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                  disabled={!editing}
                />
                <TextField
                  label="Salary Range"
                  fullWidth
                  value={preferences.salary_range}
                  onChange={(e) => setPreferences({ ...preferences, salary_range: e.target.value })}
                  disabled={!editing}
                />
              </div>
            </Section>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
const Section = ({ title, children, className }) => (
  <div className={`${className}"mb-8"`}>
    <Typography variant="h6" className="font-bold text-gray-800 !mb-4">
      {title}
    </Typography>
    {children}
  </div>
);

const PreferenceItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <Typography className="text-gray-600">{label}:</Typography>
    <Typography className="font-medium text-gray-800">{value}</Typography>
  </div>
);

export default ProfilePage;