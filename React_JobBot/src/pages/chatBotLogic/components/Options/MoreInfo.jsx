import React from "react";
import {useState,useEffect} from "react";

import "./Options.css";

const MoreInfo = (props) => {

    function moreInfo(){
        return (
            <div>
                For more information click <a href="../../../about">here</a>
            </div>
            );
    }

    function selfJobSearch(){
        return (
            <div>
                To self job search click <a href="/jobs">here</a>
            </div>
            );
    }

    return (
        (props.node.getSelected().field==="Other")?moreInfo():selfJobSearch()
    );
};

export default MoreInfo;

