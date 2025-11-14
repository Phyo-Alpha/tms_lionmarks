import { ButtonCustom } from "./ui/button-custom";

//---------------- HARDCODED VALUES ----------------
const SECTION_TITLE = "Survey Progress";
const SECTION_DESCRIPTION =
  "Complete the survey to complete your Future Ready Business Index Assessment and get prepared for the future.";
const NOT_ASSIGNED_TEXT = "Not Assigned";
const COMPLETE_TEXT = "Complete";
const OVERALL_PROGRESS_LABEL = "Overall Survey Progress";
const TAKE_SURVEY_BUTTON_TEXT = "Take the Survey";
const TAKE_SURVEY_LINK = "#";
const SURVEYS = [
  {
    id: "1",
    title: "Success Driven",
    completionPercentage: 75,
    assignee: "John Tan",
  },
  {
    id: "2",
    title: "Scaled Globally",
    completionPercentage: 100,
    assignee: "Sarah Lim",
  },
  {
    id: "3",
    title: "Smart Enabled",
    completionPercentage: 100,
    assignee: "David Chen",
  },
  {
    id: "4",
    title: "Skills Empowered",
    completionPercentage: 30,
    assignee: "Michelle Wong",
  },
  {
    id: "5",
    title: "Sustainable Centric",
    completionPercentage: 60,
    assignee: "Alex Kumar",
  },
  {
    id: "6",
    title: "Socially Impactful",
    completionPercentage: 0,
    assignee: "",
  },
];
//---------------- END HARDCODED VALUES ----------------

export const SurveyProgress = () => {
  // Count how many surveys are completed
  const completedCount = SURVEYS.filter((survey) => survey.completionPercentage === 100).length;

  return (
    <div className="border-2 border-primary rounded-lg p-5 mobile-m:p-7 2.5xl:p-8 4xl:p-9 bg-white flex flex-col space-y-1 2.5xl:space-y-3 w-full">
      <h2 className="text-center sm:text-left">{SECTION_TITLE}</h2>
      <p className="text-center sm:text-left">{SECTION_DESCRIPTION}</p>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-3 2.5xl:py-5 
        [&>*]:border-b [&>*]:border-input [&>*:last-child]:border-b-0
        sm:max-md:[&>*:nth-child(odd)]:border-r sm:[&>*]:border-gray-300 sm:[&>*:nth-last-child(-n+2)]:border-b-0
        md:[&>*:nth-child(3n-2)]:border-r md:[&>*:nth-child(3n-1)]:border-r md:[&>*:nth-last-child(-n+3)]:border-b-0"
      >
        {SURVEYS.map((survey) => (
          <div key={survey.id} className="text-center p-5 flex flex-col space-y-2">
            <h3
              className={
                survey.completionPercentage === 100 ? "text-primary" : "text-destructive"
              }
            >
              {survey.completionPercentage === 100
                ? COMPLETE_TEXT
                : `${survey.completionPercentage}%`}
            </h3>
            <p className="font-bold">{survey.title}</p>

            <h4 className="italic">
              {survey.assignee && survey.assignee.trim() !== ""
                ? survey.assignee
                : NOT_ASSIGNED_TEXT}
            </h4>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-10 lg:space-x-20 2.5xl:space-x-26">
        {/* dashed progress bar */}
        <div className="flex flex-col flex-1 justify-between space-y-3 md:space-y-0">
          {/* progress label and percentage */}
          <div className="flex flex-col sm:flex-row text-center sm:text-left justify-between space-y-3 sm:space-y-0 ">
            <p className="font-bold">{OVERALL_PROGRESS_LABEL}</p>

            <p className="font-bold">{((completedCount / SURVEYS.length) * 100).toFixed(0)}%</p>
          </div>
          {/* progress bar */}
          <div className="flex gap-1 sm:gap-2 w-full">
            {SURVEYS.map((survey, index) => (
              <div
                key={survey.id}
                className={`h-[0.375rem] 2.5xl:h-2 flex-1 rounded-full ${
                  index < completedCount ? "bg-primary" : "bg-muted"
                }`}
                style={{ borderRadius: "4px" }}
              />
            ))}
          </div>
        </div>

        {/* take survey button */}
        <div className="w-auto">
          <ButtonCustom className="w-full" href={TAKE_SURVEY_LINK}>
            {TAKE_SURVEY_BUTTON_TEXT}
          </ButtonCustom>
        </div>
      </div>
    </div>
  );
};
