import { Heading } from "@medusajs/ui";
import '../Environment.css';


const SecondPage = () => {
  return (
    <div style={{ fontFamily: "Times New Roman,serif", backgroundColor: "#FFF" }}>
      {/* Background and Warranty Info */}
      <div className="flex flex-col items-center text-center pt-12 pb-12">
        <Heading level="h1" className="mb-4" style={{ fontFamily: "Times New Roman,serif",color:"black", fontWeight: 600, fontSize:"22px", fontStyle:"italic",textTransform:"uppercase",letterSpacing:"0.01em"}}>
        Environmental Responsibility
        </Heading>
       
        <div className="mt-6" style={{fontFamily:"AvenirNextCyr-Regular", width:"63%",lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8">

        At Dhruvcraftshouse.com, we are committed to environmental responsibility and have implemented various initiatives to minimize our impact on the environment. Here are some specific environmental initiatives we have taken:                                        </p>
      </div>
     
        <div className="mt-6" style={{fontFamily:"AvenirNextCyr-Regular", width:"63%",lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        
{/* <div className="mt-3" style={{borderBottom:"1px solid rgba(0,0,0,0.4)"}}></div> */}
<p className="mt-5">
<span style={{fontWeight:"bold"}}>Water Conservation:</span> 
We strive to conserve water by reducing water intake from external sources and implementing a system of recycling water in our production process. This involves filtering and reusing water multiple times to minimize freshwater usage.
</p>

<p className="mt-5">
<span style={{fontWeight:"bold"}}>Waste Management:</span>
We aim to minimize waste and emissions, focusing on reducing the use of harmful substances in our production process. Our production cycle does not include processes like pyrolysis that could release harmful substances into the environment.
</p>
<p className="mt-5">
<span style={{fontWeight:"bold"}}>Sustainable Materials:</span> 
We prioritize the use of sustainable materials in our products, focusing on recycling and repurposing waste materials whenever possible. For example, we use excess materials for other purposes, such as filling or insulation.
</p>

<p className="mt-5">
<span style={{fontWeight:"bold"}}>Biodiversity Conservation:</span> 
We are committed to preserving biodiversity in the areas where we operate. This includes rehabilitating damaged areas, planting trees, and protecting local wildlife populations.
</p>

<p className="mt-5">
<span style={{fontWeight:"bold"}}>Community Engagement:</span> 
We engage with local communities to promote environmental awareness and encourage sustainable practices. This includes participating in local conservation initiatives and supporting local environmental organizations.
</p>

<p className="mt-5">
<span style={{fontWeight:"bold"}}>Continuous Improvement:</span> 
We regularly review and update our environmental policies and practices to ensure that we are continually improving our environmental performance. This includes setting ambitious sustainability goals and working towards achieving them.
</p>

        </div>

      
        <div className="mt-6" style={{fontFamily:"AvenirNextCyr-Regular", width:"63%",lineHeight:"1.3em",textAlign:"left",fontWeight:500}}>
        <p className="mt-8">

        By implementing these environmental initiatives, we aim to minimize our impact on the environment, promote sustainability, and contribute to a better future for all.
                                                        </p>
      </div>
      </div>
        </div>
  );
};


export default SecondPage;



