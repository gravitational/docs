import styles from "./Feedback.module.css";
import React, { FormEvent, useState } from "react";
import ButtonPrimary from "components/Button";
import { sendDocsFeedback } from "utils/posthog";
import Button from "components/Button"
import Image from "next/image";
import ThumbsUp from "./thumbs-up.svg"
import ThumbsDown from "./thumbs-down.svg"

export default function PageWithJSbasedForm(props) {
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
      <div className={styles.feedbackForm}>
        <p id="feedback" className={styles.feedbackTitle}> Was this page helpful? </p>
        {showButtons ? (
          <div className={styles.svgContainer}>
            <Image src={ThumbsUp} alt="thumbs-up" height="27" width="27" onClick={() => handleFeedbackClick("yes")}/>
            <Image src={ThumbsDown} alt="thumbs-down" height="27" width="27" onClick={() => handleFeedbackClick("no")}/>
          </div>
        ) : (
          <>
            <div>
              <div className={styles.buttonContainer}>
                <textarea
                  id="comment"
                  name="comment"
                  value={comment}
                  placeholder="Any additional comments..."
                  onChange={(e) => setComment(e.target.value)}
                  style={{ width: "100%", height: "150px", fontFamily: "inherit", resize: "none", borderColor: "#4b31c1", borderRadius: "5px" }}
                />
                <ButtonPrimary type="submit">Submit</ButtonPrimary>
                <p className={styles.feedbackTitle}> or </p>
                <Button
                  as="link"
                  shape="md"
                  variant="secondary"
                  className={styles.button}
                  href={props.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Create Issue in Github
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
