import React, { useState } from 'react';
import { Autocomplete, Box, Button, Container, Paper, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Job, Profile } from '../../types';
import { AppBar } from '../../components';
import UserProfile from '../../components/UserProfile';
import { useGetJobsUnpaid, usePayJob } from '../../services';
import ProfileSelector from '../../components/ProfileSelector';
import { useGetContractById } from '../../services/ContractService';
import DisplayData from '../../components/DisplayData';

const steps = ['Select a contractor', 'Select a Job', 'Pay for a Job'];

type SelectContractorStepProps = {
  onSelectContractor: (contractor: Profile | null) => void;
}
const SelectContractorStep = ({ onSelectContractor }: SelectContractorStepProps) => {
  return (
    <ProfileSelector profileType="contractor" onSelect={onSelectContractor} />
  )
};

type SelectJobStepProps = {
  contractorId: number;
  onSelectJob: (job: Job | null) => void;
}
const SelectJobStep = ({ contractorId, onSelectJob }: SelectJobStepProps) => {
  const [{ data, loading, error }] = useGetJobsUnpaid(contractorId);

  if (error) {
    alert(error);
    return null;
  }

  return (
    <Box p={2} sx={{ display: 'flex', alignContent: 'center' }}>
      <Box margin="auto">
        <Autocomplete
          disabled={loading}
          disablePortal
          onChange={(_event, job) => {
            onSelectJob(job || null);
          }}
          getOptionLabel={(item) => item ? `Price: ${item.price.toFixed(2)} - ${item.description}` : ''}
          options={(data || [])}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Job" />}
        />
      </Box>
    </Box>
  )
};

type PayJobStepProps = {
  contractor: Profile;
  job: Job;
  onPayed: () => void;
  onPayError: () => void;
}
const PayJobStep = ({ contractor, job, onPayError, onPayed }: PayJobStepProps) => {
  const [{ data, loading, error }] = useGetContractById(contractor.id, job.id);

  if (error) {
    console.error('Error on load details!', { error });
    alert('Error on load contract details!');
    return null;
  }

  return (
    <Box p={2} sx={{ display: 'flex', alignContent: 'center', flexDirection: 'column' }}>
      {!loading ? (
        <>
          <Box p={2} sx={{ display: 'flex', alignContent: 'center', flexDirection: 'row' }}>
            <Box sx={{ flexGrow: 1 }}>
              {data?.Client ? (
                <DisplayData title="Client" data={{
                  'Full name': `${data.Client.firstName} ${data.Client.lastName}`,
                  'Balance': data.Client.balance.toFixed(2),
                  'Profession': data.Client.profession,
                }} />
              ) : null}
            </Box>
            <Box sx={{
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
              justifyContent: 'center',
            }}>
              <ArrowRightIcon color="error" />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <DisplayData title="Job" data={{
                'Created at': job.createdAt,
                'Price': job.price.toFixed(2),
              }} />
            </Box>
            <Box sx={{
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
              justifyContent: 'center',
            }}>
              <PaymentsIcon color="success" />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              {data?.Contractor ? (
                <DisplayData title="Contractor" data={{
                  'Full name': `${data.Contractor.firstName} ${data.Contractor.lastName}`,
                  'Balance': data.Contractor.balance.toFixed(2),
                  'Profession': data.Contractor.profession,
                }} />
              ) : null}
            </Box>
          </Box>
          <Box>
            <PayButton clientId={data?.ClientId as number} jobId={job.id} onPayed={onPayed} onError={onPayError}  />
          </Box>
        </>
      ) : (
        <Box>
          <Typography>Loading...</Typography>
        </Box>
      )}
    </Box>
  )
};

type PayButtonProps = {
  clientId: number;
  jobId: number;
  onPayed: () => void;
  onError: (err: any) => void;
}
const PayButton = ({ clientId, jobId, onPayed, onError }: PayButtonProps) => {
  const [{ loading }, execute] = usePayJob(clientId, jobId);

  const handleClick = () => {
    execute()
      .then(onPayed)
      .catch((err) => {
        console.error('Error paying Job!', { err, clientId, jobId });
        if (err.code === 'ERR_BAD_REQUEST' && err.response?.data) {
          alert(err.response.data);
        } else {
          alert('Unknow error while paying a job!');
        }
        onError(err);
      })
  }
  return (
    <Button variant="contained" onClick={handleClick} fullWidth color="success">
      {loading ? 'Paying...' : 'Pay'}
    </Button>
  )
}

export type Props = {};
export default function Home({}: Props): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedContractor, setSelectedContractor] = useState<Profile | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const handleNext = () => {
    if (activeStep === 2) {

    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePayed = () => {
    setActiveStep(0);
    setSelectedContractor(null);
    setSelectedJob(null);
    alert('Payment done!');
  };

  const handlePayError = () => {
    setActiveStep(0);
    setSelectedContractor(null);
    setSelectedJob(null);
  };

  let isNextDisabled = true;
  if (selectedContractor && activeStep === 0) {
    isNextDisabled = false;
  } else if (selectedContractor && selectedJob && activeStep === 1) {
    isNextDisabled = false;
  } else if (activeStep === 2) {
    isNextDisabled = false;
  }

  return (
    <>
      <AppBar />
      <Container sx={{ mt: 10 }}>
        <Box sx={{ flexDirection: 'column' }}>
          <Box mb={4}>
            <UserProfile />
          </Box>

          <Paper sx={{ p: 2 }}>
            <Box mb={2} textAlign="center">
              <Typography variant="h5">Pay for a Job</Typography>
            </Box>
            <Box>
              <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                      optional?: React.ReactNode;
                    } = {};
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                {({
                  0: <SelectContractorStep onSelectContractor={(c) => setSelectedContractor(c)} />,
                  1: <SelectJobStep onSelectJob={(j) => setSelectedJob(j)} contractorId={selectedContractor?.id as number} />,
                  2: <PayJobStep contractor={selectedContractor as Profile} job={selectedJob as Job} onPayed={handlePayed} onPayError={handlePayError} />
                }[activeStep])}
                <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
                  <Button variant="contained" onClick={handleBack} disabled={activeStep === 0}>
                    Back
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  {activeStep < 2 ? (
                    <Button variant="contained" onClick={handleNext} disabled={isNextDisabled}>
                      Continue
                    </Button>
                  ) : null}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
}