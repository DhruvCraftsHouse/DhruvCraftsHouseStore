import { Heading } from "@medusajs/ui";
import '../Refund.css';


const SecondPage = () => {
  return (
    <div style={{ fontFamily: "Times New Roman,serif", backgroundColor: "#FFF" }}>
      {/* Background and Warranty Info */}
      <div className="flex flex-col items-center text-center pt-12 pb-12">
        <Heading level="h1" className="mb-4" style={{ fontFamily: "Times New Roman,serif",color:"black", fontWeight: 600, fontSize:"22px", fontStyle:"italic",textTransform:"uppercase",letterSpacing:"0.01em"}}>
        Refund And Cancellation
        </Heading>
        <div className="mt-6" style={{fontFamily:"AvenirNextCyr-Regular", lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8" style={{fontWeight: "bold"}}>
        Return Requests
        </p>
      
        </div>
        <div className="mt-6 refund-div" style={{fontFamily:"AvenirNextCyr-Regular",textAlign:"left",fontWeight:500}}>
            <p className="mt-5">
            Note that neither the Company nor the Platform shall at any given point of time entertain any request in any manner towards the Cancellation and Refund of the payment made by the user towards the services delivered services to you.
            </p>
{/* <div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div> */}
<p className="mt-5">
Upon your purchase of the products through the Company’s Platform, you do not have the right to place a return request or process a return request on the Platform. The Company deals in Gold and Silver items and hence, return of the goods or products once delivered is not possible.
</p>
{/* <div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div> */}
<p className="mt-5">
You shall not be allowed to return the goods once delivered by the Company under any circumstances whatsoever. The Users may exchange the products the Platform shall provide exchange based on various external factors such as market-rate & wastage as per market standard at the sole cost and expenses of the User as mentioned on the Platform.
</p>

<p className="mt-5">
If the goods so delivered is damage when received, not delivered or any transaction processing error has happened the User may raise a request for new product by contacting the customer care at (+91) 7259533331 within 24 hours from the delivery of the product.</p>
<p className="mt-5">
A return request shall be made only upon the Customer has sufficient proofs for the product to be damaged on delivery or the product so delivered is incorrect.
</p>
<p className="mt-5">
The Return or the Refund process shall be not be undertaken by the Platform if the Customer or the User does not have sufficient proofs towards the same.
</p>
<p className="mt-5">
All requests shall be made by the User by emailing to customercare@kamya.company which will be the official mode of communication with the Platform and the Company. The Company shall waive all other means of communication made.
</p>
{/* <div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div> */}
        </div>


        <div className="mt-6" style={{fontFamily:"AvenirNextCyr-Regular", width:"63%",lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8" style={{fontWeight: "bold"}}>
        Cancellation
        </p>
      
        </div>
        <div className="mt-6 refund-div" style={{fontFamily:"AvenirNextCyr-Regular",textAlign:"left",fontWeight:500}}>
            <p className="mt-5">
            As a User, you do not have the right to cancel your order upon placing the same.
</p>
{/* <div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div> */}
<p className="mt-5">
The Company at its sole discretion may cancel any order(s):
</p>

        </div>
       
      </div>
        </div>
  );
};

export default SecondPage;
