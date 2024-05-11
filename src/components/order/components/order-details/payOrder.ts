import axios from 'axios'
import { MEDUSA_BACKEND_URL } from "@/lib/config";


export const payOrder = async(orderId: any)=>{

    console.log('orderId', orderId)
try {
      const response = await axios.post(`${MEDUSA_BACKEND_URL}/store/payOrder`, {
        order_id: orderId,
      });
      console.log('Payment successful:', response.data);
      // Handle success response
    } catch (error) {
      console.error('Payment error:', error);
      // Handle error response
    }
}