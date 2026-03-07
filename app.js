const express = require('express');
const app = express();
const port = 3000;

// 🟢 ส่วนที่ต้องเพิ่มที่ 1: ตัวแปลงภาษา 
// ต้องบอกให้ Express รู้จักวิธีอ่านข้อมูลแบบ JSON ที่หน้าบ้านส่งมาก่อน
app.use(express.json()); 

let trainees = [
    { id: 101, name: "สมชาย", attendance: 100, status: "Passed" },
    { id: 102, name: "วิชัย", attendance: 70, status: "Blacklisted" }
];

app.get('/trainees', (req, res) => {
    res.json({ success: true, message: "ดึงข้อมูลผู้เข้าอบรมสำเร็จ", data: trainees });
});

// 🟢 ส่วนที่ต้องเพิ่มที่ 2: สร้าง Route สำหรับรับข้อมูล (POST)
app.post('/trainees', (req, res) => {
    // req.body คือ "ก้อนข้อมูล" ที่ Postman (หรือหน้าบ้าน) ส่งมาให้เรา
    const newTrainee = req.body; 
    
    // เอาข้อมูลใหม่ ยัดต่อท้ายเข้าไปใน Array
    trainees.push(newTrainee); 

    // ส่งข้อความกลับไปบอกหน้าบ้านว่า "บันทึกสำเร็จแล้วนะ!"
    res.json({
        success: true,
        message: "เพิ่มผู้เข้าอบรมคนใหม่เรียบร้อย!",
        data: newTrainee
    });
});

// :id คือการบอก Express ว่า "ตรงนี้คือตัวแปรนะ ไม่ใช่คำว่า id ดื้อๆ"
app.delete('/trainees/:id', (req, res) => {
    
    // ดึงรหัส ID ที่ส่งมากับ URL (req.params)
    // ต้องแปลงเป็นตัวเลข (parseInt) เพราะข้อมูลจาก URL จะมาเป็นตัวอักษรเสมอ
    const targetId = parseInt(req.params.id);

    // ท่าไม้ตายของเรามาแล้ว! ใช้ .filter() คัดเฉพาะคนรหัส "ไม่ตรง" กับที่ส่งมา เก็บไว้
    // เท่ากับว่าคนที่รหัส "ตรง" จะถูกเตะออกจาก Array
    trainees = trainees.filter(t => t.id !== targetId);

    res.json({
        success: true,
        message: `ลบข้อมูลผู้เข้าอบรมรหัส ${targetId} ออกจากระบบแล้ว`,
        data: trainees // ส่งข้อมูลที่เหลือกลับไปให้ดูด้วย
    });
});

app.listen(port, () => {
    console.log(`🚀 Server กำลังรันอยู่ที่ http://localhost:${port}`);
});