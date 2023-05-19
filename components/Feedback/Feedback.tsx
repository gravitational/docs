import React, { FormEvent, useState } from "react";
import ButtonPrimary from "components/Button";
import { sendDocsFeedback } from "utils/posthog";

export default function PageWithJSbasedForm() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [showButtons, setShowButtons] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!feedback) {
      alert("Please select a feedback!");
      return;
    }

    const data = {
      feedback,
      comment,
      url: window.location.pathname, // This will include the current page URL
    };

    const JSONdata = JSON.stringify(data);

    const endpoint = "api/feedback";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    //Send feedback to posthog
    void sendDocsFeedback(feedback, comment);

    setIsSubmitted(true);
  };

  const handleFeedbackClick = (feedbackValue: string) => {
    setFeedback(feedbackValue);
    setShowButtons(false);
  };

  if (isSubmitted) {
    return <p>Thank you for your feedback.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Was this helpful?</p>
      {showButtons ? (
        <>
          <button
            type="button"
            onClick={() => handleFeedbackClick("yes")}
            style={{ fontSize: "24px" }}
          >
            👍
          </button>
          <button
            type="button"
            onClick={() => handleFeedbackClick("no")}
            style={{ fontSize: "24px" }}
          >
            👎
          </button>
        </>
      ) : (
        <>
          <p>Any additional comments:</p>
          <div>
            <textarea
              id="comment"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: "100%", height: "150px" }}
            />

            <ButtonPrimary type="submit">Submit</ButtonPrimary>
          </div>
        </>
      )}
    </form>
  );
}
