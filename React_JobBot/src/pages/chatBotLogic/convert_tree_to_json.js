var jobTypes;
var successfulEnding;
var selfJobSearch;
var goodBy2;
var displayingAdaptedJobs;
var areas={
  title: "",
  text: "In which areas are you interested?",
  options:["South", "North", "Central","All"],
  children:
  [
    {
      title: "user selected areas",
      text: "Excellent, we will consider priority for these areas",
      children:
      [
        jobTypes={
          title: "next question",
          text: "Select job types",
          options: ["Full time", "Part time"],
          children:
          [
            {
              title: "jobs scanning",
              text: "Just a moment please, I'm looking for relevant jobs for you",
              children:
              [
                {
                  title: "display appropriate jobs",
                  text: "Please select appropriate jobs",
                  children:
                  [
                    {
                      title: "first time the user has selected 'Nothing fits'",
                      text: "Just a moment please, I'm looking for relevant jobs for you",
                      children:
                      [
                        {
                          title: "second time the user has selected 'Nothing fits'",
                          text: "Would you like to see jobs with an accurate match?",
                          children:
                          [
                            {
                              title: "user refused to an accurate match",
                              text: "Why don't you want offers anymore? (Type in terms of easy/difficult navigation, simplicity of the system, displaying jobs)",
                              children:
                              [
                                selfJobSearch={
                                  title: "send to self job search",
                                  text: "Ok, you have an opportunity to self job search from our jobs pool here",
                                  children:
                                  [
                                    goodBy2={
                                      title: "goodbye",
                                      text: "It was a pleasure to assist you. Thank you!"
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              title: "user agreed to an accurate match",
                              text: "Select the accuracy level (Multiple choice)",
                              children:
                              [
                                {...selfJobSearch,title: "user selected 'other' level of accuracy"},
                                {
                                  title: "user selected city accuracy",
                                  text: "Select preferred cities",
                                  children:
                                  [            
                                    displayingAdaptedJobs={
                                      title: "user selected cities",
                                      text: "Please select appropriate jobs",
                                      children:
                                      [
                                        {...selfJobSearch,title: "user has selected 'Nothing fits"},
                                        successfulEnding={
                                          title: "user selected at least 1 job",
                                          text: "Wonderful, how would you like to continute? (Multiple choice)",
                                          children:
                                          [
                                            {
                                              title: "viewing additional jobs",
                                              text: "Are you interested in viewing additional jobs in our web?",
                                              children:
                                              [
                                                {...selfJobSearch, title: "user selected 'yes' for viewing additional jobs"},
                                                {...goodBy2, title: "user selected 'no' for viewing additional jobs"}
                                              ]
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                },
                                {
                                  title: "user selected job requirements accuracy",
                                  text: "What is your experience and education in the selected fields?",
                                  children:
                                  [
                                    {...displayingAdaptedJobs, title: "clear typing for experience and education"},
                                    {...selfJobSearch,title: "unclear typing for experience and education"}
                                  ]
                                },
                                {
                                  title: "user selected experience level accuracy",
                                  text: "Select an experience level",
                                  children: {...displayingAdaptedJobs, title: "user selected an experience level"}
                                }
                              ]
                            }
                          ]
                        },
                        successfulEnding
                      ]
                    },
                    successfulEnding
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {...jobTypes,title:"user selected 'all areas'"}
  ]
}

var goodBy1;
var specificCompany;
var chatFlow = {
  title: "greeting",
  text:"Hello, nice to meet you, I am JOBOT. I am here to help you find your dream job!",
  children: 
  [
    {
      title: "field",
      text:"Select a field for job",
      options:["Healthcare", "Marketing", "Arts & Design", "Human Resources", "Finance & Accounting", "Engineering", "Other"],
      children:
      [
        {
          title: "user selected 'other' field",
          text: "Sorry, there is not a job to offer you. Would you like us to save your details for future services?",
          options:["Yes","No"],
          children:
          [
            goodBy1={
            title: "user agreed to save his details",
            text: "Thank you for visiting our site. For more information click here",
            },
            {...goodBy1,title: "user refused to save his details"}
          ]
        },
        {
          title: "user selected fields",
          text: "Select a job title at this field (Multiple jobs)",
          options:[{Healthcare:["A","B","Other"],Marketing:["C","D","Other"],"Arts & Design":["E","F","Other"],'Human Resources':["H","I","Other"],'Finance & Accounting':["J","K","Other"],Engineering:["L","M","Other"]}],
          children:
          [
            specificCompany={
              title: "user selected job titles",
              text: "Great! Do you have any specific companies that you would like to work at? (Multiple companies)",
              options:[{Healthcare:["Clalit","Maccabi","Israeli Defense Forces","Super Pharm","Novartis","I am open to any company"],Marketing:["Yupulse","InspHire","Teva Pharmaceuticals","RYB Technologies","CPS Jobs","I am open to any company"],"Arts & Design":["Yupulse","InspHire","Teva Pharmaceuticals","RYB Technologies","CPS Jobs","I am open to any company"],'Human Resources':["Yupulse","InspHire","Teva Pharmaceuticals","RYB Technologies","CPS Jobs","I am open to any company"],'Finance & Accounting':["Yupulse","InspHire","Teva Pharmaceuticals","RYB Technologies","CPS Jobs","Other"],Engineering:["Yupulse","InspHire","Teva Pharmaceuticals","RYB Technologies","CPS Jobs","Other"]}],
              children:
              [
                {
                  title: "user selected specific companies",
                  text: "Excellent, we will consider priority for these companies",
                  children:
                  [
                    {...areas,title: "next question"}
                  ]
                },            
                {...areas,title: "user selected 'all companies'"}
              ]
            },
            {...specificCompany,title: "user selected 'other' job title"}
          ]
        }
      ],
    }
  ]
};



// function writeDecisionTreeJSON(){
//   const FileSystem = require("fs");
//   FileSystem.writeFile('React_JobBot/src/pages/chatBotLogic/decisionTree.json', JSON.stringify(chatFlow), (err) => {
//      if (err) throw err;
//    });
// }
// writeDecisionTreeJSON();

export default chatFlow;

