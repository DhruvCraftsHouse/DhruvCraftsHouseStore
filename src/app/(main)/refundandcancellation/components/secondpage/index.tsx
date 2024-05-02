import { Heading } from "@medusajs/ui";
import '../Refund.css';


const SecondPage = () => {
  return (
    <div style={{ fontFamily: "Times New Roman,serif", backgroundColor: "#FFF" }}>
      {/* Background and Warranty Info */}
      <div className="flex flex-col items-center text-center pt-12 pb-12">
        <Heading level="h1" className="mb-4" style={{ fontFamily: "Times New Roman,serif",color:"black", fontWeight: 600, fontSize:"22px", fontStyle:"italic",textTransform:"uppercase",letterSpacing:"0.01em"}}>
        &quot;Refund and Cancellation&quot; Policy
        </Heading>
       
        <div className="mt-6" style={{fontFamily:"AvenirNextCyr-Regular", width:"63%",lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8">
            At dhruvcraftshouse.com, we prioritize exceptional customer service, ensuring satisfaction before and after every purchase. Our dedication lies in delivering products promptly and in pristine condition.
                        </p>
      </div>


        <div className="mt-6" style={{fontFamily:"AvenirNextCyr-Regular", width:"63%",lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8" style={{fontWeight: "bold"}}>
        Refunds:
        </p>
      
        </div>
        <div className="mt-6 refund-div" style={{fontFamily:"AvenirNextCyr-Regular",textAlign:"left",fontWeight:500}}>
            <p className="mt-5">
            Contact us immediately for a replacement or refund if you receive a damaged or defective item. If the item is not damaged then no returns are entertained
            </p>
{/* <div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div> */}
<p className="mt-5">
We offer a full refund within 7 days of purchase for items returned in their original condition and packaging, with intact tags.
</p>
<p className="mt-5">
Refunds are processed back to the original payment method within 7-10 business days upon receiving the returned items.
</p>

        </div>
       
        <div className="mt-6" style={{fontFamily:"AvenirNextCyr-Regular", width:"63%",lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8" style={{fontWeight: "bold"}}>
        Cancellations:
        </p>
      
        </div>
        <div className="mt-6 refund-div" style={{fontFamily:"AvenirNextCyr-Regular",textAlign:"left",fontWeight:500}}>
            <p className="mt-5">
            You can cancel your order before it is shipped by contacting us promptly.
                        </p>
{/* <div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div> */}
<p className="mt-5">
Once your order has been shipped, cancellation is not possible.
</p>
<p className="mt-5">
Custom orders or personalized items cannot be returned or cancelled, except in cases of damage or defect.
</p>

        </div>
        <div className="mt-6" style={{fontFamily:"AvenirNextCyr-Regular", width:"63%",lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8" >
            We aim for your complete satisfaction with your purchase. If you have any queries or require clarification on our refund and cancellation policy, feel free to reach out to us.
                                    </p>
      </div>
      </div>
        </div>
  );
};

export default SecondPage;
