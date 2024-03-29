import { Heading } from "@medusajs/ui";
import '../Terms.css';


const SecondPage = () => {
  return (
    <div style={{ fontFamily: "Times New Roman,serif", backgroundColor: "#FFF" }}>
      {/* Background and Warranty Info */}
      <div className="flex flex-col items-center text-center pt-12 pb-12">
        <Heading level="h1" className="mb-4" style={{ fontFamily: "Times New Roman,serif",color:"black", fontWeight: 600, fontSize:"22px", fontStyle:"italic",textTransform:"uppercase",letterSpacing:"0.01em"}}>
        Terms And Conditions
        </Heading>
        <div className="mt-6 terms-main-div" style={{fontFamily:"AvenirNextCyr-Regular", lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
       <p> If you continue to browse and use this website you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern [business name]\&apos;s relationship with you in relation to this website.The term \&apos;Dhruv Crafts House\&apos; or \&apos;us\&apos; or \&apos;we\&apos; refers to the owner of the website whose registered office is 660,11th Main Road, Jayanagar 4th Block, Bangalore 560011. Our company registration number is [company registration number and place of registration]. The term &apos;you&apos; refers to the user or viewer of our website. </p>
        <p className="mt-8" >
        The use of this website is subject to the following terms of use:</p>
      
        </div>
        <div className="mt-6 terms-div" style={{fontFamily:"AvenirNextCyr-Regular",textAlign:"left",fontWeight:500}}>
            <p className="mt-5">The content of the pages of this website is for your general information and use only. It is subject to change without notice.
</p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completenessor suitability of the information and materials found or offered on this website for any particular purpose.You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.</p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">All trade marks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.
</p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence.
</p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s). You may not create a link to this website from another website or document without [business name]\&apos;s prior written consent.</p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">Your use of this website and any dispute arising out of such use of the website is subject to the laws of India or other regulatory authority.
</p>
{/* <div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div> */}
        </div>
       
      </div>
    </div>
  );
};

export default SecondPage;
