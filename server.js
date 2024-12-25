require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

function getErrorMessage(error) {
    if (error.response && error.response.data && error.response.data.error) {
        return error.response.data.error.message;
    }
    return error.message || 'Có lỗi không xác định xảy ra';
}

// Route để xử lý phân loại comment
app.post('/api/classify', async (req, res) => {
    try {
        const { comment } = req.body;
        
        if (!comment) {
            return res.status(400).json({ error: 'Comment không được để trống' });
        }

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
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

        res.json({ result: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Có lỗi xảy ra khi xử lý yêu cầu',
            details: getErrorMessage(error)
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});