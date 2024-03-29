import { Heading } from "@medusajs/ui";
import '../Shipping.css';


const SecondPage = () => {
  return (
    <div style={{ fontFamily: "Times New Roman,serif", backgroundColor: "#FFF" }}>
      {/* Background and Warranty Info */}
      <div className="flex flex-col items-center text-center pt-12 pb-12">
        <Heading level="h1" className="mb-4" style={{ fontFamily: "Times New Roman,serif",color:"black", fontWeight: 600, fontSize:"22px", fontStyle:"italic",textTransform:"uppercase",letterSpacing:"0.01em"}}>
        Shipping And Delivery
        </Heading>
        <div className="mt-6 shipping-main-div" style={{fontFamily:"AvenirNextCyr-Regular",lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
       <p >
       The User may avail services through the Platform and the Company shall dispatch the orders placed through booking on the Platform. The time frame for delivery to be completed within the country shall be based on the lead time. Such services shall be placed for delivery through the third-party service provider providing services in user’s city, state.
         </p>
        <p className="mt-8" style={{fontWeight: "bold"}}>
        Shipping Timelines
        </p>
      
        </div>
        <div className="mt-6 shipping-div" style={{fontFamily:"AvenirNextCyr-Regular",textAlign:"left",fontWeight:500}}>
            <p className="mt-5">
            All the tracking details shall be emailed to the Email Id provided by user on registering on our platform. The user shall have access to these details upon availing the services.
</p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">
All services on our platform shall be inclusive of all charges as mentioned on the website and final invoice that will be generated. User can also see the tracking details through the AWB number provided.  </p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">
If the delivery is incomplete or the delivery has not been undertaken, then the User may raise a complaint on our Customer support email Id provided on the Terms of Service and Privacy Policy. We may investigate into the issue and then proceed at the earliest in case of a discrepancy in providing services to user.  </p>
{/* <div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div> */}
        </div>


        <div className="mt-6 shipping-main-div" style={{fontFamily:"AvenirNextCyr-Regular", lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8" style={{fontWeight: "bold"}}>
        Online Tracking
        </p>
      
        </div>
        <div className="mt-6 shipping-div" style={{fontFamily:"AvenirNextCyr-Regular",textAlign:"left",fontWeight:500}}>
            <p className="mt-5">
            All the tracking details shall be SMSed as well as Emailed to the Registered Mobile Number and Email Id provided by user on registering on our platform. User may have access to these details upon availing the services.
            </p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">
All products placed online will be eligible for online tracking with a tracking ID for order by which user can track delivery on the Platform.
</p>

        </div>
       
      </div>
    </div>
  );
};

export default SecondPage;
