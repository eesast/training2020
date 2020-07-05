import express from "express";
import secret from "../configs/secret";
import User from "../models/user";
import { sendEmail } from "../helpers";
import {
  newMentorApplicationTemplate,
  updateMentorApplicationTemplate,
  messageReceiveTemplate,
} from "../helpers/htmlTemplates";

const router = express.Router();

router.post("/", async (req, res) => {
  if (req.headers.authorization !== "Bearer " + secret) {
    return res.status(401).send("401 Unauthorized: Wrong secret");
  }

  const payload = req.body;
  const table = payload.table.name;
  const op = payload.event.op;
  const data = payload.event.data.new;

  switch (table) {
    case "mentor_application": {
      const studentId = data.student_id;
      const mentorId = data.mentor_id;
      const student = await User.findOne({ id: studentId });
      if (!student) {
        return res.status(404).send("404 Not Found: Student does not exist");
      }
      const mentor = await User.findOne({ id: mentorId });
      if (!mentor) {
        return res.status(404).send("404 Not Found: Teacher does not exist");
      }

      switch (op) {
        case "INSERT": {
          if (!mentor.email) {
            return res
              .status(422)
              .send("422 Unprocessable Entity: Missing teacher email");
          }
          sendEmail(
            mentor.email!,
            `来自${student.name}同学的新生导师申请`,
            newMentorApplicationTemplate(
              mentor.name,
              student.name,
              "https://info.eesast.com"
            )
          );
          break;
        }
        case "UPDATE": {
          if (!student.email) {
            return res
              .status(422)
              .send("422 Unprocessable Entity: Missing student email");
          }
          sendEmail(
            student.email!,
            `新生导师申请状态更新`,
            updateMentorApplicationTemplate(
              mentor.name,
              student.name,
              "https://info.eesast.com"
            )
          );
          break;
        }
      }
      break;
    }
    case "mentor_message": {
      const from = data.from;
      const to = data.to;
      const fromUser = await User.findOne({ id: from });
      if (!fromUser) {
        return res.status(404).send("404 Not Found: Sender does not exist");
      }
      const toUser = await User.findOne({ id: to });
      if (!toUser) {
        return res.status(404).send("404 Not Found: Receiver does not exist");
      }

      switch (op) {
        case "INSERT": {
          if (!toUser.email) {
            return res
              .status(422)
              .send("422 Unprocessable Entity: Missing receiver email");
          }
          sendEmail(
            toUser.email!,
            `来自${fromUser.name}的新消息`,
            messageReceiveTemplate(
              fromUser.name,
              toUser.name,
              "https://info.eesast.com"
            )
          );
          break;
        }
      }
      break;
    }
  }

  res.status(200).end();
});

export default router;
