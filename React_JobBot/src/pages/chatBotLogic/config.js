import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";

import dec_tree from "./getFlowText.js"
import FieldOptions from "./components/Options/FieldOptions";
import Quiz from "./components/Quiz/Quiz";
import Approval from "./components/Options/Approval";
import JobTitles from "./components/Options/JobTitles";
import Companies from "./components/Options/Companies";
import Areas from "./components/Options/Areas";
import JobTypes from "./components/Options/JobTypes";


const config = {
  botName: "JOBOT",
  initialMessages: [
    createChatBotMessage(dec_tree.getNextResponse().text),
    createChatBotMessage(dec_tree.getNextResponse().children[0].text, {
      widget: "fieldOptions",
      // delay:2000
    }),
  ],

  // state: {
  //   nodes: [dec_tree],
  // },

  widgets: [
    {
      widgetName: "fieldOptions",
      widgetFunc: (props) => <FieldOptions {...props} />,
      props: {
        node:dec_tree
      }
      // mapStateToProps: [
      //   "nodes",
      // ]
    },
    {
      widgetName: "javascriptQuiz",
      widgetFunc: (props) => <Quiz {...props} />,
      props: {
        questions: [
          {
            question: "What is closure?",
            answer:
              "Closure is a way for a function to retain access to it's enclosing function scope after the execution of that function is finished.",
            id: 1,
          },
          {
            question: "Explain prototypal inheritance",
            answer:
              "Prototypal inheritance is a link between an object and an object store that holds shared properties. If a property is not found on the host object, javascript will check the prototype object.",
            id: 2,
          },
        ],
      },
    },
    {
      widgetName: "approval",
      widgetFunc: (props) => <Approval {...props} />,
      props: {
        node:dec_tree
      }
      // mapStateToProps: [
      //   "nodes",
      // ]
    },
    {
      widgetName: "JobTitles",
      widgetFunc: (props) => <JobTitles {...props} />,
      props: {
        node:dec_tree
      }
    },
    {
      widgetName: "companies",
      widgetFunc: (props) => <Companies {...props} />,
      props: {
        node:dec_tree
      }
    },
    {
      widgetName: "areas",
      widgetFunc: (props) => <Areas {...props} />,
      props: {
        node:dec_tree
      }
    },
    {
      widgetName: "jobTypes",
      widgetFunc: (props) => <JobTypes {...props} />,
      props: {
        node:dec_tree
      }
    }
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: '#376B7E',
    },
    chatButton: {
      backgroundColor: '#376B7E',
    },
  },
};

export default config;
