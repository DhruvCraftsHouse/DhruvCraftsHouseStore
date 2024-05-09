import { NextResponse } from "next/server";
// import sha256 from "crypto-js/sha256";
import CryptoJS from 'crypto-js';
import axios from "axios";

export async function POST(req, res) {
  const data = await req.formData();
  const status = data.get("code");
  const merchantId = data.get("merchantId");
  const transactionId = data.get("transactionId");

  const st = `/pg/v1/status/${merchantId}/${transactionId}` + process.env.SALT_KEY;
  const dataSha256 = CryptoJS.SHA256(st).toString(CryptoJS.enc.Hex);

  const checksum = dataSha256 + "###" + process.env.SALT_INDEX;
  console.log(checksum);

  const options = {
    method: "GET",
    url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };

  const response = await axios.request(options);
  console.log("Response code:", response.data.code);

  if (response.data.code === "PAYMENT_SUCCESS") {
    return NextResponse.redirect("http://localhost:3000/success", {
      status: 301,
    });
  } else {
    return NextResponse.redirect("http://localhost:3000/failure", {
      status: 301,
    });
  }
}
