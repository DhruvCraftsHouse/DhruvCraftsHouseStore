"use client";
import HeadingPage from "./components/headingpage"; 
import SecondPage from "./components/secondpage"



const RefundandCancellationTemplate = () => {
  return (
    <div className="h-auto w-full border-b border-ui-border-base relative flex flex-col " style={{ fontFamily: "Warnock Pro Display",background: "#F5F6FA" }}>
     <HeadingPage />
     <SecondPage />
    </div>
  );
};

export default RefundandCancellationTemplate;
