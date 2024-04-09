import { Heading } from "@medusajs/ui";
import '../Tailor.css';


const SecondPage = () => {
  return (
    <div style={{ fontFamily: "Times New Roman,serif", backgroundColor: "#FFF" }}>
      {/* Background and Warranty Info */}
      <div className="flex flex-col items-center text-center pt-12 pb-12">
        <Heading level="h1" className="mb-4" style={{ fontFamily: "Times New Roman,serif",color:"black", fontWeight: 600, fontSize:"22px", fontStyle:"italic",textTransform:"uppercase",letterSpacing:"0.01em"}}>
        Tailor Made Creative Solutions
        </Heading>
       
        <div className="mt-6" style={{fontFamily:"AvenirNextCyr-Regular", width:"63%",lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8">
        For Dhruvcraftshouse.com, a tailor-made creative solution would allow customers to collaborate with our skilled artisans to create bespoke, handcrafted pieces tailored to their unique needs and preferences.                        </p>
      </div>


        <div className="mt-6" style={{fontFamily:"AvenirNextCyr-Regular", width:"63%",lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8" >
        The customization process could involve the following steps:
                </p>
      
        </div>
        <div className="mt-6 tailor-div" style={{fontFamily:"AvenirNextCyr-Regular",textAlign:"left",fontWeight:500}}>

{/* <div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div> */}
<p className="mt-5">
<span style={{fontWeight:"bold"}}>Consultation:</span> 
Customers can discuss their ideas and preferences with the Dhruvcraftshouse.com team, who will guide them through the design process.
</p>

<p className="mt-5">
<span style={{fontWeight:"bold"}}>Design:</span>
Based on the customer&apos;s input, the team will create a unique design for the bespoke piece, ensuring it meets the customer&apos;s expectations and fits within their budget.
</p>
<p className="mt-5">
<span style={{fontWeight:"bold"}}>Production:</span> 
The skilled artisans at Dhruvcraftshouse.com will handcraft the piece, following the approved design and using high-quality materials.
</p>
<p className="mt-5">
<span style={{fontWeight:"bold"}}>Delivery:</span> 
Once the bespoke piece is complete, it will be delivered to the customer, who can enjoy a truly unique and personalized handicraft.
</p>
        </div> 
       
        <div className="mt-6" style={{fontFamily:"AvenirNextCyr-Regular", width:"63%",lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8">
        The &quot;Custom Creations&quot; service would be subject to its own set of terms and conditions, which could include:
                </p>
      
        </div>
        <div className="mt-6 tailor-div" style={{fontFamily:"AvenirNextCyr-Regular",textAlign:"left",fontWeight:500}}>
            <p className="mt-5">
            A non-refundable deposit to initiate the customization process.
                                    </p>
<p className="mt-5">
A longer lead time for production and delivery, compared to standard products.
</p>
<p className="mt-5">
The inability to cancel or modify the order once production has started.
</p>
<p className="mt-5">
A clear agreement on the design, materials, and budget before production begins.
</p>
        </div>
        <div className="mt-6" style={{fontFamily:"AvenirNextCyr-Regular", width:"63%",lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8" >
        This tailor-made creative solution would not only enhance the customer experience but also showcase the skills and expertise of the Dhruvcraftshouse.com team, setting the brand apart from its competitors.
                                            </p>
      </div>
      </div>
        </div>
  );
};

export default SecondPage;
