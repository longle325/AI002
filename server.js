import { GoogleGenerativeAI } from "@google/generative-ai";
import { Together } from "together-ai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";

const together = new Together();
const genAI = new GoogleGenerativeAI("AIzaSyATlPLZyiDUGb_-l2zkjMcd4FfCfzLERl8");
const gemini = genAI.getGenerativeModel({ model: "gemini-pro"});

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function getErrorMessage(error) {
  if (error.response && error.response.data && error.response.data.error) {
    return error.response.data.error.message;
  }
  return error.message || "Có lỗi không xác định xảy ra";
}

// Route để xử lý phân loại comment
app.post("/api/classify", async (req, res) => {
  try {
    let comment = req.body.comment;
    let model = req.body.model;

    if (!comment) {
      return res.status(400).json({ error: "Comment không được để trống" });
    }
    // console.log(comment);
    // console.log(model);
    if (model == "ChatGPT 4o"){
    
        let response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o-mini",
            messages: [{
                role: "system",
                content: "Bạn là một hệ thống phân loại comment. Nhiệm vụ của bạn là phân tích comment và xác định xem comment có mang tính phản động (chống phá nhà nước Việt Nam) hay không. Chỉ trả về kết quả theo format sau:\n1 - Comment mang tính phản động\n0 - Comment không mang tính phản động"
            }, {
                role: "user",
                content: comment
            }],
            temperature: 0,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        res.json({ result: response.data.choices[0].message.content})
    }
    else if (model == "Llama 3.3"){
        let response = await together.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "Bạn là một hệ thống phân loại comment. Nhiệm vụ của bạn là phân tích comment và xác định xem comment có mang tính phản động (chống phá nhà nước Việt Nam) hay không. Chỉ trả về kết quả theo format sau:\n1 - Comment mang tính phản động\n0 - Comment không mang tính phản động",
            },
            { role: "user", content: comment },
          ],
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
          max_tokens: 200,
          temperature: 0.7,
          top_p: 0.7,
          top_k: 50,
          repetition_penalty: 1,
          stream: true,
          stop: ["<|eot_id|>", "<|eom_id|>"],
        });
        let result = "";
        for await (let chunk of response) {
          if (chunk.choices && chunk.choices[0] && chunk.choices[0].delta) {
            result += chunk.choices[0].delta.content || "";
          } else {
            console.error("Unexpected chunk structure:", chunk);}
            }
        res.json({ result: result});
        }
    else if (model == "Gemini 2.0"){
        const prompt = {
            contents: [
              {
                role: "user", // Important: Add the role "user" for the instruction
                parts: [{
                  text: "Bạn là một hệ thống phân loại comment. Nhiệm vụ của bạn là phân tích comment và xác định xem comment có mang tính phản động (chống phá nhà nước Việt Nam) hay không. Chỉ trả về kết quả theo format sau:\n1 - Comment mang tính phản động\n0 - Comment không mang tính phản động. Chỉ trả về giá trị 1 hoặc 0!"
                }]
              },
              {
                role: "user", // Important: Add the role "user" for the comment
                parts: [{
                  text: comment
                }]
              }
            ]
          };
        let response = await gemini.generateContent(prompt);
        res.json({result: response.response.text()});

    }

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Có lỗi xảy ra khi xử lý yêu cầu",
      details: getErrorMessage(error),
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});
