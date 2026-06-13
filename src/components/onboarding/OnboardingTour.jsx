import { useEffect, useState } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import { useAuth } from '../../contexts/AuthContext';
import { useSubjects } from '../../hooks/useSubjects';

const CustomTooltip = ({
  index,
  step,
  backProps,
  skipProps,
  primaryProps,
  tooltipProps,
  isLastStep,
}) => {
  return (
    <div {...tooltipProps} className="bg-[#18181c] border border-[#27272a] rounded-xl p-6 shadow-2xl max-w-[350px]">
      <div className="mb-6">
        {step.content}
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#27272a]">
        <div className="flex gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="text-[13px] font-mono text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
            >
              Back
            </button>
          )}
        </div>
        <div className="flex gap-3 items-center">
          <button
            {...skipProps}
            className="text-[13px] font-mono text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
          >
            Skip
          </button>
          <button
            {...primaryProps}
            className="bg-[var(--accent-orange)] text-[#18181b] px-4 py-2 rounded-lg font-mono text-[13px] font-bold tracking-wider hover:opacity-90 transition-opacity"
          >
            {isLastStep ? 'Done' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function OnboardingTour() {
  const { user } = useAuth();
  const { subjects } = useSubjects();
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const tourKey = `tc75_tour_completed_${user.uid}`;
    const hasCompletedTour = localStorage.getItem(tourKey);
    
    // If they have subjects, they are not a new user, or they completed it
    if (hasCompletedTour === 'true' || subjects.length > 0) {
      setRun(false);
      return;
    }

    // Only run if they definitely have NO subjects
    if (!hasCompletedTour && subjects.length === 0) {
      setRun(true);
    }
  }, [user, subjects]);

  const handleJoyrideCallback = (data) => {
    const { status, action, type } = data;
    const finishedStatuses = ['finished', 'skipped'];
    
    if (finishedStatuses.includes(status) || action === 'close' || type === 'tour:end') {
      setRun(false);
      if (user) {
        localStorage.setItem(`tc75_tour_completed_${user.uid}`, 'true');
      }
    }
  };

  const steps = [
    {
      target: 'body',
      content: (
        <div>
          <h2 className="text-xl font-bold mb-2">Welcome to TryCatch75! 🎉</h2>
          <p>Let's get your attendance tracker set up in just a few steps so you never drop below 75%.</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '#manage-subjects-btn',
      content: 'First, add your subjects here. You need subjects before you can track attendance or make a timetable.',
      placement: 'bottom',
    },
    {
      target: 'a[href="/timetable"]',
      content: 'Next, head over to the Schedule to set up your weekly timetable.',
      placement: 'top',
    },
    {
      target: 'a[href="/mark"]',
      content: 'Every day, come here to mark your attendance with a single tap!',
      placement: 'top',
    },
    {
      target: 'a[href="/bunk-planner"]',
      content: 'Use the Bunk Planner to calculate exactly how many classes you can skip without falling into the danger zone.',
      placement: 'top',
    }
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      tooltipComponent={CustomTooltip}
      styles={{
        options: {
          arrowColor: '#18181c',
          overlayColor: 'rgba(0, 0, 0, 0.8)',
        }
      }}
    />
  );
}
