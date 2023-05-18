import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch"; // Import fetch for Node.js
import FormData from "form-data"; // Import form-data

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get data submitted in request's body.
  const body = req.body;

  // Guard clause checks for feedback and comment,
  // and returns early if feedback is not found
  if (!body.feedback) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Feedback not found" });
  }

  // The endpoint where we want to forward the data
  const endpoint =
    "https://38vi2wiqw1.execute-api.us-west-2.amazonaws.com/prod/";

  // Prepare form-data
  const formData = new FormData();
  formData.append("page_id", body.page_id);
  formData.append("was_helpful", body.feedback);
  formData.append("comments", body.comment);

  // The options for the fetch function
  const options = {
    method: "POST",
    body: formData,
  };

  // Forward the data to the other endpoint
  const response = await fetch(endpoint, options);

  if (!response.ok) {
    // If the response is not ok, send a HTTP server error status code
    return res.status(500).json({ data: "Failed to forward feedback" });
  }

  // Everything went fine
  res.status(200).json({ data: `Feedback forwarded successfully` });
  console.log("Feedback forwarded successfully");
}
