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
       At Dhruvcraftshouse.com, we offer a diverse range of services, tailored to meet the unique needs of our users. When placing an order through our online platform, you can trust us for timely delivery, facilitated by our reliable third-party service providers.
                </p>
        <p className="mt-8" style={{fontWeight: "bold"}}>
        Shipping Timelines:
        </p>
      
        </div>
        <div className="mt-6 shipping-div" style={{fontFamily:"AvenirNextCyr-Regular",textAlign:"left",fontWeight:500}}>
            <p className="mt-5">
            Upon order confirmation, you will receive tracking details via email, enabling you to monitor the progress of your delivery in real-time.
            </p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">
All charges are clearly outlined on our website and final invoice, ensuring transparency and no hidden costs.
</p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">
You can also track your delivery using the tracking number provided, available on our website or through third-party service providers.
</p>
{/* <div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div> */}
        </div>


        <div className="mt-6 shipping-main-div" style={{fontFamily:"AvenirNextCyr-Regular", lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8" style={{fontWeight: "bold"}}>
        Delivery Assurance:
        </p>
      
        </div>
        <div className="mt-6 shipping-div" style={{fontFamily:"AvenirNextCyr-Regular",textAlign:"left",fontWeight:500}}>
            <p className="mt-5">
            In case of incomplete or failed deliveries, please reach out to our dedicated customer support team at support@dhruvcraftshouse.com.
                        </p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">
We will promptly investigate the issue and take necessary action to rectify any discrepancies in our service delivery, ensuring your satisfaction.
</p>

        </div>
       
        <div className="mt-6 shipping-main-div" style={{fontFamily:"AvenirNextCyr-Regular", lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8" style={{fontWeight: "bold"}}>
        Online Tracking:
        </p>
      
        </div>
        <div className="mt-6 shipping-div" style={{fontFamily:"AvenirNextCyr-Regular",textAlign:"left",fontWeight:500}}>
            <p className="mt-5">
            Each online order is assigned a unique tracking ID, allowing you to monitor your delivery progress seamlessly on our third-party service providers&apos; platform.
                                    </p>
<div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div>
<p className="mt-5">
Stay informed and up-to-date with real-time delivery tracking, providing you with peace of mind and convenience.
</p>

        </div>
      </div>
    </div>
  );
};

export default SecondPage;
