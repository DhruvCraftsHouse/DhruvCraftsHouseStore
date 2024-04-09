import HeadingPage from "./components/headingpage"; 
import SecondPage from "./components/secondpage"



const TermsandConditionsTemplate = () => {
  return (
    <div className="h-auto w-full border-b border-ui-border-base relative flex flex-col " style={{ fontFamily: "Warnock Pro Display"}}>
     <HeadingPage />
     <SecondPage />
    </div>
  );
};

export default TermsandConditionsTemplate;
